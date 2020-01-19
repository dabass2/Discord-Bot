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

  if (message.author.bot) return;  //Ignores other bot messages

  /* Bot related commands */

  if (message.channel.type === "dm") //Bot sends certain image when Private Messaged
  {
    if (message.author.bot) return;
    message.reply("Type !help for a list of commands. Or you can dm me :flushed:")
    message.channel.send({files: ['./eggplantmedaddy.gif'] });
  }

  if (message.isMentioned(client.user.id))  //Bot replies when mentioned. Can be expanded on later.
  {
    message.reply("Type !help for a list of commands. Or you can dm me :flushed:")
  }

  if (!message.content.startsWith(botconfig.prefix)) return; //Ignores messages without prefix at [0]

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
