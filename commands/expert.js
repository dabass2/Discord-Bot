module.exports = {
    name: 'expert',
    description: "For when there's an expert in the chat",
    execute(message, args, newEmbed) {
        newEmbed
        .setColor("#FFFF")
        .setImage("https://leinad.pw/images/expert.jpg")
        return message.channel.send(newEmbed);
    },
};
