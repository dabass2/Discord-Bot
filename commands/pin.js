module.exports = {
    name: 'pin',
    description: 'pins message maybe',
    execute(message, args)
    {
      class PinStorage {
        constructor(guildID, channelID, msgID)
        {
          this.guildID = guildID;
          this.channelID = channelID;
          this.msgID = msgID;
          console.log(`'Created PinStore with ID's: ${guildID}, ${channelID}, ${msgID}'`)
        }
      }

      const Discord = require("discord.js")
      var pinArray = [];
      if (args.length == 0)
      {
        message.channel.send("Please provide a link to the message you want to pin.")
      }
      else if (args[0] == "list" || args[0] == "l")
      {
        console.log("HAHAHAHAHA")
        var i;
        for (i = 0; i < 2; i++)
        {
          message.channel.send("help")
        }
      }
      else if (args.length == 1)
      {
        const msgLink = args[0]
        msgSplit = msgLink.split("/")
        msgSplit.splice(0, 4)
        guildID = msgSplit[0]
        channelID = msgSplit[1]
        msgID = msgSplit[2]
        const pinMsgData = new PinStorage(guildID, channelID, msgID)
        pinArray.push(pinMsgData)
        console.log(pinMsgData.msgID)

        message.channel.fetchMessage(pinMsgData.msgID).then(message => {
            const embed = new Discord.RichEmbed()
            .setColor(0x32CD32)
            .addField("Pin Content:", message.content)
            .addField("Pin Author:", message.author)
            .addField("Sent On:", message.createdAt)
            .addField("Link:", msgLink)
            message.channel.send({embed});
            console.log("sent pin")
          })
          .catch(console.error);
      }
    }
}
