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
let board_size = 3

/* 
    This should all be a class if I were a good boy.
    But when I tried it, it didn't work :nooooo:
*/
let empty_spots = []
let game_board = []

function create_board() {
    return new Promise(resolve => {
      for (let i = 0; i < board_size; i++) {
        let empty_row = []
        let game_row = []
        for (let j = 0; j < board_size; j++) {
          empty_row.push(null)
          game_row.push(create_button(`${i},${j}`, empty))
        }
        empty_spots.push(empty_row)
        game_board.push(game_row)
      }
      resolve()
    })
}

function create_button(id, style, emoji=null) {
    return new MessageButton()
        .setCustomId(id)
        .setStyle(style)
        .setEmoji(emoji)
        .setLabel(emoji ? '' : ' ')      // Whitespace is necessary if emoji is null.
}

function create_buttons() {
    let buttons = []
    for (let i = 0; i < board_size; i++) {
      buttons[i] = { type: 1, components: game_board[i] }
    }
    return buttons
}

module.exports = {
    data: new SlashCommandBuilder()
      .setName('tictactoe')
      .setDescription('Play Tic-Tac-Toe against AI or with a friend')
          .addMentionableOption(option =>
              option.setName('opponent')
                  .setDescription('Mention someone to play against.')
          )
          .addStringOption(strOption => 
              strOption.setName('size')
                  .setDescription('Choose the board size (Default: 3x3)')
                  .addChoice('4x4', '4')
                  .addChoice('5x5', '5')
          ),
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

          let new_size = og_interaction.options.getString('size')
          if (new_size) {
              board_size = Number(new_size)
          }
          await create_board()

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
        let x
        let y
        while (true) {
            x = getRandomInt(0, board_size-1)
            y = getRandomInt(0, board_size-1)
            if (!empty_spots[x][y]) {
                empty_spots[x][y] = 1
                game_board[x][y] = create_button(`${x},${y}`, player_2.color, player_2.emoji)
                break
            }
        }
        resolve(check_win(x, y))
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
        const filter = i => i.user.id === player.id || player.id === "500122158039826433"

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 })

        let x
        let y
        collector.on('collect', async i => {
            x = Number(i.customId.split(',')[0])
            y = Number(i.customId.split(',')[1])

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
                resolve(check_win(x, y))
            }

            times_ignored += 1
            resolve(false)
        })
    })
}

/*
    Yo I straight up copied this code from stackoverflow
    and only changed a few parts to make it work for me breh
    https://stackoverflow.com/questions/1056316/algorithm-for-determining-tic-tac-toe-game-over
*/
function check_win(x, y) {
    return new Promise(async resolve => {
        let last_emoji = game_board[x][y].emoji.name

        for (let i = 0; i < board_size; i++) {
          if (!game_board[x][i].emoji || game_board[x][i].emoji.name !== last_emoji) {
            break
          } else if (i == board_size - 1) {
            resolve(true)
          }
        }

        for (let i = 0; i < board_size; i++) {
          if (!game_board[i][y].emoji || game_board[i][y].emoji.name !== last_emoji) {
            break
          } else if (i == board_size - 1) {
            resolve(true)
          }
        }

        if (x === y){
          for (let i = 0; i < board_size; i++) {
            if (!game_board[i][i].emoji || game_board[i][i].emoji.name !== last_emoji) {
              break
            } else if (i == board_size - 1) {
              resolve(true)
            }
          }
        }

        if ((x + y) === (board_size - 1)) {
          for (let i = 0; i < board_size; i++) {
              if (!game_board[i][(board_size-1)-i].emoji || game_board[i][(board_size-1)-i].emoji.name !== last_emoji)
                  break
              if (i == board_size - 1) {
                  resolve(true)
              }
          }
        }

        let tie_check = await check_tie()
        resolve(tie_check)
    })   
}

function reset_game() {
    board_size = 3
    empty_spots = []
    game_board = []
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
        for (let i = 0; i < board_size; i++) {
            for (let j = 0; j < board_size; j++) {
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