const request = require("request");

module.exports = {
    name: 'dog',
    description: 'Show random dog pictures.',
    aliases: ['dogs'],
    guildOnly: true,
    execute(message, args) {
        request('https://api.thedogapi.co.uk/v2/dog.php', {json: true}, function(error, response, body) {
            if (!body['data'][0]["url"] == 'undefined' || response.statusCode == 200) {
                const embed = {
                    "description": `**A Random Dog Just Appeared**`,
                    "color": 16670894,
                    "image": {"url": `${body['data'][0]["url"]}`},
                    "footer": {"text": `Powered by thedogapi.co.uk | Dogs have been shown in total: ${count}`}
                };
                return message.channel.send({embed});
            }
            return message.channel.send('Something went wrong with the API, gomenesai desu~');
        });
    },
};
