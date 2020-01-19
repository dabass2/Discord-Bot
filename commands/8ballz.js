module.exports = {
    name: '8ballz',
    description: 'Ask a question and get a real answer back!',
    execute(message, args, newEmbed) {
        const ballArray = ["Does it matter", "I guess", "Like I care", "Fuck off", "Suck dick", "Yeah sure", "You wish you could", "Literally die"]
        var arrayChoice = Math.floor(Math.random() * 8)
        newEmbed
        .setColor(0x32CD32)
        .addField(`8ball says:`, ballArray[arrayChoice])
        return message.channel.send(newEmbed);
    },
};
