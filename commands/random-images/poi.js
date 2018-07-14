const weeb      = require("weeb.js");
const config    = require('../../data/config.json');
const sh        = new weeb(config.apis['weeb_sh'], "Weeb.js Example/v1.6.1");

function weeb_embed(emote, message) {
    sh.getRandom({type: emote, nsfw: false, filetype: "gif"})
        .then(response => {
            const embed = {
                "color": 16670894,
                "description": "**A Random Poi Just Appeared**",
                "image": {"url": `${response.url}`},
                "footer": {
                    "text": `Powered by weeb.sh`,
                    "icon_url": "https://docs.weeb.sh/images/logo.png"
                }
            };
            message.channel.send({embed});
        })
        .catch(error => {
            message.channel.send(`${message.author}, something went wrong, please try again. Gomenesai desu~`);
        })
}

module.exports = {
    name: 'poi',
    description: 'Show random Poi images.',
    //usage: '<@mention>',
    guildOnly: true,
    aliases: [],
    execute(message, args) {

        weeb_embed('poi', message);

    },
};