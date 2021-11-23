const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daddy')
        .setDescription('help me'),
    async execute(interaction, msgEmbed) {
        msgEmbed
            .setColor("#000000")
            .setDescription('Daddy :tired_face:')
            .setThumbnail("https://i.imgur.com/miGCppP.gif")
            .setImage("https://i.imgur.com/miGCppP.gif")
            .setAuthor(interaction.user.username, "https://i.imgur.com/miGCppP.gif")
            .setFooter("🥺", "https://i.imgur.com/miGCppP.gif")
        await interaction.reply({ embeds: [msgEmbed] })
    }
};
