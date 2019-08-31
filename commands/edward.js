module.exports = {
    name: 'edward',
    description: 'Edward Cat',
    execute(message, args) {
      const Discord = require("discord.js")
      const directory = '../../var/www/leinad.pw/html/images/edward/';
      const fs = require('fs');
      let imgArray = []

      fs.readdirSync(directory).forEach(file => {
        imgArray.push(file)
      });
      var num = Math.floor(Math.random() * imgArray.length)
      // message.channel.send("Edward", { file: directory + imgArray[num] })
      let link = "https://leinad.pw/images/edward/" + imgArray[num]
      console.log(link)
      const newEmbed = new Discord.RichEmbed()
      .setColor(0xf4b042)
      .setDescription("King")
      .setImage(link)
      return message.channel.send(newEmbed)
      // console.log("Sent Edward Picture w/ File Path:", directory + imgArray[num])
    },
};
