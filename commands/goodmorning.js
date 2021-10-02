module.exports = {
  name: 'goodmorning',
  description: 'Wishes a homie goodmorning : )',
  execute(message, args, newEmbed) {
      newEmbed    
      .setColor("#ffffff")
      .setDescription('Goodmorning homie! : ) :sun_with_face:')
      .setImage("https://i.imgur.com/u2IfXac.png")
      return message.channel.send(newEmbed);
  },
};
