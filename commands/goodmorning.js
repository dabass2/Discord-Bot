module.exports = {
  name: 'goodmorning',
  description: 'Wishes a homie goodmorning : )',
  execute(message, args, newEmbed) {
      a = Math.floor(Math.random() * 11);
      if (a >= 8) { // 20% chance
          newEmbed
          .setColor("#ffffff")
          .setDescription('Good morning homie! : ) :sun_with_face:')
          .setImage("https://c.tenor.com/NdzzTkkCvB4AAAAC/peepo-wiadro.gif")
          return message.channel.send(newEmbed);
      } else { // 80% chance
          newEmbed    
          .setColor("#ffffff")
          .setDescription('Good morning homie! : ) :sun_with_face:')
          .setImage("https://i.imgur.com/u2IfXac.png")
          return message.channel.send(newEmbed);
      }

  },
};
