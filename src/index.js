const fs = require('fs');
const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

const botIntents = new Discord.Intents()
botIntents.add(
  Discord.Intents.FLAGS.GUILD_MESSAGES,
  Discord.Intents.FLAGS.GUILDS
)

const client = new Discord.Client({ intents: botIntents });
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('../commands').filter(file => file.endsWith('.js'));

var cmdArr = []
for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    cmdArr.push(command.data.name)
    client.commands.set(command.data.name, command);
}

client.on("ready", () => {
  console.log(`${client.user.username} is online`);
  client.user.setActivity("Genshin Impact 2");
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
    const cmdEmbed = new Discord.MessageEmbed()
		await command.execute(interaction, cmdEmbed);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on("messageCreate", message => {
  /* Message Handling */
  let prefix = botconfig.prefix;
  const args = message.content.slice(prefix.length).split(' ');
  const cmd = args.shift().toLowerCase();

  /* Ignores other bots messages */
  if (message.author.bot) return;

  if (cmdArr.includes(cmd)) {
    message.reply("tfw now supports slash (/) commands, try them out!")
  }
});

client.login(botconfig.token);