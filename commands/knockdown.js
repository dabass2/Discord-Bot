const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('knockdown')
		.setDescription('I get knocked down...'),
	async execute(interaction) {
		await interaction.reply('https://cdn.discordapp.com/attachments/167058940029304832/1020024879648624731/igetknockeddown.mp4');
	}
};