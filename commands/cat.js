const request = require("request");
const db      = require("../db.js");

module.exports = {
    name: 'cat',
    description: 'Show random cat pictures.',
    aliases: ['cats'],
    guildOnly: true,
    execute(message, args) {
        request('http://aws.random.cat/meow', {json: true}, function(error, response, body) {

            db.query("SELECT COUNT(*) FROM commands WHERE command = ?", ['cat'], function(err, result, fields) {
                if (err) {const count = 0;}
                const count = result[0]['COUNT(*)'];

            if (!body['file'] == 'undefined' || response.statusCode == 200) {
                const embed = {
                    "description": `**A Random Cat Just Appeared**`,
                    "color": 16670894,
                    "image": {"url": `${body['file']}`},
                    "footer": {"text": `Powered by random.cat | Cats have been shown in total: ${count}`}
                };
                return message.channel.send({embed});
            }
            return message.channel.send('Something went wrong with the API, gomenesai desu~');
            })
        });
    },
};
