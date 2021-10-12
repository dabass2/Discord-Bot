module.exports = {
  name: 'poggers',
  description: 'How poggers are you?',
  execute(message, args, newEmbed) {
      message.reply(`You are ${message.author.id % 100}% poggers.`)
  },
};
