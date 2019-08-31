module.exports = {
    name: 'expert',
    description: 'expert',
    execute(message, args, newEmbed) {
        newEmbed
        .setColor("#FFFF")
        .setImage("https://leinad.pw/images/expert.jpg")
        return message.channel.send(newEmbed);
    },
};
