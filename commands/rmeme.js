module.exports = {
    name: 'rmeme',
    description: 'Sends random meme',
    execute(message, args, newEmbed) {
      var fs = require('fs');
      var images = JSON.parse(fs.readFileSync('./images.json', 'utf8'));
      var file = images.images[Math.floor(Math.random() * images.size)]
      var format = file.format  // format should usually be jpg, but..
      if (format == "JPEG") {
        format = "jpg"
      }
      message.channel.send(`Random meme with score: ${file.score}`, {
        file: `../images/memes/${file.name}.${format}`
      });
    },
};