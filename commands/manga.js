module.exports = {
    name: 'manga',
    description: 'MangaDex RSS Feed',
    execute(message, args) {
      let Parser = require('rss-parser');
      let parser = new Parser();
      let mangaList = [];

      (async () => {

        let feed = await parser.parseURL('https://mangadex.org/rss/follows/8sMZtgbBaPSTqV3WQDE2Hrx4hueCmcX6');
        console.log(feed.title);

        feed.items.forEach(item => {
          mangaList.push(item)  // Array with all options
          // console.log(item.title + ':' + item.link + ':' + item.pubDate)
        });

        if (args[0])  // If user gives number to output
        {
          if (args[0] > mangaList.length)  // Only numbers <= list size
          {
            console.log("Requested size too great.")
            message.channel.send("Please send a valid number.")
          }
          else  // If valid num, print titles
          {
            for (var i = 0; i < args[0]; i++)
            {
              console.log(mangaList[i].title)
            }
          }
        }
        else  // If user gives no number, print first 10
        {
          message.channel.send("Last 10 Updated Manga!")
          for (var i = 0; i < 10; i++)
          {
            console.log(mangaList[i].title)
            message.channel.send(mangaList[i].title)
          }
        }
      })();
    },
};
