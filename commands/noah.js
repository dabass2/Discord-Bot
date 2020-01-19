module.exports = {
    name: 'noah',
    description: 'The command for the lad.',
    execute(message, args, newEmbed) {
        if (args[0] == 'request')
        {
          newEmbed
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
          newEmbed
          .addField(`Noah's greatest creation`, `https://leinad.pw/noah/`)
          .setColor("#FFC0CB")
          .setTimestamp(time)
          return message.channel.send(newEmbed);
        }
    },
};
