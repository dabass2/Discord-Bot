const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('expert')
        .setDescription("For when there's an expert in the chat"),
    async execute(interaction, msgEmbed) {
        msgEmbed
            .setColor("#FFFF")
            .setImage("https://leinad.pw/images/expert.jpg")
        await interaction.reply({ embeds: [msgEmbed] })
    },
};
