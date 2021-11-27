const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow ,MessageButton } = require('discord.js');

const empty = 'SECONDARY'
const player_1 = {
    id: '',
    name: '',
    color: 'PRIMARY',
    emoji: '✖️'
}
const player_2 = {
    id: '',
    name: '',
    color: 'DANGER',
    emoji: '⚫'
}

let running = false
let times_ignored = 0

/* 
    This should all be a class if I were a good boy.
    But when I tried it, it didn't work :nooooo:
*/
let empty_spots = [
    [null,null,null],
    [null,null,null],
    [null,null,null]
]

let game_board = [
    [ create_button("0,0", empty), create_button("0,1", empty), create_button("0,2", empty) ],
    [ create_button("1,0", empty), create_button("1,1", empty), create_button("1,2", empty) ],
    [ create_button("2,0", empty), create_button("2,1", empty), create_button("2,2", empty) ]
]

function create_button(id, style, emoji=null) {
    return new MessageButton()
        .setCustomId(id)
        .setStyle(style)
        .setEmoji(emoji)
        .setLabel(emoji ? '' : ' ')      // Whitespace is necessary if emoji is null.
}

function create_buttons() {
    return [
        { type: 1, components: game_board[0] },
        { type: 1, components: game_board[1] },
        { type: 1, components: game_board[2] }
    ]
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tictactoe')
		.setDescription('Play Tic-Tac-Toe against AI or with a friend')
        .addMentionableOption(option =>
            option.setName('opponent')
                .setDescription('Mention someone to play against.')
        ),
        // .addStringOption(strOption => 
        //     strOption.setName('action')
        //         .setDescription('End Game')
        //         .addChoice('quit', 'quit')
        // ),
	async execute(interaction) {
        /*
            Need to save the original interaction that started the game
            as any other calls to the command will cause an error and crash
            the bot :(
        */
        let og_interaction
        if (running) {
            interaction.reply({ content: 'There is already a game running.', ephemeral: true })
            return
        } else {
            running = true
            og_interaction = interaction
        }

        player_1.id = og_interaction.user.id
        player_1.name = og_interaction.user.username

        let opponent = og_interaction.options.getMentionable('opponent')
        if (opponent && opponent.user.id != interaction.user.id) {
            if (await get_opponent_input(interaction, opponent)) {
                player_2.id = opponent.user.id
                player_2.name = opponent.user.username
            } else {
                interaction.editReply({ content: `${opponent} did not accept match.`, components: [] })
                running = false
                return
            }
        } else {
            player_2.id = "500122158039826433"
            player_2.name = 'tfw'
        }

        let current_turn = Math.round(Math.random())
        let current_player = (current_turn % 2 === 0) ? player_1 : player_2
        let msg = `${current_player.name}'s (${current_player.emoji}) turn`

        // If there's a human opponent, the interaction has already been replied to so gotta edit
        // If AI opponent, no reply yet so reply
        if (opponent && opponent.user.id != interaction.user.id) {
            await og_interaction.editReply({ content: `${current_player.name}'s (${current_player.emoji}) turn`, components: create_buttons() })
        } else {
            await og_interaction.reply({ content: `${current_player.name}'s (${current_player.emoji}) turn`, components: create_buttons() })
        }

        while (true) {
            let turn = await next_turn(og_interaction, current_player)
            if (times_ignored > 4) {
                await og_interaction.editReply({ content: 'No input for over 4 turns. Ending game.' })
                break
            }

            // In this god forsaken if block, sometimes the content message gets overwritten and/or
            // ignored. I do not know why and do not feel like fixing it right now
            if (turn === false) {
                current_turn += 1
                current_player = (current_turn % 2 === 0) ? player_1 : player_2
                msg = `${current_player.name}'s (${current_player.emoji}) turn`
                await og_interaction.editReply({ content: msg, components: create_buttons() })
            } else if (turn === null) {
                await og_interaction.editReply({ content: `Game over!\nTie!`, components: create_buttons() })
                break
            } else {
                await og_interaction.editReply({ content: `Game over!\nWinner: <@${current_player.id}>`, components: create_buttons() })
                break
            }
        }

        reset_game()
    }
}

// Highly advanced Tic-Tac-Toe AI
async function bot_turn() {
    return new Promise((resolve) => {
        while (true) {
            let x = getRandomInt(0, 2)
            let y = getRandomInt(0, 2)
            if (!empty_spots[x][y]) {
                empty_spots[x][y] = 1
                game_board[x][y] = create_button(`${x},${y}`, player_2.color, player_2.emoji)
                break
            }
        }
        resolve(check_win())
    })
}

// Highly advanced Human Tic-Tac-Toe logic
async function next_turn(interaction, player) {
    return new Promise(async resolve => {
        if (player.id === "500122158039826433") {
            let turn = await bot_turn()
            resolve(turn)
            return
        }

        //  || player.id === "500122158039826433"
        // ^^^ Add to filter to debug. Shouldn't matter even if left in, but you know
        const filter = i => i.user.id === player.id

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 })

        collector.on('collect', async i => {
            let x = Number(i.customId.split(',')[0])
            let y = Number(i.customId.split(',')[1])

            if (!empty_spots[x][y]) {
                empty_spots[x][y] = 1
                game_board[x][y] = create_button(`${x},${y}`, player.color, player.emoji)
                collector.stop()
            }

            await i.update({ components: create_buttons() })
        })

        collector.on('end', async collected => {
            if (collected.size > 0) {
                times_ignored = 0
                resolve(check_win())
            }

            times_ignored += 1
            resolve(false)
        })
    })
}

/*
    Yo I straight up copied this code from the mf coding train
    and only changed a few parts to make it work for me breh
    https://github.com/CodingTrain/website/blob/main/CodingChallenges/CC_149_Tic_Tac_Toe/P5/sketch.js
*/
function check_spots(a, b, c) {
    return a.emoji && b.emoji && c.emoji && a.emoji.name === b.emoji.name && b.emoji.name === c.emoji.name
}

function check_win() {
    return new Promise(async resolve => {
        for (let i = 0; i < 3; i++) {
            if (check_spots(game_board[0][i], game_board[1][i], game_board[2][i])) {
                resolve(true)
            }
        }

        for (let i = 0; i < 3; i++) {
            if (check_spots(game_board[i][0], game_board[i][1], game_board[i][2])) {
                resolve(true)
            }
        }

        if (check_spots(game_board[0][0], game_board[1][1], game_board[2][2])) {
            resolve(true)
        } else if (check_spots(game_board[2][0], game_board[1][1], game_board[0][2])) {
            resolve(true)
        }

        let tie_check = await check_tie()
        resolve(tie_check)
    })   
}

function reset_game() {
    empty_spots = [
        [null,null,null],
        [null,null,null],
        [null,null,null]
    ]
    game_board = [
        [ create_button("0,0", empty), create_button("0,1", empty), create_button("0,2", empty) ],
        [ create_button("1,0", empty), create_button("1,1", empty), create_button("1,2", empty) ],
        [ create_button("2,0", empty), create_button("2,1", empty), create_button("2,2", empty) ]
    ]
    player_1.name = ''
    player_1.id = ''
    og_interaction = null
    running = false
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function check_tie() {
    return new Promise((resolve) => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!empty_spots[i][j]) {
                    resolve(false)
                }
            }
        }
        resolve(null)
    })
}

async function get_opponent_input(interaction, player) {
    return new Promise(async resolve => {
        const buttons =
        new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('accept')
                    .setStyle('SUCCESS')
                    .setEmoji('✔️'),
                new MessageButton()
                    .setCustomId('decline')
                    .setStyle('DANGER')
                    .setEmoji('✖️')
            )

        await interaction.reply({ content: `Waiting for ${player} to accept the match...`, components: [buttons] })

        const filter = i => i.user.id === player.user.id

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 })

        let accepted = false
        collector.on('collect', i => {
            collector.stop()
        });

        collector.on('end', collected => {
            if (collected.size > 0 && collected.at(0).customId === 'accept') {
                accepted = true
            }
            resolve(accepted)
        });
    })
}