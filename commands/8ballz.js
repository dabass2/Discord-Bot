const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ballz')
        .setDescription('Ask a question and get a real answer back!')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Question to ask the magic 8 ballz.')
                .setRequired(true)
        ),
    async execute(interaction, msgEmbed) {
        const question = interaction.options.getString('question')

        const ansArray = ["Does it matter", "I guess", "Like I care", "Fuck off", "Suck dick", "Yeah sure", "You wish you could", "Literally die"]
        var arrayChoice = Math.floor(Math.random() * ansArray.length)
        msgEmbed
            .setColor(0x32CD32)
            .setDescription(question)
            .addField(`8ball says:`, ansArray[arrayChoice])
        await interaction.reply({ embeds: [msgEmbed] })
    },
};
