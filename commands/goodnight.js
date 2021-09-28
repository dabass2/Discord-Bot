module.exports = {
    name: 'goodnight',
    description: 'Wishes a homie goodnight : )',
    execute(message, args, newEmbed) {
        newEmbed
        .setColor("#000000")
        .setDescription('Goodnight homie! : ) :heart:')
        .setImage("https://i.imgur.com/Hy0cpR2.png")
        return message.channel.send(newEmbed);
    },
};
