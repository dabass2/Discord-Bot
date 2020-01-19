module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(message, args, newEmbed) {
        message.channel.send('Pong.');
    },
};
