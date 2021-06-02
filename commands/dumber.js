module.exports = {
    name: 'dumber',
    description: 'Decides who is dumbest',
    execute(message, args, newEmbed) {
        const Discord = require("discord.js");
        const client = new Discord.Client();
        function getUserFromMention(mention) {
          if (!mention) return;
        
          if (mention.startsWith('<@') && mention.endsWith('>')) {
            mention = mention.slice(2, -1);
        
            if (mention.startsWith('!')) {
              mention = mention.slice(1);
            }
        
            return client.users.get(mention);
          }
        }

        if (args.length === 0)
        {
          message.reply("You're the dumbest because you gave no other person idiot");
          console.log("Dumb cmd, improper args");
        }
        else if (args.length === 1)
        {
          console.log(getUserFromMention(args[0]));
          person = getUserFromMention(args[0]);
          if (!person) {
              return message.channel.send("LOLOLOLOL");
          }
          let dumbArr = [message.author.id, person];
          let dumbAns = dumbArr[Math.floor(Math.random() * dumbArr.length)];

          if (dumbAns == dumbArr[0])
          {
            newEmbed
            .setColor(`#ff8e92`)
            .setDescription('In a battle of wits..')
            .addField(`It would seem that ${person} is a fucking idiot`)
            return message.channel.send(newEmbed);
          }
          else
          {
            newEmbed
            .setColor(`#ff8e92`)
            .setDescription('In a battle of wits..')
            .addField('It would seem', dumbAns + ' is a fucking idiot')
            return message.channel.send(newEmbed);
          }
        }
        else if (args.length === 2)
        {
          let dumbArr = [args[0], args[1]];
          let dumbAns = dumbArr[Math.floor(Math.random() * dumbArr.length)];
          newEmbed
          .setColor(`#ff8e92`)
          .setDescription('In a battle of wits..')
          .addField('It would seem', dumbAns + ' is a fucking idiot')
          return message.channel.send(newEmbed);
        }
    },
};
