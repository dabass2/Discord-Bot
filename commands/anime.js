module.exports = {
  name: 'anime',
  description: 'Post anime',
  execute(message, args)
  {
    const fs = require('fs');
    const jikanjs = require('jikanjs');
    const Discord = require("discord.js");

    // console.log(args.length)
    if (args.length < 1)
    {
      // !anime (posts rand image)
      if (args.length === 0)
      {
        const words = ["cool", "funny", "food", "scenery", "", "animation", "cute", "purple"]

        function getImage(message)
        {
          const adjective = words[Math.floor(Math.random() * Math.floor(words.length))]
          const keyword = `anime ${adjective}`
          var Scraper = require('images-scraper')
              bing = new Scraper.Bing();
          bing.list({
              keyword: keyword,
              num: 25,
              detail: true
          })
          .then(function(res) {
              var randIndex = Math.floor(Math.random() * Math.floor(res.length))
              const embed = new Discord.RichEmbed()
              .setColor(0x32CD32)
              .setImage(res[randIndex].url)
              .setTimestamp(new Date())
              message.channel.send({embed});
              console.log("Sent anime message with keyword: ", keyword)
          }).catch((err) => {
            console.log(err)
          })
        }
        getImage(message)
      }
    }
    // console.log(args[0])
    if (args.length >= 1)
    {
      // console.log(args[0])
      if (args[0] === "adduser")
      {
        if (args.length === 1)
        {
          message.channel.send("the fuck? who you tryna add? casper? headass mf..")
        }
        else
        {
          let user = args[0]
          let f = []
          fs.appendFile("users.txt", `\n{${message.author.id}: '${args[1]}'}`, function(err) {
              if(err) {
                  return console.log(err);
              } else {
                console.log("The file was saved!");
              }
          });
        }
      }
      // !anime schedule
      if (args[0] === "schedule")
      {
        // !anime schedule [day] (schedule based on certain day)
        if (args[1])
        {
          let day = args[1].toLowerCase()  // User input'd day
          dayList = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

          let shows = {}
          let watching = []
          let userWatching
          
          if (dayList.includes(day) === false)
          {
            return(message.reply("Please send a valid day of the week as the third argument."))
          }
          let airingDay = jikanjs.loadSchedule(day).then((response) => {
            response[day].forEach(element => {
              shows[element.title] = element.url  // Name of shows airing that day
            })
          }).catch((err) => {
            message.channel.send("Error loading airing day information.")
            console.log(err)
          })

          // !anime schedule [day] [username] (schedule based on day and certain user)
          if (args[2])
          {
            let username = args[2]
            userWatching = jikanjs.loadUser(username, 'animelist', 'watching').then((response) => {
              response.anime.forEach(element => {
                watching.push(element.title)
              })
            }).catch((err) => {
              console.log(err)
              message.channel.send("Error loading user watch data.")
            })

            Promise.all([airingDay, userWatching]).then(() => {
              let int = Object.keys(shows).filter(value => watching.includes(value)) // Finds shows that release and the usr is watching
              if (int.length === 0)  // No show releasing that day the user is watching
              {
                int.push("No watching shows releasing!")
              }
              console.log(`On ${day} ${username} is watching ${int}`)
              const embed = new Discord.RichEmbed()
              .setColor(0xf56f42)
              .setTitle('__Currently Airing Anime__')
              .setDescription(day.charAt(0).toUpperCase() + day.slice(1)) // Makes first letter of the day Cap
              .addField('__Anime__', int)
              .setTimestamp(new Date())
              message.channel.send({embed});  // Sends gathered info
            })
          }

          if (args[2] === undefined)  // No user so just sends what's releasing that day
          {
            Promise.all([airingDay]).then(() => {
              const embed = new Discord.RichEmbed()
              .setColor(0xf56f42)
              .setTitle('__Currently Airing Anime__')
              .setDescription(day.charAt(0).toUpperCase() + day.slice(1)) // Makes first letter of the day Cap
              .addField('__Anime__', Object.keys(shows))
              .setTimestamp(new Date())
              message.channel.send({embed});
            })
          }
        }
      }
    }
  }
}
