const { SlashCommandBuilder } = require('@discordjs/builders');
const { get_info, pull_new_card } = require('../lib/db')

function pull_card() {
    pull_new_card()
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tcg')
		.setDescription('The TIC Trading Card Game (TCG)')
        .addSubcommand(libSubCmd =>
            libSubCmd.setName('library')
                .setDescription('View the all cards that you have in your library')
        )
        .addSubcommand(pullSubCmd =>
            pullSubCmd.setName('pull')
                .setDescription('Open a pack of cards')
        ),
	async execute(interaction, msgEmbed) {
        switch (interaction.options.getSubcommand()) {
            case 'library':
                console.log("show cards")
                break;
            case 'pull':
                pull_card()
                break;
            default:
                break;
        }
        const info = await get_info()
        console.log(info)
        msgEmbed
            .setColor("#4538f5")
            .setTitle("TIC the Trading Card Game")
            .setDescription('You pulled an ultra rare `Daniel Lopez`!')
            .setImage("https://leinad.dev/images/tcg/daniel_lopez.jpg")
		await interaction.reply({ embeds: [msgEmbed] });
	}
};
