module.exports = {
    name: 'info',
    description: 'Gives info about a user',
    execute(message, args, newEmbed) {
      // if (args.length == 1)
      // {
      //   let person = args[0];
      //   if (person.startsWith('<@') && person.endsWith('>')) {
      // 		person = person.slice(2, -1);
      //
      // 		if (person.startsWith('!')) {
      // 			person = person.slice(1);
      // 		}
      // 	}
      //   console.log(person)
      //   let usrPic = person.displayAvatarURL;
      //   newEmbed
      //   .setDescription('User Information')
      //   .setColor('#97e552')
      //   .setThumbnail(usrPic)
      //   .addField('Username', person.username)
      //   .addField('User Created on', message.author.createdAt)
      //   .addField('Joined at', message.member.joinedAt)
      //   .addField('Last message', message.createdAt)
      //   return message.channel.send(newEmbed)
      // }
      if (args.length == 0)
      {
        let usrPic = message.author.displayAvatarURL;
        newEmbed
        .setDescription('User Information')
        .setColor('#97e552')
        .setThumbnail(usrPic)
        .addField('Username', message.author.username)
        .addField('User Created on', message.author.createdAt)
        .addField('Joined at', message.member.joinedAt)
        .addField('Last message', message.createdAt)

        return message.channel.send(newEmbed);
      }
      if (args.length > 0)
      {
        message.reply('Ok chief calm down there think I finna code that much rn')
      }
    },
};
