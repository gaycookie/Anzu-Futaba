const request = require("request");

module.exports = {
    name: 'cat',
    description: 'Show random cat pictures.',
    aliases: ['cats'],
    guildOnly: true,
    execute(message, args) {
        request('http://aws.random.cat/meow', {json: true}, function(error, response, body) {
            if (!body['file'] == 'undefined' || response.statusCode == 200) {
                const embed = {
                    "description": `**A Random Cat Just Appeared**`,
                    "color": 16670894,
                    "image": {"url": `${body['file']}`},
                    "footer": {"text": `Powered by random.cat`}
                };
                return message.channel.send({embed});
            }
            return message.channel.send('Something went wrong with the API, gomenesai desu~');
        });
    },
};
