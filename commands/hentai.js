const request = require("request");
let url = '';

module.exports = {
    name: 'hentai',
    description: 'Show Random Konachan Images (Explicit)\n**Only allowed in NSFW flagged channels.**',
    aliases: ['konachan', 'kona'],
    guildOnly: true,
    NSFW: true,
    usage: '<tag(s)>',
    execute(message, args) {
        if (args[0]) {url = `https://konachan.com/post.json?limit=1&tags=order:random%20rating:explicit ${args.join('_')}`}
        else {url = `https://konachan.com/post.json?limit=1&tags=order:random%20rating:explicit`}
        request(`${url}`, {json: true}, function(error, response, body) {

            if (body[0]) {
                const embed = {
                    "color": 16670894,
                    "image": {"url": `${body[0]['file_url']}`},
                    "footer": {"icon_url": "https://i.imgur.com/7ikczvx.png", "text": `Powered by konachan.com`}
                };
                return message.channel.send({embed});
            }
            return message.channel.send('Did not find any image, maybe try another tag, gomenesai desu~');

        });
    },
};
