const Discord           = require('discord.js');
const streamKPOP        = 'async:https://listen.moe/kpop/opus';
const streamJPOP        = 'async:https://listen.moe/opus';
const streamOptions     = { passes: 10, bitrate: 'auto' }

const main              = require('../main.js');
const settings          = main.settings;

function speaking(client, connection, dispatcher) {
    const hook = new Discord.WebhookClient('472727454054744069', 'hhaicowySuB5qAxGvwcO9rHt3OFl1SzmAf1Ij1wA3BD3cFTX7A4TlUwhFASpdwXCP96u');
    dispatcher.on('speaking', (speaking) => { // Weird that User was not a thing.. I guess the Doc's aren't up to date!
        console.log(speaking);
        if (speaking == false) {
            hook.send(`${connection.client.users.get('139191103625625600')} | Something went wrong with the stream in "${connection.channel.name}"`);
            auto_play(client);
        };
    })
}

function auto_play(client) {
    for (let item of settings.getAllKPOP()) {
        if (client.channels.get(item).type === 'voice') {
            client.channels.get(item).join({ shared: true })
            .then(connection => {
                const dispatcher = connection.playStream(streamKPOP, streamOptions);
                speaking(client, connection, dispatcher);
            })
            .catch(vc => { })
        };
    };

    for (let item of settings.getAllJPOP()) {
        if (client.channels.get(item).type === 'voice') {
            client.channels.get(item).join({ shared: true })
            .then(connection => {
                const dispatcher = connection.playStream(streamJPOP, streamOptions);
                speaking(client, connection, dispatcher);
            })
            .catch(vc => { })
        };
    };
}

module.exports.auto_play        = auto_play;
module.exports.playing_check    = speaking;