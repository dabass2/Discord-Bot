module.exports = {
  name: 'rmeme',
  description: 'Send, vote, upload, or delete memes!',
  execute(message, args, newEmbed) {
      const axios = require('axios')
      const botconfig = require("../botconfig.json");
      const acceptedUsers = ['122090401011073029']
      const url = 'https://api.rmeme.me/rmeme'

      if (args.length === 0)
      {
        axios.get(`${url}`).then((res) => {
          console.log(res.data)
          img = res.data
          newEmbed
          .setDescription(`Random meme #${img.id} with score: ${img.score}`)
          .setImage(img.url)
          .setTimestamp(new Date())
          message.channel.send(newEmbed).then(async sent => {  // async and await so emojis are always sent in order
            await sent.react('✅')  // god you're so cool Daniel
            await sent.react('❌')  // thanks Daniel that means a lot
            await sent.react('🔁')  // no problem Daniel, not enough people have seen this asyc/await
            const filter = (reaction) => {  // look for ✅ , ❌ , or 🔁
                return reaction.emoji.name === '✅' || reaction.emoji.name === '❌' || reaction.emoji.name === '🔁';
            };
            sent.awaitReactions(filter, {time: 5000}).then(collect =>
                Promise.all(collect.first().message.reactions.map(itr => {
                  return itr.emoji.reaction.count
                })).then(reacts => {
                  let newScore = reacts[0] - reacts[1]
                  if (newScore)
                  {
                    axios.put(`${url}/${img.id}/up`, {votes: newScore, token: botconfig.apiToken}).then((res) => {
                        console.log(`Updated meme: ${res.data.id}'s score. New score ${res.data.score}`)
                    }).catch((err) => {
                        console.log(err)
                    })
                  }
                  if (reacts[2] > 1)
                  {
                    module.exports.execute(message, args, newEmbed)
                  }
                }).catch(err => console.log(err))
            ).catch(err => {console.log(err)})
          });
        }).catch((err) => {
            console.log(err)
        })
      } 

      else if (args.length >= 1) {
          if ((args[0] === 'up' || args[0] === 'down') && args[1])
          {
            try {
              var max
              id = Number(args[1])
              axios.get(`${url}/memes/total`).then((res) => {
                max = res.data.total
                if (id >= 0 && id < max)
                { 
                  axios.put(`${url}/${id}/${args[0]}`, {votes: 1, token: botconfig.apiToken}).then((res) => {
                    var img = res.data
                    newEmbed
                    .setDescription(`Voted for meme ${img.id}, new score: ${img.score}`)
                    .setImage(img.url)
                    .setTimestamp(new Date())
                    return message.channel.send(newEmbed)
                  }).catch((err) => {
                    console.log(err)
                  })
                }
              }).catch((err) => {
                console.log(err)
              })
            } catch(err) {
              console.log(err)
              message.channel.reply("Please send a valid number.")
            }
          }
          else if (args[0] === 'upload')
          {
            if (!acceptedUsers.includes(message.author.id))
            {
              message.channel.send("You do not have access to this command.")
            }
            else
            {
              axios.post(`${url}/create`, {url: args[1], token: botconfig.apiToken}).then((res) => {
                var img = res.data
                console.log(res)
                newEmbed
                .setDescription(`Created meme ${img.id}, with score: ${img.score}`)
                .setImage(img.url)
                .setTimestamp(new Date())
                return message.channel.send(newEmbed)
              }).catch((err) => {
                message.channel.send('Error uploading image.')
              })
            }
          }
          else if (args[0] === 'delete')
          {
            if (!acceptedUsers.includes(message.author.id))
            {
              message.channel.send("You do not have access to this command.")
            }
            else
            {
              try {
                var max
                id = Number(args[1])
                axios.get(`${url}/memes/total`).then((res) => {
                  max = res.data.total
                  if (id >= 0 && id < max)
                  { 
                    axios.delete(`${url}/del/${args[1]}`, {data: {token:botconfig.apiToken}}).then((res) => {
                      message.channel.send(res.data)
                    }).catch((err) => {
                      console.log(err)
                    })
                  }
                }).catch((err) => {
                  console.log(err)
                })
              } catch(err) {
                console.log(err)
                message.channel.reply("Please send a valid number.")
              }
            }
          }
          else if (typeof Number(args[0]) === 'number')
          {
            var id = Number(args[0])
            axios.get(`${url}/memes/total`).then((res) => {
              max = res.data.total
              if (id >= 0 && id < max)
              { 
                axios.get(`${url}/${id}`).then((res) => {
                  var img = res.data
                  newEmbed
                  .setDescription(`Showing meme ${img.id}, with score: ${img.score}`)
                  .setImage(img.url)
                  .setTimestamp(new Date())
                  return message.channel.send(newEmbed)
                }).catch((err) => {
                  console.log(err)
                })
              }
              else
              {
                message.reply("Please send a valid number")
              }
            }).catch((err) => {
              console.log(err)
            })
          }
      }  
}}
