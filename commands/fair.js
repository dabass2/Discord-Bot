module.exports = {
    name: 'fair',
    description: 'Only for the chosen one :flushed:',
    execute(message, args, newEmbed) {
        if (message.author.id === "109685953911590912")
        {
            newEmbed
            .setColor("#FFC0CB")
            .setImage("https://leinad.pw/images/fair.png")
            return message.channel.send(newEmbed);
        }

    },
};
