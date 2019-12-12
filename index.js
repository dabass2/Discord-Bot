const fs = require('fs');
const Discord = require("discord.js");
const botconfig = require("./botconfig.json");
const jikanjs = require('jikanjs');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on("ready", () => {
  console.log(`${client.user.username} is online`);
  client.user.setActivity("Epic Games Launcher");
});

client.on("message", message => {
  /* Message Handling */
  let prefix = botconfig.prefix;
  let bufferArray = message.content.split(" ");
  const messageArray = bufferArray.shift().toLowerCase();
  const args = message.content.slice(prefix.length).split(' ');
  const cmd = args.shift().toLowerCase();

  if (message.author.bot) return;  //Ignores other bot messages
  if (!message.content.startsWith(botconfig.prefix)) return; //Ignores messages without prefix at [0]

  /* Bot related commands */

  if (message.channel.type === "dm") //Bot sends certain image when Private Messaged
  {
    if (message.author.bot) return;
    message.channel.send({files: ['./eggplantmedaddy.gif'] });
  }

  if (message.isMentioned("500122158039826433"))  //Bot replies when mentioned. Can be expanded on later.
  {
    message.author.send("What the FUCKCKCKCKCKCCKKCCKCKCK DO YOUW AN NAANNTNTNTNTNTTNTTTT")
  }

  /* Commands With Separate files for their code */

  if (cmd === `rmeme`)
  {
    client.commands.get(`meme`).execute(message, args)
  }

  if (cmd === `edward`)
  {
    console.log("ff")
    client.commands.get(`edward`).execute(message, args)
  }

  if (cmd === `roll`)
  {
    let newEmbed = new Discord.RichEmbed()
    client.commands.get(`roll`).execute(message, args, newEmbed);
  }

  if (cmd === `expert`)
  {
    const newEmbed = new Discord.RichEmbed()
    client.commands.get(`expert`).execute(message, args, newEmbed)
  }

  if (cmd === `ping` && message.author.id === "122090401011073029")
  {
    client.commands.get(`ping`).execute(message, args);
  }

  if (cmd === `praise`)
  {
    const newEmbed = new Discord.RichEmbed()
    client.commands.get(`praise`).execute(message, args, newEmbed);
  }

  if (cmd === `dumber`)
  {
    const newEmbed = new Discord.RichEmbed()
    client.commands.get(`dumber`).execute(message, args, newEmbed)
  }

  if (cmd === `daddy`)
  {
    const newEmbed = new Discord.RichEmbed()
    client.commands.get(`daddy`).execute(message, args, newEmbed)
  }

  if (cmd === `anime`)
  {
    client.commands.get(`anime`).execute(message, args)
  }

  if (cmd === `manga`)
  {
    client.commands.get(`manga`).execute(message, args)
  }

  if (cmd === `info`)
  {
    let newEmbed = new Discord.RichEmbed()
    client.commands.get(`info`).execute(message, args, newEmbed)
  }

  if (cmd === `pin`)
  {
    client.commands.get(`pin`).execute(message, args)
  }

  if (cmd === `help`)
  {
    client.commands.get(`help`).execute(message, args)
  }

  /* Commands either too small for separate files or have not been put in ones */

  if (cmd === `fair` && message.author.id === "109685953911590912")
  {
    const newEmbed = new Discord.RichEmbed()
    .setColor("#FFC0CB")
    .setImage("https://leinad.pw/images/fair.png")
    return message.channel.send(newEmbed);
  }

  if (cmd === `8ballz`)
  {
    const ballArray = ["Does it matter", "I guess", "Like I care", "Fuck off", "Suck dick", "Yeah sure", "You wish you could", "Literally die"]
    var arrayChoice = Math.floor(Math.random() * 8)
    const newEmbed = new Discord.RichEmbed()
    .setColor(0x32CD32)
    .addField(`8ball says:`, ballArray[arrayChoice])
    return message.channel.send(newEmbed);
  }

  if (cmd === `kateball`)
  {
    console.log("f")
    const newEmbed = new Discord.RichEmbed()
    .setColor(0xFFFF)
    .setTitle("Kate Says!")
    .setDescription("just hit it hard tomorrow")
    return message.channel.send(newEmbed);
  }

  if (cmd === `glugglug` && message.author.id === "468421106219614208")
  {
    const newEmbed = new Discord.RichEmbed()
    .setColor(0x800080)
    .setImage("https://leinad.pw/images/crowDog.jpg")
    return message.channel.send(newEmbed)
  }

  if (cmd  === `log` && message.author.id === "122090401011073029")
  {
    message.reply("Logs PM'd to you : )")
    message.channel.fetchMessages({ limit: 10 })
      .then(messages => console.log(`Received ${messages.size} messages`))
      .catch(console.error);
  }

  if (cmd === `noah`)
  {
    if (args[0] == 'request')
    {
      let newEmbed = new Discord.RichEmbed()
      .setColor("#D2691E")
      .setDescription("A simple request...")
      .addField("Request:", "For Noah to please eat my big fat ass until he's full.")
      .addField("Complete Request By:", "Tonight at " + new Date())
      .setTimestamp(new Date())
      return message.channel.send(newEmbed);
    }
    else
    {
      var time = new Date()
      const newEmbed = new Discord.RichEmbed()
      .addField(`Noah's greatest creation`, `https://leinad.pw/noah/`)
      .setColor("#FFC0CB")
      .setTimestamp(time)
      return message.channel.send(newEmbed);
    }
  }
});

client.login(botconfig.token);
