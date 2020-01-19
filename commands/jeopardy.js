module.exports = {
    name: 'jeopardy',
    description: 'Play Jeopardy Trivia',
    execute(message, args, newEmbed) {
        //http://jservice.io/api/random
        const request = require('request');
        let questionID = []
        request('http://jservice.io/api/random', { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            console.log(body[0]);
            let q = body[0]
            questionID.push(q.id)
            newEmbed
            .setColor(0xff6e6b)
            .setDescription('Jeopardy Trivia!')
            .addField('Category', q.category.title)
            .addField('Question', q.question)
            message.channel.send(newEmbed);
            const filter = response => {
                return q.answer.toLowerCase() === response.content.toLowerCase()
            };
            message.channel.awaitMessages(filter, { maxMatches: 1, time: 30000, errors: ['time'] })
                .then(collected => {
                    message.channel.send(`${collected.first().author} got it!`)
                })
                .catch(collected => {
                    message.channel.send(`Time Up! The correct answer was ${q.answer}`)
                })
          });
        console.log(questionID)
    },
};
