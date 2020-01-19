module.exports = {
    name: 'rmeme',
    description: 'Sends random meme',
    execute(message, args, newEmbed) {
      var fs = require('fs');
      var files = fs.readdirSync('../images/memes')
      let chosenFile = files[Math.floor(Math.random() * files.length)]
      console.log(chosenFile)
      message.channel.send("https://leinad.pw/myMemesFuckingSuckDude/", {
        file: "../images/memes/" + chosenFile
      });
    },
};
