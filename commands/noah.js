const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('noah')
        .setDescription('The command for the lad.')
        .addStringOption(option =>
            option.setName('request')
                .setDescription('Type \"request\" to feed Noah.')
        ),
    async execute(interaction, msgEmbed) {
        const arg = interaction.options.getString('request')
        if (arg === 'request') {
            msgEmbed
                .setColor("#D2691E")
                .setDescription("A simple request...")
                .addField("Request:", "For Noah to please eat my big fat ass until he's full.")
                .addField("Complete Request By:", "Tonight at " + new Date())
                .setTimestamp(new Date())
            await interaction.reply({ embeds: [msgEmbed] })
        } else {
            msgEmbed
                .addField(`Noah's greatest creation`, `https://leinad.pw/noah/`)
                .setColor("#FFC0CB")
                .setTimestamp(new Date())
            await interaction.reply({ embeds: [msgEmbed] })
        }
    },
};
