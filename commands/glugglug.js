const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gluglug')
        .setDescription('A bird has to eat too.'),
    async execute(interaction, msgEmbed) {
        if (interaction.user.id === "468421106219614208") {
            msgEmbed
                .setColor(0x800080)
                .setImage("https://leinad.pw/images/crowDog.jpg")
            await interaction.reply({ embeds: [msgEmbed] })
        } else {
            await interaction.reply({ content: "You cannot use this command.", ephemeral: true })
        }
    },
};
