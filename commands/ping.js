const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong!'),
  async execute(interaction) {
    interaction.channel.messages.fetch(undefined, {force: true})
      .then(messages => {
        let msgs = messages.filter(m => m.author.id === '122090401011073029')
        console.log(msgs)
        // for (const [key, value] of Object.entries(messages.filter(m => m.author.id === '500122158039826433'))) {
        //   console.log(key, value)
        // }
      })
      .catch(console.error);
    await interaction.reply('Pong!');
  }
};