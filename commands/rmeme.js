module.exports = {
    name: 'rmeme',
    description: 'Sends random meme',
    execute(message, args, newEmbed) {
      if (args.length === 0)
      {
        var fs = require('fs');
        var images = JSON.parse(fs.readFileSync('./images.json', 'utf8'));
        var num = Math.floor(images.size * Math.random())
        var file = images.images[num]
        console.log(file)
        var format = file.format  // format should always be jpg, but..
        var score = file.score
        if (format == "JPEG") {
          format = "jpg"
        }
        newEmbed
        .setDescription(`Random meme #${num} with score: ${score}`)
        .attachFile(`../images/memes/${file.name}.${format.toLowerCase()}`)
        .setImage(`attachment://${file.name}.${format.toLowerCase()}`)
        .setTimestamp(new Date())
        message.channel.send(newEmbed).then(async sent => {  // async and await so emojis are always sent in order
          await sent.react('✅')
          await sent.react('❌')
          const filter = (reaction) => {  // look for ✅ or ❌ emoji
              return reaction.emoji.name === '✅' || reaction.emoji.name === '❌';
          };
          sent.awaitReactions(filter, {time: 4000}).then(collect => // four second voting period? maybe more...
              Promise.all(collect.first().message.reactions.map(itr => { // iterate through and wait for it to finish
                // console.log(itr.emoji.name, itr.emoji.reaction.count)
                return itr.emoji.reaction.count  // filter ensures only those reacts are logged
              })).then(v => {
                let newScore = v[0] - v[1]
                if (newScore) // just cause I don't want to write if no changes
                {
                  file.score += newScore // todo, make it so if it's too fast the scores won't be ignored
                  // console.log(file.score)
                  fs.writeFileSync('./images.json', JSON.stringify(images, undefined, 2))
                }
              }).catch(err => console.log(err)) // once finished write back new score
          ).catch(err => {console.log(err)})
        });
      } else if (args.length >= 1) {
        message.channel.send("hello sir")
      }
    },
};