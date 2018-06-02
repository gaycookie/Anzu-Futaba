const request = require("request");
const db      = require("../db.js");

module.exports = {
    name: 'neko',
    description: 'Show random neko pictures.',
    aliases: ['nekos'],
    guildOnly: true,
    execute(message, args) {
        request('https://nekos.life/api/neko', {json: true}, function(error, response, body) {

            db.query("SELECT COUNT(*) FROM commands WHERE command = ?", ['neko'], function(err, result, fields) {
                if (err) {const count = 0;}
                const count = result[0]['COUNT(*)'];

            if (!body['neko'] == 'undefined' || response.statusCode == 200) {
                const embed = {
                    "description": `**A Random Neko Girl Just Appeared**`,
                    "color": 16670894,
                    "image": {"url": `${body['neko']}`},
                    "footer": {"text": `Powered by nekos.life | Nekos have been shown in total: ${count}`}
                };
                return message.channel.send({embed});
            }
            return message.channel.send('Something went wrong with the API, gomenesai desu~');
            })
        });
    },
};
