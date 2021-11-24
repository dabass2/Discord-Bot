const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios')
const botconfig = require("../botconfig.json");

function post_buttons(post_id) {
    return new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(`up:${post_id}`)
                .setStyle('SUCCESS')
                .setEmoji('✔️'),
            new MessageButton()
                .setCustomId(`down:${post_id}`)
                .setStyle('DANGER')
                .setEmoji('✖️'),
            new MessageButton()
                .setCustomId(`repeat:${post_id}`)
                .setStyle('SECONDARY')
                .setEmoji('🔁')
        );
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rmeme')
        .setDescription('Send, vote, upload, or delete memes!')
        .addNumberOption(str_option =>
            str_option.setName('post_id')
                .setDescription('Select a specific meme to view and/or vote on.')
        )
        .addStringOption(vote_option =>
            vote_option.setName('vote_action')
                .setDescription('Upvote, Downvote, or Delete a post')
                .addChoice('Up', 'vote_up')
                .addChoice('Down', 'vote_down')
                .addChoice('Delete', 'post_delete')
        ),
    async execute(interaction, msgEmbed, client) {
        const acceptedUsers = ['122090401011073029', '109685953911590912']
        const url = 'https://api.rmeme.me/rmeme'
  
        const post_id = interaction.options.getNumber('post_id')
        const post_action = interaction.options.getString('vote_action')

        /* No post ID given, so send a random meme. */
        if (!post_id && !post_action) {
            axios.get(url)
                .then(async res => {
                    let post = res.data

                    const videos = ['mp4', 'mov', 'webm']
                    if (videos.includes(post.format)) {
                        console.log('video')
                    } else {
                        msgEmbed
                            .setDescription(`Meme #${post.id} with score: ${post.score}`)
                            .setImage(post.url)
                            .setTimestamp(new Date())
                        await interaction.reply({ embeds: [msgEmbed], components: [post_buttons(post.id)] })

                        client.on('interactionCreate', interaction => {
                            if (!interaction.isButton()) return
                            // console.log(interaction.customId.split(":"))
                            let button_action = interaction.customId.split(":")[0]
                            let post_id = interaction.customId.split(":")[1]

                            /*
                            if button_action === repeat
                                run again
                            else
                                let score
                                if button_action === up : score + 1
                                if button_action === down : score - 1
                                axios.post(url+post_id, score)
                            */
                        })
                    }
                })
                .catch(async err => {
                    console.error(err)
                    return new Error("Failed to fetch meme.")
                })
        }
    }
}
        // if (!post_id && !post_action) {
        //   axios.get(`${url}`).then((res) => {
        //     img = res.data
        //     let sentMessage
        //     if (img.format === 'mp4' || img.format === 'mov' || img.format === 'webm') {
        //         console.log(img.url)
        //         sentMessage = message.channel.send(img.url)
        //     } else {
        //         newEmbed
                // .setDescription(`Random meme #${img.id} with score: ${img.score}`)
                // .setImage(img.url)
                // .setTimestamp(new Date())
        //         sentMessage = message.channel.send(newEmbed)
        //     }
        //     sentMessage.then(async sent => {
        //       await sent.react('✅')
        //       await sent.react('❌')
        //       await sent.react('🔁')
        //       const filter = (reaction) => {
        //           return reaction.emoji.name === '✅' || reaction.emoji.name === '❌' || reaction.emoji.name === '🔁';
        //       };
        //       sent.awaitReactions(filter, {time: 5000}).then(collect =>
        //           Promise.all(collect.first().message.reactions.map(itr => {
        //             return itr.emoji.reaction.count
        //           })).then(reacts => {
        //             let newScore = reacts[0] - reacts[1]
        //             if (newScore)
        //             {
        //               axios.put(`${url}/${img.id}/up`, {votes: newScore, token: botconfig.apiToken}).then((res) => {
        //                   console.log(`Updated meme: ${res.data.id}'s score. New score ${res.data.score}`)
        //               }).catch((err) => {
        //                   console.log(err)
        //               })
        //             }
        //             if (reacts[2] > 1)
        //             {
        //               module.exports.execute(message, args, newEmbed)
        //             }
        //           }).catch(err => console.log(err))
        //       ).catch(err => {console.log(err)})
        //     });
        //   }).catch((err) => {
        //       console.log(err)
        //   })
        // } 
  
        // else if (args.length >= 1) {
        //     if ((args[0] === 'up' || args[0] === 'down') && args[1])
        //     {
        //       try {
        //         var max
        //         id = Number(args[1])
        //         axios.get(`${url}/memes/total`).then((res) => {
        //           max = res.data.total
        //           if (id >= 0 && id < max)
        //           { 
        //             axios.put(`${url}/${id}/${args[0]}`, {votes: 1, token: botconfig.apiToken}).then((res) => {
        //               var img = res.data
        //               newEmbed
        //               .setDescription(`Voted for meme ${img.id}, new score: ${img.score}`)
        //               .setImage(img.url)
        //               .setTimestamp(new Date())
        //               return message.channel.send(newEmbed)
        //             }).catch((err) => {
        //               console.log(err)
        //             })
        //           }
        //         }).catch((err) => {
        //           console.log(err)
        //         })
        //       } catch(err) {
        //         console.log(err)
        //         message.channel.reply("Please send a valid number.")
        //       }
        //     }
        //     else if (args[0] === 'upload')
        //     {
        //       if (!acceptedUsers.includes(message.author.id))
        //       {
        //         message.channel.send("You do not have access to this command.")
        //       }
        //       else
        //       {
        //         axios.post(`${url}/create`, {url: args[1], token: botconfig.apiToken}).then((res) => {
        //           var img = res.data
        //           console.log(res)
        //           newEmbed
        //           .setDescription(`Created meme ${img.id}, with score: ${img.score}`)
        //           .setImage(img.url)
        //           .setTimestamp(new Date())
        //           return message.channel.send(newEmbed)
        //         }).catch((err) => {
        //           message.channel.send('Error uploading image.')
        //         })
        //       }
        //     }
        //     else if (args[0] === 'delete')
        //     {
        //       if (!acceptedUsers.includes(message.author.id))
        //       {
        //         message.channel.send("You do not have access to this command.")
        //       }
        //       else
        //       {
        //         try {
        //           var max
        //           id = Number(args[1])
        //           axios.get(`${url}/memes/total`).then((res) => {
        //             max = res.data.total
        //             if (id >= 0 && id < max)
        //             { 
        //               axios.delete(`${url}/del/${args[1]}`, {data: {token:botconfig.apiToken}}).then((res) => {
        //                 message.channel.send(res.data)
        //               }).catch((err) => {
        //                 console.log(err)
        //               })
        //             }
        //           }).catch((err) => {
        //             console.log(err)
        //           })
        //         } catch(err) {
        //           console.log(err)
        //           message.channel.reply("Please send a valid number.")
        //         }
        //       }
        //     }
        //     else if (typeof Number(args[0]) === 'number')
        //     {
        //       var id = Number(args[0])
        //       axios.get(`${url}/memes/total`).then((res) => {
        //         max = res.data.total
        //         if (id >= 0 && id < max)
        //         { 
        //           axios.get(`${url}/${id}`).then((res) => {
        //             var img = res.data
        //             console.log(img)
        //             if (img.format === 'mp4') {
        //               return message.channel.send(img.url)
        //             }
        //             newEmbed
        //             .setDescription(`Showing meme ${img.id}, with score: ${img.score}`)
        //             .setImage(img.url)
        //             .setTimestamp(new Date())
        //             return message.channel.send(newEmbed)
        //           }).catch((err) => {
        //             console.log(err)
        //           })
        //         }
        //         else
        //         {
        //           message.reply("Please send a valid number")
        //         }
        //       }).catch((err) => {
        //         console.log(err)
        //       })
        //     }
        // }  
//     }
// }
  