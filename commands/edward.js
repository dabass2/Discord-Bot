module.exports = {
    name: 'edward',
    description: 'Sends a picture of our lord',
    execute(message, args, newEmbed) {
      const directory = '/var/www/leinad/html/images/edward/';
      const fs = require('fs');
      let imgArray = []

      fs.readdirSync(directory).forEach(file => {
        imgArray.push(file)
      });
      var num = Math.floor(Math.random() * imgArray.length)
      let link = "https://leinad.pw/images/edward/" + imgArray[num]
      console.log(link)
      newEmbed
      .setColor(0xf4b042)
      .setDescription("King")
      .setImage(link)
      return message.channel.send(newEmbed)
      // console.log("Sent Edward Picture w/ File Path:", directory + imgArray[num])
    },
};
