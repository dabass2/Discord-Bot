const { SlashCommandBuilder } = require('@discordjs/builders');
const { rword } = require('rword');

let running = false
let active_channel
let leaderboard = {}

function calc_game_stats(round, level) {
  const time_limit = (x,z) => Math.max(10 - (Math.floor(2**(x / (5-z)))), 2)
  const word_length = (x,z) => Math.min(Math.round(4*Math.log10(x + z)), 10)

  let final_len = word_length(round, level)
  let rtn_msg = `${Math.max(final_len, 3)}-${final_len + level}`
  // Words in this module cap out at length 10, so do that here too
  // Should honestly just return a hardcoded 10 on round & level > x
  // Where x is the number that makes the equations reach 10 I love math!
  if (final_len + level > 10 || final_len >= 10) {
    rtn_msg = `${final_len}-10`
  }
  return [time_limit(round, level), rtn_msg]
}

function next_round(round, level, msgEmbed) {
  return new Promise(async resolve => {
    let data = calc_game_stats(round, level)
    let time_limit = data[0] * 1000 // to millis
    let word_len = data[1]
    let rand_word = rword.generate(1, {length: word_len})

    let start_time = Date.now()
    let winner = ""
    let end_time = null
    msgEmbed
      .setColor(0x378805)
      .setTitle(`Fast Typing Game`)
      .setDescription(`**\`${rand_word}\`**`)
      .setFields([{name: "Round:", value: `${round}`, inline: true},
          {name: "Time:", value: `${data[0]} seconds`, inline: true}]
      )

		let last_msg = await active_channel.send({ embeds: [msgEmbed] })
    const filter = msg => msg.content.toLowerCase() === rand_word;
    const collector = active_channel.createMessageCollector({ filter, time: time_limit });

    collector.on('collect', msg => {
      end_time = Date.now() - start_time
      winner = msg.author.id
      collector.stop()
    });

    collector.on('end', () => {
      let new_message = 'No one'
      let rtn = false
      if (winner) {
        rtn = true
        // It's possible for the game to be won in under time_limit time but processing takes like 0.0001 seconds more
        // So this takes the floor of those two numbers to prevent Ben being like "BUG BUG BUG !!! LOL XDDDD"
        new_message = `<@${winner}> in ${Math.min(Math.floor(end_time)/1000, time_limit/1000)} seconds!`
      }
      msgEmbed
        .addField("Winner", new_message)
        last_msg.edit({ embeds: [msgEmbed] })
      if (leaderboard[winner]) {
        leaderboard[winner]++
      } else if (winner) {
        leaderboard[winner] = 1
      }
      resolve(rtn)
    });
  })
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('word')
		.setDescription('How fast are you at typing?')
    .addNumberOption(intOption => 
      intOption.setName('difficulty')
        .setDescription('Difficulty Level')
        .addChoice('MonkaS', 1)
        .addChoice('Normal', 2)
        .addChoice('EZClap', 3)
    ),
	async execute(interaction, msgEmbed) {
    let og_interaction
    if (running) {
      interaction.reply({ content: 'There is already a game running.', ephemeral: true })
      return
    } else {
      running = true
      og_interaction = interaction
      // I don't want to constantly reply to the same interaction like in tictactoe or concentration
      // So I've gotta reply to it so discord will stop the loading thing
      og_interaction.reply("Starting a wonderful and epic new game of Fast Typing Game (name WIP)!")
      active_channel = og_interaction.channel
    }

    // Default to difficulty 2, idk if anyone is even going to realize they can change this
    const level = interaction.options.getNumber('difficulty') ?? 2
    let curr_round = 1
    let misses = 0
    while (running) {
      let result = await next_round(curr_round, level, msgEmbed)
      misses = result ? misses : misses + 1
      if (misses > 2) {
        break
      }
      curr_round++
      await sleep(1500)   // calm before the storm
    }

    // https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
    const sort_winners = Object.keys(leaderboard).sort().reduce(
      (obj, key) => {
        obj[key] = leaderboard[key]
        return obj
      },
      {}
    )

    let sorted_board = sort_winners
    let new_desc = 'Game over!\n\nFinal Score:\n'
    let place = 1
    for (const user in sorted_board) {
      new_desc += `${place}: <@${user}> with **${sorted_board[user]}** points\n`
      place++
    }

    msgEmbed
      .setDescription(new_desc)
      .setFields([])
    active_channel.send({embeds: [msgEmbed]})
    leaderboard = {}
    running = false
	}
};

// function debug_stats() {
//   for (let i = 1; i < 31; i++) {
//     let lvl = 3
//     console.log("round", i, "level", lvl)
//     console.log(calc_game_stats(i,lvl))
//   }
// }

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}