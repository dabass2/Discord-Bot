module.exports = {
    name: 'kateball',
    description: 'Ask Kate for Advice!',
    execute(message, args, newEmbed) {
        newEmbed
        .setColor(0xFFFF)
        .setTitle("Kate Says!")
        .setDescription("just hit it hard tomorrow")
        return message.channel.send(newEmbed);
    },
};
