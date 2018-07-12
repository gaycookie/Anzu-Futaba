const answers = require('../../data/eightball_answers.json')

module.exports = {
    name: '8ball',
    description: `Ask the :crystal_ball: a question and get an answer.`,
    usage: '[question]',
    aliases: ['eightball'],
    guildOnly: true,
    execute(message, args) {

        if (!args.length) return message.channel.send(`${message.author}, you need to ask me something, b-baka!`);

        var answer = answers.answers[Math.floor(Math.random()*answers.answers.length)];
        const embed = {
            "color": 16670894,
            "thumbnail": {
                "url": `${message.author.avatarURL}`
            },
            "fields": [{
                name: `${message.author.username} asks: `,
                value: `${args.join(" ")}`
            },
            {
                name: `${message.client.user.username} answers: `,
                value: `${answer}`
            }],
        }
        message.channel.send({embed})

    },
};