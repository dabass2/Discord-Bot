module.exports = {
  name: 'weirdchamp',
  description: 'How weirdchamp are you?',
  execute(message, args, newEmbed) {
      message.reply(`You are ${100 - (message.author.id % 100)}% weirdchamp.`)
  },
};
