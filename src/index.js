const fs = require('fs');
const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

const botIntents = new Discord.Intents()
botIntents.add(Discord.Intents.FLAGS.GUILD_MESSAGES)
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
  client.user.setActivity("League of Maidens");
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

  /* Bot replies when mentioned. */

  if (message.isMentioned(client.user.id))
  {
    let newEmbed = new Discord.RichEmbed()
    .setImage("https://media.discordapp.net/attachments/193423263387353088/902063280615485480/Wokege.gif")
    message.reply(newEmbed)
  }

  /* Ignores all messages not starting with the prefix. Must be below previous lines */

  if (!message.content.startsWith(botconfig.prefix)) return;

  /* Help command which returns an embed of all bot commands */

  if (cmd === 'help')
  {
    client.commands.get(cmd)
    let usrPic = client.user.displayAvatarURL
    let newEmbed = new Discord.RichEmbed()
    .setColor(0x4286f4)
    .setThumbnail(usrPic)
    .setDescription('tfw: List of Commands')
    .setTimestamp(new Date())
    .addField(`${botconfig.prefix}help', 'This command. Prints list of commands.`)
    client.commands.forEach(cmd => {
      newEmbed.addField(`${botconfig.prefix}${cmd.name}`, cmd.description)
    })
    message.author.send(newEmbed)
  }

  /* Commands with separate files for their code */

  if (cmdArr.includes(cmd))
  {
    var newEmbed = new Discord.RichEmbed()
    client.commands.get(cmd).execute(message, args, newEmbed)
  }
});

client.login(botconfig.token);
