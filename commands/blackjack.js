const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageButton, MessageActionRow } = require('discord.js');

let times_ignored = 0
let running = false
const players = []
const dealer = {
  deck: [],
  total: 0
}

function createNewPlayer(new_user) {
  new_player = {
    id: new_user.id,
    name: new_user.username,
    won: false,
    stand: false,
    score: 0,
    deck: [],
    total: 0
  }
  players.push(new_player)
}

function create_buttons(disable=false) {
  return new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId("hit")
        .setStyle("SUCCESS")
        .setLabel("Hit")
        .setDisabled(disable),
      new MessageButton()
        .setCustomId("stand")
        .setStyle("DANGER")
        .setLabel("Stand")
        .setDisabled(disable)
    )
}

async function next_turn(interaction, player) {
  return new Promise(async resolve => {
      const filter = i => i.user.id === player.id

      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 })

      collector.on('collect', async i => {
        console.log(i)
        i.update({ content: 'STARTED NOW OMG!!!' })
        collector.stop()
      })

      collector.on('end', async collected => {
          if (collected.size > 1) { // User actually selected something
            resolve(true)
          }

          // User missed their turn
          times_ignored++
          resolve(false)
      })
  })
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blackjack')
		.setDescription('Play a game of blackjack'),
	async execute(interaction, newEmbed) {
    let og_interaction
    if (running) {
        interaction.reply({ content: 'There is already a game running.', ephemeral: true })
        return
    } else {
        running = true
        og_interaction = interaction
    }

    createNewPlayer(og_interaction.user)
    console.log(players[0])
    await og_interaction.deferReply()
    desc = `**__Current Player__**:\n<@${players[0].id}> - Hand: ${players[0].total}\n\n**__Dealer__**:\nHand: **13**\n\n**__Players__**:\n`
    for (let i = 0; i < players.length; i++) {
      desc += `${i+1}. ${players[i].name} (${players[i].score}) - **${players[i].total}**\n`
    }
    newEmbed
      .setTitle("Blackjack")
      .setDescription(desc)
      .setColor(0xf598f3)
    while (running) {
      og_interaction.editReply({ content: 'STARTED NOW OMG!!!', embeds: [newEmbed], components: [create_buttons()] })
      await next_turn(og_interaction, players[0])
      running = false
    }
		// await interaction.editReply({ content: "Done." });
	}
};