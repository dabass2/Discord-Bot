const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fair')
        .setDescription('Only for the chosen one.'),
    async execute(interaction, msgEmbed) {
        if (interaction.user.id === "109685953911590912") {
            msgEmbed
                .setColor("#FFC0CB")
                .setImage("https://leinad.pw/images/fair.png")
            await interaction.reply({ embeds: [msgEmbed] })
        } else {
            await interaction.reply({ content: "You cannot use this command.", ephemeral: true })
        }
    },
};
