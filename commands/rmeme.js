const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const axios = require('axios')
const botconfig = require("../botconfig.json");

const acceptedUsers = ['122090401011073029', '109685953911590912', '148296305536532480', '468421106219614208']
const api_url = 'https://api.rmeme.me/rmeme'

function create_buttons(repeat_dsbl=false) {
    return new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('up')
                .setStyle('SUCCESS')
                .setEmoji('✔️'),
            new MessageButton()
                .setCustomId('down')
                .setStyle('DANGER')
                .setEmoji('✖️'),
            // Break glass in case of will power
            // new MessageButton()
            //     .setCustomId('repeat')
            //     .setDisabled(repeat_dsbl)
            //     .setStyle('SECONDARY')
            //     .setEmoji('🔁')
        );
}

function update_score(post_id, post_action, score) {
    return new Promise((resolve, reject) => {
        axios.put(`${api_url}/${post_id}/${post_action}`, {votes: score, token: botconfig.apiToken})
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

async function create_message(interaction, post_id='', post_action='', repeat_dsbl=false, not_visible=false) {
    return new Promise(async (resolve, reject) => {
        if (post_id == -1) {
            let max = await axios.get(api_url + "/memes/total")
            post_id = max.data.total - 1
        }

        let post_url = api_url
        if (post_id) {
            post_url += `/${post_id}`
        }
        
        if (post_action) {
            post_url += `/${post_action}`
        }

        axios.get(post_url)
            .then(async res => {
                let post = res.data

                const videos = ['mp4', 'mov', 'webm']
                if (videos.includes(post.format)) {
                    let msg = `Meme #${post.id} with score: ${post.score}\n${post.url}`
                    await interaction.reply({ content: msg, components: [create_buttons()], ephemeral: not_visible })
                } else {
                    let msgEmbed = new MessageEmbed()
                        .setDescription(`Meme #${post.id} with score: ${post.score}`)
                        .setImage(post.url)
                        .setTimestamp(new Date())
                    await interaction.reply({ embeds: [msgEmbed], components: [create_buttons()], ephemeral: not_visible })
                }

                let validIds = ['up', 'down', 'repeat']
                const filter = i => validIds.includes(i.customId);

                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

                let score = 0
                let repeat = false
                let upvoters = []
                let downvoters = []
                collector.on('collect', async i => {
                    let button_action = i.customId
                    let voter = i.user.id
                    if (button_action === "up" && !upvoters.includes(voter)) {
                        if (downvoters.includes(voter)) {
                            let idx = downvoters.indexOf(voter)
                            downvoters.splice(idx, 1)
                        } else {
                            upvoters.push(voter)
                        }

                        score += 1
                    } else if (button_action === "down" && !downvoters.includes(voter)) {
                        if (upvoters.includes(voter)) {
                            let idx = upvoters.indexOf(voter)
                            upvoters.splice(idx, 1)
                        } else {
                            downvoters.push(voter)
                        }

                        score -= 1
                    }

                    if (button_action === "repeat") {
                        repeat = repeat ? false : true
                    }

                    // Do this so button will exit loading state
                    await i.update({ components: [create_buttons(repeat_dsbl)] })
                });

                collector.on('end', () => {
                    if (score === 0) {
                        resolve(repeat)
                    }

                    /*
                        The rmeme API is poorly designed and requires both scores to
                        be sent to different endpoints. First, get the action if one not
                        given, and then send |score| because negatives are NOT supported
                    */
                    let action
                    if (post_action) {
                        action = post_action
                    } else {
                        action = (score > 0) ? "up" : "down"
                    }

                    update_score(post.id, action, Math.abs(score))
                        .then(async () => {
                            let updatedEmbed = new MessageEmbed()
                                .setDescription(`Meme #${post.id} with score: ${post.score + score}`)
                                .setImage(post.url)
                                .setTimestamp(new Date())
                            await interaction.editReply({ embeds: [updatedEmbed], ephemeral: not_visible })
                            resolve(repeat)
                        })
                        .catch(err => {
                            reject(err)
                        })
                });
            })
            .catch(async err => {
                await interaction.reply({ content: "Invalid meme ID. Please try again.", ephemeral: not_visible })
                reject(err.data)
            })
    })
}

async function upload_post(interaction, upload_url) {
    return new Promise((resolve, reject) => {
        axios.post(`${api_url}/create`, {url: upload_url, token: botconfig.apiToken})
            .then(async (res) => {
                let post = res.data

                const videos = ['mp4', 'mov', 'webm']
                if (videos.includes(post.format)) {
                    let msg = `Uploaded new meme #${post.id} with score: ${post.score}\n${post.url}`
                    await interaction.reply({ content: msg, components: [create_buttons()], ephemeral: true })
                } else {
                    let msgEmbed = new MessageEmbed()
                        .setDescription(`Uploaded new meme #${post.id} with score: ${post.score}`)
                        .setImage(post.url)
                        .setTimestamp(new Date())
                    await interaction.reply({ embeds: [msgEmbed], components: [create_buttons()], ephemeral: true })
                }
                resolve()
            }).catch((err) => {
                reject(err)
            })
    })
}

async function update_post(interaction, post_id, post_action) {
    return new Promise((resolve, reject) => {
        axios.put(`${api_url}/${post_id}/${post_action}`, {votes: 1, token: botconfig.apiToken})
            .then(async (res) => {
                await interaction.reply({ content: `Updated score for meme ${post_id}. New score: ${res.data.score}.`, ephemeral: true })
                resolve()
            })
            .catch((err) => {
                reject(err)
            })
    })
}

async function delete_post(interaction, post_id) {
    return new Promise((resolve, reject) => {
        axios.delete(`${api_url}/del/${post_id}`, {data: {token:botconfig.apiToken}})
            .then(async (res) => {
                await interaction.reply({ content: `Deleted meme ${post_id}.` })
                resolve()
            })
            .catch((err) => {
                reject(err)
            })
    })
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rmeme')
        .setDescription('Send, vote, upload, or delete memes!')
        .addSubcommand(getSubCmd =>
            getSubCmd.setName('get')
                .setDescription('Select a specific meme to view and/or vote on.')
                .addNumberOption(num_opt =>
                    num_opt.setName('id')
                        .setDescription("Select a specific meme to view and/or vote on.")
                )
                .addStringOption(vote_opt =>
                    vote_opt.setName('action')
                        .setDescription('Upvote, Downvote, or Delete a post')
                        .addChoice('up', 'up')
                        .addChoice('down', 'down')
                        .addChoice('delete', 'delete')
                )
        )
        .addSubcommand(upldSubCmd =>
            upldSubCmd.setName('upload')
                .setDescription('Upload a new meme.')
                .addStringOption(url_opt =>
                    url_opt.setName('url')
                        .setDescription('The url of the post to be uploaded')
                        .setRequired(true)
                )
        ),
    async execute(interaction) {  
        const post_id = interaction.options.getNumber('id')
        const post_action = interaction.options.getString('action')
        const upload_url = interaction.options.getString('url')

        try {
            if (interaction.options.getSubcommand() === 'upload' && upload_url) {
                if (acceptedUsers.includes(interaction.user.id)) {
                    await upload_post(interaction, upload_url)
                } else {
                    await interaction.reply({ content: "You cannot use this command.", ephemeral: true })
                }
            } else if (interaction.options.getSubcommand() === 'get') {
                if (!post_id && !post_action) {         // Nothing given, send random meme
                    await create_message(interaction)
                } else if (post_id && !post_action) {   // Just post ID, try to send whatever was requested
                    await create_message(interaction, post_id, null, true)
                } else if (post_id && post_action) {    // Could be voting up/down or deleting a post
                    if (post_action === "delete" && acceptedUsers.includes(interaction.user.id)) {
                        await delete_post(interaction, post_id)
                    } else if (post_action === "up" || post_action === "down") {
                        await update_post(interaction, post_id, post_action, true)
                    } else {
                        await interaction.reply({ content: "You cannot use this command.", ephemeral: true })
                    }
                }
            }
        } catch(err) {
            return new Error(err)
        }
    }
}
