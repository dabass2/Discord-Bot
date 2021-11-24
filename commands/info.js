module.exports = {
    name: 'info',
    description: 'Gives info about a user',
    execute(message, args, newEmbed) {
      //console.log(message.author.avatarURL)
      if (args.length == 0)
      {
        //let usrPic = message.author.avatarURL;
        newEmbed
        .setDescription('User Information')
        .setColor('#97e552')
	.setImage(message.author.avatarURL)
        //.setThumbnail(usrPic)
        .addField('Username', message.author.username)
        .addField('User Created on', message.author.createdAt)
        //.addField('Joined at', message.member.joinedAt)
        //.addField('Last message', message.)
        return message.channel.send(newEmbed);
      }
      
      if (args.length > 0)
      {
        message.reply('Ok chief calm down there think I finna code that much rn')
      }
    },
};
