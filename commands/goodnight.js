module.exports = {
    name: 'goodnight',
    description: 'Wishes a homie goodnight : )',
    execute(message, args, newEmbed) {
        a = Math.floor(Math.random() * 11);
        if (a >= 8) { // 20% chance
            newEmbed
            .setColor("#000000")
            .setDescription('Goodnight Daddy :tired_face:')
            .setThumbnail("https://i.imgur.com/miGCppP.gif")
            .setImage("https://i.imgur.com/miGCppP.gif")
            .setAuthor(message.author.username, "https://i.imgur.com/miGCppP.gif")
            return message.channel.send(newEmbed);
        } else { // 80% chance
            newEmbed
            .setColor("#000000")
            .setDescription('Goodnight homie! : ) :heart:')
            .setImage("https://i.imgur.com/Hy0cpR2.png")
            return message.channel.send(newEmbed);
        }
    },
};
