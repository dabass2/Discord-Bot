module.exports = {
    name: 'log',
    description: 'Sends chat logs!',
    execute(message, args, newEmbed) {
        if (message.author.id === "122090401011073029")
        {
            message.reply("Logs PM'd to you : )")
            message.channel.fetchMessages({ limit: 10 })
              .then(messages => console.log(`Received ${messages.size} messages`))
              .catch(console.error);
        }
    },
};
