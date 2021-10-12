module.exports = {
  name: 'weeb',
  description: 'How weeb are you?',
  execute(message, args, newEmbed) {
      message.reply(`You are ${((message.author.id % 100 + message.author.lastMessageID % 100) * Math.floor(Math.random() * 10)) % 100}% weeb.`);
  },
};

