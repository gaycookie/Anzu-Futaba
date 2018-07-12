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
        if (args[0]) {
            if (args.includes('loli') || args.includes('shota')) {
                return message.reply(`I'm gonna stop you here and tell you that that is not allowed.. <:kawaiiBaka:437030808696520724>`);
            } else {
                url = `https://konachan.com/post.json?limit=1&tags=order:random%20rating:explicit ${args.join('_')}`;
            }
        } else {
            url = `https://konachan.com/post.json?limit=1&tags=order:random%20rating:explicit`;
        }
        request(`${url}`, {json: true}, function(error, response, body) {
            if (body[0]) {

                let columns = [];
                let rating = "";
                let tags = "";
                if (body[0]['author']) {
                    columns.push({
                        name: 'Author',
                        value: `[${body[0]['author']}](https://konachan.com/user/show/${body[0]['creator_id']})`,
                        inline: true
                    });
                }
                columns.push({
                    name: 'Open External',
                    value: `[Open on Konachan](https://konachan.com/post/show/${body[0]['id']}/)`,
                    inline: true
                });
                if (body[0]['rating'] === "e") {
                    rating = "Explicit";
                }

                if (body[0]['rating'] === "s") {
                    rating = "Safe";
                }

                if (body[0]['rating'] === "q") {
                    rating = "Questionable";
                }

                columns.push({
                    name: 'Image Rating',
                    value: rating,
                    inline: true
                });

                columns.push({
                    name: 'Image Size',
                    value: `${body[0]['width']} x ${body[0]['height']}`,
                    inline: true
                });
                if (args[0]) {
                    tags = `| tags used: ${args.join('_')}`
                }

                const embed = {
                    "color": 16670894,
                    "image": {"url": `${body[0]['file_url']}`},
                    "footer": {"icon_url": "https://i.imgur.com/7ikczvx.png", "text": `Powered by konachan.com ${tags}`},
                    "fields": columns
                };
                return message.channel.send({embed});
            }
            return message.channel.send('Did not find any image, maybe try another tag, gomenesai desu~');

        });
    },
};
