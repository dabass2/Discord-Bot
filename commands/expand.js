const expand = require('expand-string-professionally')

module.exports = {
    name: 'expand',
    description: 'For when a string must be expanded',
    execute(message, args, newEmbed) {
        if (args.length === 0)
            return message.reply(`You didn't give me a string to expand.`);

        let numSpacing = args[0]
        let messageToProcess = ''

        if (Number.isInteger(numSpacing * 1)) {
            // Clamp to max value of 16 bit integer, will fix 
            // expand-string-professionally to handle this later, in 10 years probably
            messageToProcess = expand(args.splice(1).join(' '), numSpacing > 65536 ? 65536 : numSpacing)
        } else {
            messageToProcess = expand(args.join(' '))
        }

        // Truncate to ensure we do not exceed discord 2000 char limit
        let truncated = messageToProcess.substring(0, Math.min(2000, messageToProcess.length))
        return message.channel.send(truncated);
    },
};
