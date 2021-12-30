const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('hangman')
    .setDescription('Play a game of hangman')
    .addSubcommand(startCmd =>
        startCmd.setName('start')
            .setDescription('Start a new game.')
    )
    .addSubcommand(guessCmd =>
        guessCmd.setName('guess')
            .setDescription('Guess a letter or the word.')
            .addStringOption(guess_opt => 
                guess_opt.setName("letters")
                    .setDescription("Type a single letter to guess a letter or more than one to guess the final word.")
                    .setRequired(true)
            )
    )
    .addSubcommand(joinCmd =>
        joinCmd.setName('join')
            .setDescription('Join an existing game.')
    ),
	async execute(interaction) {
    // let fs = require('fs');
    // let obj = JSON.parse(fs.readFileSync('../words_by_length.json', 'utf8'));
    // console.log(obj[6].length)
    const word = "poggers"
    const last_cmd = interaction.options.getSubcommand()
    if (last_cmd === "start") {
      console.log("start game hehe")
    } else if (last_cmd === "join") {
      console.log("join :OOOO")
    } else if (last_cmd === "guess") {
      handleGuess(interaction.options.getString("letters"))
    } else {
      console.error("oh god")
      interaction.reply("Not good.")
    }

		await interaction.reply({content: last_cmd});
	}
};

function handleGuess(guess) {
  if (guess.length === 1) {
    console.log("letter guess")
  } else {
    console.log("word guess")
  }
}