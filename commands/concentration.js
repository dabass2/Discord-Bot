const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageButton } = require('discord.js');

const empty = 'SECONDARY'
const match = 'SUCCESS'
const check = 'DANGER'
const emoji_db = ['🍎', '🥝', '🍒', '🍇', '🍉', '🍑', '🍊', '🍍', '🥑', '🍆', '🥕', '🍓', ]

let board_size = 4
let times_ignored = 0
let game_board = []
let emoji_board = []
let running = false
let start

function create_button(id, style, emoji=null, disable=false) {
  return new MessageButton()
      .setCustomId(id)
      .setStyle(style)
      .setEmoji(emoji)
      .setLabel(emoji ? '' : ' ')      // Whitespace is necessary if emoji is null.
      .setDisabled(disable)
}

function create_board() {
  return new Promise(resolve => {
    let itr = 0
    for (let i = 0; i < board_size; i++) {
      let game_row = []
      let emoji_row = []
      for (let j = 0; j < board_size; j++) {
        if (j % 2 === 0) {
          itr += 1
        }
        emoji_row.push(emoji_db[itr])
        game_row.push(create_button(`${i},${j}`, empty))
      }
      game_board.push(game_row)
      emoji_board.push(emoji_row)
    }
    resolve()
  })
}

function create_game_buttons() {
  let buttons = []
  for (let i = 0; i < board_size; i++) {
    buttons[i] = { type: 1, components: game_board[i] }
  }
  return buttons
}

async function next_turn(interaction, player) {
  return new Promise(async resolve => {
      //  || player.id === "500122158039826433"
      // ^^^ Add to filter to debug. Shouldn't matter even if left in, but you know
      const filter = i => i.user.id === player.id

      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 })

      let x, y
      let first_x, first_y, scnd_x, scnd_y
      let first_emoji = null
      let scnd_emoji = null
      collector.on('collect', async i => {
          x = Number(i.customId.split(',')[0])
          y = Number(i.customId.split(',')[1])
          if (game_board[x][y].emoji) {
            await i.update({ content: 'Press Two Buttons', components: create_game_buttons() })
            return
          }

          let curr_emoji = emoji_board[x][y]
          if (!game_board[x][y].emoji) {
            game_board[x][y] = create_button(`${x},${y}`, check, curr_emoji)

            // Note to future me: Past me wrote this at like midnight and current me is too lazy to change it
            // Also this entire thing is highly sensitive to runtime (i.e. most approaches have concurrency errors)
            if (!first_emoji) {    // No button clicked yet, so save this one as the first
              first_emoji = curr_emoji
              first_x = x
              first_y = y
            } else {   // This is the second button
              scnd_emoji = curr_emoji
              scnd_x = x
              scnd_y = y
              collector.stop()
            }
          }

          await i.update({ content: 'Press Two Buttons', components: create_game_buttons() })
      })

      collector.on('end', async collected => {
          if (collected.size > 1) { // User actually selected something
              times_ignored = 0
              if (scnd_emoji === first_emoji) {
                game_board[first_x][first_y] = create_button(`${first_x},${first_y}`, match, first_emoji)
                game_board[scnd_x][scnd_y] = create_button(`${scnd_x},${scnd_y}`, match, scnd_emoji)
                resolve(await check_win())
              } else {
                await sleep(1000)
                game_board[first_x][first_y] = create_button(`${first_x},${first_y}`, empty)
                game_board[scnd_x][scnd_y] = create_button(`${scnd_x},${scnd_y}`, empty)
                resolve(false)
              }
          }

          // User missed their turn
          times_ignored += 1
          resolve(false)
      })
  })
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('concentration')
		.setDescription('Play a game of concrentration'),
	async execute(interaction) {
    let og_interaction
    if (running) {
        interaction.reply({ content: 'There is already a game running.', ephemeral: true })
        return
    } else {
        running = true
        og_interaction = interaction
        start = performance.now()
    }

    await create_board()
    shuffle(emoji_board)
    shuffle(emoji_board)
    shuffle(emoji_board)

		await og_interaction.reply({ content: 'Concentrate :thinking:', components: create_game_buttons() })
    while (running) {
      if (times_ignored > 2) {
        await og_interaction.editReply({ content: 'No input for over 2 turns. Ending game.' })
        break
      }
      let result = await next_turn(og_interaction, og_interaction.user)
      if (!result) {
        await og_interaction.editReply({ content: 'Concentrate :thinking:', components: create_game_buttons() })
      } else {
        let end = performance.now()
        await sleep(500)
        og_interaction.editReply({ content: `Game Over! Time: ${((end - start)/1000).toFixed(2)}s.`, components: create_game_buttons() })
        break
      }
    }

    reset_game()
	}
}

function reset_game() {
  running = false
  times_ignored = 0
  game_board = []
  emoji_board = []
}

// https://github.com/dabass2/Discord-Bot/blob/master/commands/tictactoe.js#L279
function check_win() {
  return new Promise(resolve => {
    for (let i = 0; i < board_size; i++) {
      for (let j = 0; j < board_size; j++) {
        if (!game_board[i][j].emoji) {
          resolve(false)
        }
      }
    }
    resolve(true)
  })
}

// https://stackoverflow.com/questions/20190110/2d-int-array-shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    for (let j = array[i].length - 1; j > 0; j--) {
      let m = Math.floor(Math.random() * (i+1))
      let n = Math.floor(Math.random() * (j+1))

      let temp = array[i][j]
      array[i][j] = array[m][n]
      array[m][n] = temp
    }
  }
  return array;
}

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}