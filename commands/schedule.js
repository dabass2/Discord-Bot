module.exports = {
  name: 'schedule',
  description: 'Anime Schedule',
  execute(message, args)
  {
    const jikanjs = require('jikanjs');
    const Discord = require("discord.js");
    let day = args[0]
    console.log(day)
    let shows = []
    let watching = []
    let int = ''

    let d = jikanjs.loadSchedule(day).then((response) => {
      response[day].forEach(element => {
        shows.push(element.title)
      })
    }).catch((err) => {
      console.log(err)
    })

    let f = jikanjs.loadUser('NotFunstuff', 'animelist', 'watching').then((response) => {
      response.anime.forEach(element => {
        watching.push(element.title)
      })
    }).catch((err) => {
      console.log(err)
    })

    Promise.all([d, f]).then(() => {
      let int = shows.filter(value => watching.includes(value))
      if (int.length === 0)
      {
        int.push("None")
      }
      console.log(int)
      const embed = new Discord.RichEmbed()
      .setColor(0xb19cd9)
      .setTitle('Currently Airing Anime')
      .setDescription(day.charAt(0).toUpperCase() + day.slice(1))
      .addField('Anime', int)
      .setTimestamp(new Date())
      message.channel.send({embed});
    })
  }
};
