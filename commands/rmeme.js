module.exports = {
    name: 'rmeme',
    description: 'Sends random meme',
    execute(message, args, newEmbed) {
      var fs = require('fs');
      if (args.length === 0)
      {
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
        if ((args[0] === 'upvote' || args[0] === 'downvote') && args[1])
        {
          try {
            var num = Number(args[1])
            var images = JSON.parse(fs.readFileSync('./images.json', 'utf8'));
            if (num >= 0 && num <= images.size)
            {
              var file = images.images[num]
              var format = file.format
              if (format == "JPEG") {
                format = "jpg"
              }
              var newScore = args[0] === 'upvote' ? file.score + 1 : file.score - 1 
              file.score = newScore
              fs.writeFileSync('./images.json', JSON.stringify(images, undefined, 2))
              newEmbed
              .setDescription(`Voted for meme ${num}, new score: ${newScore}`)
              .attachFile(`../images/memes/${file.name}.${format.toLowerCase()}`)
              .setImage(`attachment://${file.name}.${format.toLowerCase()}`)
              .setTimestamp(new Date())
              message.channel.send(newEmbed)
            }
            else
            {
              message.reply("Please send a valid number")
            }
          }
          catch(err) {
            message.reply("Please send a number.")
          }
        }
        else if (typeof Number(args[0]) === 'number')
        {
          var num = Number(args[0])
          var images = JSON.parse(fs.readFileSync('./images.json', 'utf8'));
          if (num >= 0 && num <= images.size)
          {
            var file = images.images[num]
            var format = file.format
            if (format == "JPEG") {
              format = "jpg"
            }
            newEmbed
            .setDescription(`Showing meme ${num} with score: ${file.score}`)
            .attachFile(`../images/memes/${file.name}.${format.toLowerCase()}`)
            .setImage(`attachment://${file.name}.${format.toLowerCase()}`)
            .setTimestamp(new Date())
            message.channel.send(newEmbed)
          }
          else
          {
            message.reply("Please send a valid number")
          }
        }
      }
    },
};