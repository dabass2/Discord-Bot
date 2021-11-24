const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kateball')
        .setDescription('Ask Kate for life advice!'),
    async execute(interaction, msgEmbed) {
        msgEmbed
            .setColor(0xFFFF)
            .setTitle("Kate Says!")
            .setDescription("just hit it hard tomorrow")
        await interaction.reply({ embeds: [msgEmbed] })
    },
};
