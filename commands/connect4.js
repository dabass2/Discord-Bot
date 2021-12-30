const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow ,MessageButton } = require('discord.js');

const board_size = 5
const empty = 'SECONDARY'
const player_1 = {
  id: '',
  name: '',
  color: 'PRIMARY',
  emoji: '🔴'
}
const player_2 = {
  id: '',
  name: '',
  color: 'SUCCESS',
  emoji: '🟡'
}

let empty_spots = []
let game_board = []
let times_ignored = 0
let running = false
let win_num = 4

function create_board() {
    return new Promise(resolve => {
      for (let i = 0; i < board_size; i++) {
        let empty_row = []
        let game_row = []
        for (let j = 0; j < board_size; j++) {
          empty_row.push(null)
          game_row.push(create_button(`${i},${j}`, empty, null, i != 4))
        }
        empty_spots.push(empty_row)
        game_board.push(game_row)
      }
      resolve()
    })
}

function create_button(id, style, emoji=null, disable=false) {
  return new MessageButton()
      .setCustomId(id)
      .setStyle(style)
      .setEmoji(emoji)
      .setLabel(emoji ? '' : ' ')      // Whitespace is necessary if emoji is null.
      .setDisabled(disable)
}

function create_buttons() {
    let buttons = []
    for (let i = 0; i < board_size; i++) {
      buttons[i] = { type: 1, components: game_board[i] }
    }
    return buttons
}

async function next_turn(interaction, player) {
  return new Promise(async resolve => {
      // if (player.id === "500122158039826433") {
      //     let turn = await bot_turn()
      //     resolve(turn)
      //     return
      // }

      //  || player.id === "500122158039826433"
      // ^^^ Add to filter to debug. Shouldn't matter even if left in, but you know
      const filter = i => i.user.id === player.id || player.id === "500122158039826433"

      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 })

      let x,y
      collector.on('collect', async i => {
          x = i.customId.split(",")[0]  // make out of bounds check
          y = i.customId.split(",")[1]
          if (x > 0) {
            game_board[x-1][y] = create_button(`${x-1},${y}`, empty, null, false) 
          }
          game_board[x][y] = create_button(`${x},${y}`, empty, player.emoji, false) 
          await i.update({ components: create_buttons() })
          collector.stop()
      })

      collector.on('end', async collected => {
          if (collected.size > 0) { // User actually selected something
              times_ignored = 0
              console.log(check_win(x,y))
              resolve(false)
          }

          // User missed their turn
          times_ignored += 1
          resolve(false)
      })
  })
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('connect4')
		.setDescription('Play a game of connect4.'),
	async execute(interaction) {
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
	}
};

function check_win(x,y) {
  console.log(x,y)
  if (x + win_num < board_size) {
    for (let i = 0; i < win_num; i++) {
      console.log(x + i)
    }
  }
  if (x - win_num > 0) {
    for (let i = 0; i < win_num; i++) {
      console.log(x - i)
    }
  }
}