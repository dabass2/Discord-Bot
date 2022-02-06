const { SlashCommandBuilder } = require('@discordjs/builders');
const { Collection } = require('discord.js');

async function fetchMore(channel, limit = 250) {
  if (!channel) {
    throw new Error(`Expected channel, got ${typeof channel}.`);
  }
  if (limit <= 100) {
    return channel.messages.fetch({ limit });
  }

  let collection = new Collection();
  let lastId = null;
  let options = {};
  let remaining = limit;

  while (remaining > 0) {
    options.limit = remaining > 100 ? 100 : remaining;
    remaining = remaining > 100 ? remaining - 100 : 0;

    if (lastId) {
      options.before = lastId;
    }

    let messages = await channel.messages.fetch(options);

    if (!messages.last()) {
      break;
    }

    collection = collection.concat(messages);
    lastId = messages.last().id;
  }

  return collection;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quote')
		.setDescription('Who said this?'),
	async execute(interaction) {
    interaction.channel.messages.fetch({limit:100})
      .then(msgs => {
        console.log(msgs.filter(msg => msg.author.id === "122090401011073029"))
      })
    // console.log(messages.length)
    // const list = await fetchMore(interaction.channel, 500);

    // console.log(
    //   list.size,
    //   list.filter((msg) => msg.content.includes('something')),
    // );
    // console.log(channel.fetch(interaction.channelId).messages.cache.filter(m => m.author.id === '122090401011073029'))
		await interaction.reply('Pong!');
	}
};