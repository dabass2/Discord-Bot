module.exports = {
    name: 'syn',
    description: 'synonym',
    execute(message, args) {
      const datamuse = require('datamuse');
      let synArr

      var i = 0
      while (i < args.length)
      {
        datamuse.request(`words?rel_syn=${args[i]}`)
        .then((json) => {
          console.log(args[i])
          var choice = Math.floor(Math.random() * json.length)
          // console.log(json[choice])
          console.log(json[choice].word)
        })
        i++
      }

        // datamuse.request(`words?ml=${args[word]}`)
        // .then((json) => {
        //   var choice = Math.floor(Math.random() * json.length)
        //   console.log(json[choice])
        //   console.log(json[choice]['word'])
        //   synArr += json[choice]['word']
        //   synArr += " "
        //   console.log(synArr)
        // });
      // console.log(synArr)
      // message.channel.send(synArr)

    },
};
