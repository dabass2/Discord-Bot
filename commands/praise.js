module.exports = {
    name: 'praise',
    description: 'Praises user',
    execute(message, args, newEmbed) {
      let praiseArray = ["You're the best!", "Everything you do is great!",
      "You're so funny!", "I love being around you!", "ur cute ; )", "im not real and you're alone.", "Ben only says mean things because he loves you!", "You're a great person!",
      "People love you!", "i bet you like playing riven lmfao"]
      var randPraise = praiseArray[Math.floor(Math.random() * praiseArray.length)];
      console.log(randPraise);
      //message.reply(randPraise);
      newEmbed
      .setColor('#ff8e92')
      .setDescription(`Hey <@!` + message.author.id + `> did you know that..`
       + `**` + randPraise + `**`)
      return message.channel.send(newEmbed);
    },
};
