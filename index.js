const fs = require('fs');
const Discord = require("discord.js");
const botconfig = require("./botconfig.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

var cmdArr = []
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    cmdArr.push(command.name)
    client.commands.set(command.name, command);
}

client.on("ready", () => {
  console.log(`${client.user.username} is online`);
  client.user.setActivity("Hunie Pop");
});

client.on("message", message => {
  /* Message Handling */
  let prefix = botconfig.prefix;
  const args = message.content.slice(prefix.length).split(' ');
  const cmd = args.shift().toLowerCase();

  /* Ignores other bots messages */

  if (message.author.bot) return;

  /* Bot replies when Direct Messaged */

  if (message.channel.type === "dm")
  {
    if (message.author.bot) return;
    message.reply("Type !help for a list of commands. Or you can dm me :flushed:")
    message.channel.send({files: ['./eggplantmedaddy.gif'] });
  }

  /* Bot replies when mentioned. */

  if (message.isMentioned(client.user.id))
  {
    message.reply("Type !help for a list of commands. Or you can dm me :flushed:")
  }

  /* Ignores all messages not starting with the prefix. Must be below previous lines */

  if (!message.content.startsWith(botconfig.prefix)) return;

  /* Help command which returns an embed of all bot commands */

  if (cmd === 'help')
  {
    client.commands.get(cmd)
    let usrPic = client.user.displayAvatarURL
    var newEmbed = new Discord.RichEmbed()
    .setColor(0x4286f4)
    .setThumbnail(usrPic)
    .setDescription('tfw: List of Commands')
    .setTimestamp(new Date())
    .addField('!help', 'This command! Prints list of commands.')
    client.commands.forEach(cmd => {
      newEmbed.addField(`!${cmd.name}`, cmd.description)
    })
    message.channel.send(newEmbed)
  }

  /* Commands with separate files for their code */

  if (cmdArr.includes(cmd))
  {
    var newEmbed = new Discord.RichEmbed()
    client.commands.get(cmd).execute(message, args, newEmbed)
  }
});

client.login(botconfig.token);
