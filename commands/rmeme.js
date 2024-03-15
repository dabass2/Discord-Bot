const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const axios = require("axios");
const botconfig = require("../botconfig.json");

const acceptedUsers = [
  "122090401011073029",
  "109685953911590912",
  "148296305536532480",
  "468421106219614208",
  "110412597399932928",
];
const api_url = "https://api.rmeme.me";

function create_buttons(repeat_dsbl = false) {
  return new MessageActionRow().addComponents(
    new MessageButton().setCustomId("up").setStyle("SUCCESS").setEmoji("✔️"),
    new MessageButton().setCustomId("down").setStyle("DANGER").setEmoji("✖️")
    // Break glass in case of will power
    // new MessageButton()
    //   .setCustomId("repeat")
    //   .setDisabled(repeat_dsbl)
    //   .setStyle("SECONDARY")
    //   .setEmoji("🔁")
  );
}

function update_score(post_id, score) {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${api_url}/${post_id}`,
        { votes: score },
        { headers: { "x-api-key": botconfig.apiToken } }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function create_message(
  interaction,
  post_id = "",
  repeat_dsbl = false,
  not_visible = false
) {
  return new Promise(async (resolve, reject) => {
    if (post_id < 0) {
      let max = await axios.get(api_url + "/rmeme/total", {
        headers: { "x-api-key": botconfig.apiToken },
      });
      post_id =
        Math.abs(post_id) <= max.data.total
          ? max.data.total - Math.abs(post_id)
          : max.data.total - 1;
    }

    let url = `${api_url}/${post_id ? `meme/${post_id}` : "rmeme"}`;

    axios
      .get(url, { headers: { "x-api-key": botconfig.apiToken } })
      .then(async (res) => {
        let post = res.data;

        const videos = ["mp4", "mov", "webm"];
        if (videos.includes(post.format)) {
          let msg = `Meme #${post.meme_id} with score: ${post.score}\n${post.url}`;
          try {
            await interaction.reply({
              content: msg,
              components: [create_buttons()],
              ephemeral: not_visible,
            });
          } catch (e) {
            interaction.followUp({
              content: msg,
              components: [create_buttons()],
              ephemeral: not_visible,
            });
          }
        } else {
          let msgEmbed = new MessageEmbed()
            .setDescription(`Meme #${post.meme_id} with score: ${post.score}`)
            .setImage(post.url)
            .setTimestamp(new Date());
          try {
            await interaction.reply({
              embeds: [msgEmbed],
              components: [create_buttons()],
              ephemeral: not_visible,
            });
          } catch (e) {
            interaction.followUp({
              embeds: [msgEmbed],
              components: [create_buttons()],
              ephemeral: not_visible,
            });
          }
        }

        let validIds = ["up", "down", "repeat"];
        const filter = (i) => validIds.includes(i.customId);

        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          time: 5000,
        });

        let score = 0;
        let repeat = false;
        let upvoters = [];
        let downvoters = [];
        collector.on("collect", async (i) => {
          let button_action = i.customId;
          let voter = i.user.id;
          if (button_action === "up" && !upvoters.includes(voter)) {
            if (downvoters.includes(voter)) {
              let idx = downvoters.indexOf(voter);
              downvoters.splice(idx, 1);
            } else {
              upvoters.push(voter);
            }

            score += 1;
          } else if (button_action === "down" && !downvoters.includes(voter)) {
            if (upvoters.includes(voter)) {
              let idx = upvoters.indexOf(voter);
              upvoters.splice(idx, 1);
            } else {
              downvoters.push(voter);
            }

            score -= 1;
          }

          if (button_action === "repeat") {
            execute2(interaction);
          }

          // Do this so button will exit loading state
          await i.update({
            components: [create_buttons(repeat_dsbl)],
          });
        });

        collector.on("end", () => {
          if (score === 0) {
            resolve(repeat);
          }

          update_score(post.meme_id, Math.abs(score))
            .then(async () => {
              let updatedEmbed = new MessageEmbed()
                .setDescription(
                  `Meme #${post.meme_id} with score: ${post.score + score}`
                )
                .setImage(post.url)
                .setTimestamp(new Date());
              await interaction.editReply({
                embeds: [updatedEmbed],
                ephemeral: not_visible,
              });
              resolve(repeat);
            })
            .catch((err) => {
              reject(err);
            });
        });
      })
      .catch(async (err) => {
        console.error(err);
        await interaction.reply({
          content: "Invalid meme ID. Please try again.",
          ephemeral: not_visible,
        });
        reject(err.data);
      });
  });
}

async function upload_post(interaction, upload_url) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${api_url}/meme`,
        {
          url: upload_url,
        },
        {
          headers: {
            "x-api-key": botconfig.apiToken,
          },
        }
      )
      .then(async (res) => {
        let post = res.data;

        const videos = ["mp4", "mov", "webm"];
        if (videos.includes(post.format)) {
          let msg = `Uploaded new meme #${post.meme_id} with score: ${post.score}\n${post.url}`;
          await interaction.reply({
            content: msg,
            components: [create_buttons()],
            ephemeral: true,
          });
        } else {
          let msgEmbed = new MessageEmbed()
            .setDescription(
              `Uploaded new meme #${post.meme_id} with score: ${post.score}`
            )
            .setImage(post.url)
            .setTimestamp(new Date());
          await interaction.reply({
            embeds: [msgEmbed],
            components: [create_buttons()],
            ephemeral: true,
          });
        }
        resolve();
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
}

async function update_post(interaction, post_id, command) {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${api_url}/meme/${post_id}`,
        {
          votes: command === "up" ? 1 : -1,
        },
        { headers: { "x-api-key": botconfig.apiToken } }
      )
      .then(async (res) => {
        await interaction.reply({
          content: `Updated score for meme ${post_id}. New score: ${res.data.score}.`,
          ephemeral: true,
        });
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function delete_post(interaction, post_id) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${api_url}/meme/${post_id}`, {
        headers: { "x-api-key": botconfig.apiToken },
      })
      .then(async (res) => {
        await interaction.reply({
          content: `Deleted meme ${post_id}.`,
        });
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function execute2(interaction) {
  const post_id = interaction.options.getNumber("id");
  const upload_url = interaction.options.getString("url");
  let image_rpt = false;

  const sub_command = interaction.options.getSubcommand();

  try {
    if (sub_command === "upload" && upload_url) {
      if (!acceptedUsers.includes(interaction.user.id)) {
        await interaction.reply({
          content: "You cannot use this command.",
          ephemeral: true,
        });
      }

      await upload_post(interaction, upload_url);
    } else if (sub_command === "get") {
      if (post_id === null) {
        // Nothing given, send random meme
        image_rpt = await create_message(interaction);
      } else if (post_id !== null) {
        // Just post ID, try to send whatever was requested
        image_rpt = await create_message(interaction, post_id, true, false);
      }
    } else if (sub_command === "up" || sub_command === "down") {
      await update_post(interaction, post_id, sub_command);
    } else if (
      sub_command === "delete" &&
      acceptedUsers.includes(interaction.user.id)
    ) {
      await delete_post(interaction, post_id);
    } else {
      await interaction.reply({
        content: "You cannot use this command.",
        ephemeral: true,
      });
    }

    if (image_rpt) {
      this.execute(interaction);
    }
  } catch (err) {
    return new Error(err);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rmeme")
    .setDescription("Send, vote, upload, or delete memes!")
    .addSubcommand((getSubCmd) =>
      getSubCmd
        .setName("get")
        .setDescription("Select a specific meme to view and/or vote on.")
        .addNumberOption((num_opt) =>
          num_opt
            .setName("id")
            .setDescription("Select a specific meme to view and/or vote on.")
        )
    )
    .addSubcommand((upVtSubCmd) =>
      upVtSubCmd
        .setName("up")
        .setDescription("Upvote a meme")
        .addNumberOption((num_opt) =>
          num_opt.setName("id").setDescription("ID of the meme")
        )
    )
    .addSubcommand((upVtSubCmd) =>
      upVtSubCmd
        .setName("down")
        .setDescription("Downvote a meme")
        .addNumberOption((num_opt) =>
          num_opt.setName("id").setDescription("ID of the meme")
        )
    )
    .addSubcommand((upVtSubCmd) =>
      upVtSubCmd
        .setName("delete")
        .setDescription("Delete a meme")
        .addNumberOption((num_opt) =>
          num_opt.setName("id").setDescription("ID of the meme")
        )
    )
    .addSubcommand((upldSubCmd) =>
      upldSubCmd
        .setName("upload")
        .setDescription("Upload a new meme.")
        .addStringOption((url_opt) =>
          url_opt
            .setName("url")
            .setDescription("The url of the post to be uploaded")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    execute2(interaction);
  },
};
