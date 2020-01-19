module.exports = {
    name: 'gluglug',
    description: 'Birds eat too :/',
    execute(message, args, newEmbed) {
        if (message.author.id === "468421106219614208")
        {
            newEmbed
            .setColor(0x800080)
            .setImage("https://leinad.pw/images/crowDog.jpg")
            return message.channel.send(newEmbed)
        }
    },
};
