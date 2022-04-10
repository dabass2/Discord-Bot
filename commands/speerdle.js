const { SlashCommandBuilder } = require('@discordjs/builders');
const { rword } = require('rword');

let running
let og_interaction
let guesses = []
let set_letters = ["", "", "", "", ""]

function check_win(source) {
  console.log(guesses)
  if (guesses.at(-1).value === source) {
    return true
  }
  return false
  // let correct_count = 0
  // for (let i = 0; i < source.length; i++) {
  //   correct_count = set_letters[i] ? 1 : 0
  // }
  // if (correct_count === source.length) {
  //   return true
  // }
  // return false
}

function create_word(source, guess) {
  let rtn = "\`"
  for (let i = 0; i < source.length; i++) {
    if (!set_letters[i] && source[i] === guess[i]) {
      set_letters[i] = source[i]
      rtn += `${source[i]} `
    } else if (!set_letters[i]) {
      rtn += "* "
    } else {
      rtn += `${set_letters[i]} `
    }
  }
  return rtn + "\`"
}

function next_round(curr_round, rand_word, msgEmbed) {
  return new Promise(async resolve => {
    let guess

    const filter = msg => msg.author.id === og_interaction.user.id && msg.content.length === rand_word.length;
    console.log(60000-(curr_round*10000))
    let time_left = 60000-(curr_round*10000)
    if (time_left <= 0) {
      resolve()
    }
    const collector = og_interaction.channel.createMessageCollector({ filter, time: time_left });

    collector.on('collect', msg => {
      guess = msg.content
      collector.stop()
    });

    collector.on('end', async () => {
      if (guess) {
        guesses.push({name: `Guess ${curr_round}`, value: `${guess}`})        
      }
      msgEmbed
        .setDescription("**__Word__**:\n" + create_word(rand_word, (guess ?? "11111")))
        .setFields(guesses)
      await og_interaction.editReply({embeds: [msgEmbed]});
      resolve()
    });
  })
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('speerdle')
		.setDescription("Wordle but you can't take an entire day"),
	async execute(interaction, msgEmbed) {
    console.log(interaction.guild.iconURL())
    if (running) {
      interaction.reply({ content: 'There is already a game running.', ephemeral: true })
      return
    } else {
      running = true
      og_interaction = interaction
    }

    let word_length = 5
    let curr_round = 0
    let rand_word = rword.generate(1, {length: word_length})
    console.log(rand_word)
    msgEmbed
      .setTitle("Speerdle")
      .setDescription("**__Word__**:\n" + create_word(rand_word, "11111"))
      .setColor(0xdb86c3)
    await interaction.reply({embeds: [msgEmbed]})

    while (running) {
      await next_round(curr_round, rand_word, msgEmbed)
      // console.log(check_win(rand_word))
      if (check_win(rand_word) || curr_round > 5) {
        break
      }
      curr_round++
    }
    msgEmbed
      .setDescription(`Game over!\n${rand_word}`)
      .setFields([])
    await interaction.editReply({ embeds: [msgEmbed] })
    guesses = []
    set_letters = ["", "", "", "", ""]
    running = false
	}
};