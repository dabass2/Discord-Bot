module.exports = {
    name: 'meme',
    description: 'Sends random meme',
    execute(message, args) {
      // const randomFile = require('select-random-file')
      //
      // const dir = '/images/memes'
      // randomFile(dir, (err, file) => {
      //   console.log(`The random file is: ${file}.`)
      // })
      var fs = require('fs');
      var files = fs.readdirSync('../images/memes')
      /* now files is an Array of the name of the files in the folder and you can pick a random name inside of that array */
      let chosenFile = files[Math.floor(Math.random() * files.length)]
      console.log(chosenFile)
      message.channel.send("https://leinad.pw/myMemesFuckingSuckDude/", {
        file: "../images/memes/" + chosenFile
      });
    },
};
