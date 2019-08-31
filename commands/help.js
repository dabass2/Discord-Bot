module.exports = {
    name: 'help',
    description: 'helps the user',
    execute(message, args) {
      const Discord = require("discord.js");
      let usrPic = message.author.displayAvatarURL
      const newEmbed = new Discord.RichEmbed()
      .setColor(0x4286f4)
      .setThumbnail(usrPic)
      .addField(`!praise [user]`, `Praises author or mentioned user. For the extra lonely.`)
      .addField(`!dumber [user1] [user2]`, `Calculates the odds of who is dumber between two people.`)
      .addField(`!noah {request}`, `Gives Noah's website or gives Noah a request that he'll be more than happy to fullfill.`)
      .addField(`!info`, `Gets discord information for command author.`)
      .addField(`!edward`, `Shows a picture of the king himself.`)
      .addField(`!help`, `You're looking at it right now Ben why did you type it again after skipping to this line.`)
      .addField(`!fair`, `It's said only the chosen one can use this command.`)
      .setTimestamp(new Date())
      return message.channel.send(newEmbed);
    },
};
