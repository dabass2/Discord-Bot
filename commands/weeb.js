const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weeb')
        .setDescription('Scientific method to determine how weeb you are.'),
    async execute(interaction) {
        let inductive_hypothesis = interaction.user.id % 100
        let base_case = interaction.channelId % 100
        let recursive_step = Math.floor(Math.random() * 10) % 100
        let scientificly_proved_answer = ((inductive_hypothesis + base_case) * recursive_step) % 100

        await interaction.reply({ content: "You are: " + scientificly_proved_answer.toString() + "% weeb."})
    },
  };
  
  