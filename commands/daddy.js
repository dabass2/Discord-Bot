module.exports = {
    name: 'daddy',
    description: 'help me',
    execute(message, args, newEmbed) {
      newEmbed
      .setColor("#ffff")
      .setDescription('Daddy :tired_face:')
      .setThumbnail("https://i.imgur.com/miGCppP.gif")
      .setImage("https://i.imgur.com/miGCppP.gif")
      .setAuthor(message.author.username, "https://i.imgur.com/miGCppP.gif")
      return message.channel.send(newEmbed);
    },
};
