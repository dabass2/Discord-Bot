module.exports = {
    name: 'jeopardy',
    description: 'Play Jeopardy Trivia',
    execute(message, args, newEmbed) {
        const Discord = require("discord.js");
        const request = require('request');
        //http://jservice.io/api/random (api url)

        /* Function that gets question and handles responses */

        function question()
        {
            let questionID = []
            request('http://jservice.io/api/random', { json: true }, (err, res, body) => {
                if (err) { return console.log(err); }
                // console.log(body[0].question);
                // console.log(body[0].answer)
                let q = body[0]
                questionID.push(q.id)
                let embed = new Discord.RichEmbed()
                .setColor(0xff6e6b)
                .setDescription('Jeopardy Trivia!')
                .addField('Category', q.category.title)
                .addField('Question', q.question)
                message.channel.send(embed)
                console.log(q.answer)
                return q.answer;
            });
        }
        
        /* Code that determines game parameters */
        if (!!args)
        {
            for (let i = 0; i < 2; i++)
            {
                let q = question()
                console.log(q)
                const filter = response => {
                    return q.toLowerCase() === response.content.toLowerCase()
                };
                message.channel.awaitMessages(filter, { maxMatches: 1, time: 30000, errors: ['time'] })
                    .then(collected => {
                        message.channel.send(`${collected.first().author} got it!`)
                    })
                    .catch(collected => {
                        message.channel.send(`Time Up! The correct answer was ${q}`)
                    })
            }
        }
    },
};
