module.exports = {
    name: 'praise',
    description: 'Praises user',
    execute(message, args, newEmbed) {
      let praiseArray = ["You're the best!", "Everything you do is great!",
      "You're so funny!", "I love being around you!", "ur cute ; )", "im not real and you're alone.", "Ben only says mean things because he loves you!", "You're a great person!",
      "People love you!", "i bet you like playing riven lmfao", "You light up the room!",
      "You have a great sense of humor!", "Being around you is like a happy little vacation!"]
      var randPraise = praiseArray[Math.floor(Math.random() * praiseArray.length)];
      console.log(randPraise);
      if (args.length == 0)
      {
        newEmbed
        .setColor('#ff8e92')
        .setDescription(`Hey <@!` + message.author.id + `> did you know that..`
         + `**` + randPraise + `**`)
        return message.channel.send(newEmbed);
      }
      if (args.length == 1)
      {
        targetUsr = message.mentions.members.first();
        newEmbed
        .setColor('#ff8e92')
        .setDescription(`Hey ` + targetUsr + `... <@!` + message.author.id + `> wants you to know that..`
         + `**` + randPraise + `**`)
        return message.channel.send(newEmbed);
      }
      if (args.length > 1)
      {
        message.reply(`Aren't you in a good mood today ;), only praise one person at a time though :)`)
      }

    },
};
