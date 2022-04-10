const axios = require('axios')

const { SlashCommandBuilder } = require('@discordjs/builders');

const bag_alert_api = "https://alert.leinad.pw"

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bag')
		.setDescription('Check if there is a currently active bag alert'),
	async execute(interaction, msgEmbed) {
		let embed_msg = "No currently active Major Bag Alert"
    let embed_img = null
    let current_alert = await axios.get(bag_alert_api)
    if (current_alert.data.active_alert) {
      embed_msg = "🚨 💰 [**__THERE IS CURRENTLY AN ACTIVE MAJOR BAG ALERT!!!!!!!__**](https://www.youtube.com/watch?v=sAJ_n8iVn6E) 🚨 💰"
      embed_img = "https://c.tenor.com/V37wFJhl8yEAAAAC/rebranding-rebrand1ng.gif"
    }

    msgEmbed
      .setTitle("BAG ALERT")
      .setColor("#a46ee6")
      .setDescription(embed_msg)
      .setImage(embed_img)
      .setTimestamp(new Date())
    interaction.reply({ embeds: [msgEmbed] })
	}
};