const { SlashCommandBuilder } = require('@discordjs/builders');
const expand = require('expand-string-professionally')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('expand')
        .setDescription('For when a string must be expanded')
        .addStringOption(option =>
            option.setName('sentence')
                .setDescription('The string that you want to expand.')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName('amount')
                .setDescription('The amount of expansion desired.')
                .setRequired(true)
        ),
    async execute(interaction) {
        let numSpacing = interaction.options.getNumber('amount')
        let raw_string = interaction.options.getString('sentence')
        let messageToProcess = ''

        if (Number.isInteger(numSpacing * 1)) {
            // Clamp to max value of 16 bit integer, will fix 
            // expand-string-professionally to handle this later, in 10 years probably
            messageToProcess = expand(raw_string, numSpacing > 65536 ? 65536 : numSpacing)
        } else {
            messageToProcess = expand(raw_string.join(' '))
        }

        // Truncate to ensure we do not exceed discord 2000 char limit
        let truncated = messageToProcess.substring(0, Math.min(2000, messageToProcess.length))
        await interaction.reply({ content: truncated })
    },
};
