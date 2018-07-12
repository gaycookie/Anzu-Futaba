const request = require("request");

module.exports = {
    name: 'neko',
    description: 'Show random neko pictures.',
    aliases: ['nekos'],
    guildOnly: true,
    execute(message, args) {
        request('https://nekos.life/api/neko', {json: true}, function(error, response, body) {

            if (!body['neko'] == 'undefined' || response.statusCode == 200) {
                const embed = {
                    "description": `**A Random Neko Girl Just Appeared**`,
                    "color": 16670894,
                    "image": {"url": `${body['neko']}`},
                    "footer": {"text": `Powered by nekos.life`}
                };
                return message.channel.send({embed});
            }
            return message.channel.send('Something went wrong with the API, gomenesai desu~');
        })
    },
};
