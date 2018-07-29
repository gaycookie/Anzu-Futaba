const Discord           = require('discord.js');
const main              = require('../main.js');
const settings          = main.settings;
const hook              = new Discord.WebhookClient('472727454054744069', 'hhaicowySuB5qAxGvwcO9rHt3OFl1SzmAf1Ij1wA3BD3cFTX7A4TlUwhFASpdwXCP96u');

const streamJPOP        = 'async:https://listen.moe/opus';
//const streamKPOP        = 'async:https://listen.moe/kpop/opus';
//const streamOptions     = { passes: 10, bitrate: 'auto' }

// ---------------------------------------------- //

function play_radio(client) {
    for (let item of settings.get_channels('radio')) {
        const radio_channel = client.channels.get(item);
        const guild         = radio_channel.guild;

        if (radio_channel.type == 'voice' && radio_channel.speakable) {
            radio_channel.join().then(connection => {
                const dispatcher = connection.playStream(streamJPOP);
                hook.send(`Started streaming JPOP in **${guild.name}** in channel **${radio_channel.name}**`)
                dispatcher.on('end', () => { 
                    hook.send(`${connection.client.users.get('139191103625625600')} | Restarting the stream in **${radio_channel.name}** in channel **${guild.name}**`);
                    play(client);
                });
                //dispatcher.on('speaking', (speaking) => {
                //    if (speaking == false) {
                //        hook.send(`${connection.client.users.get('139191103625625600')} | Something went wrong with the stream in **${radio_channel.name}** in **${guild.name}**`);
                //        dispatcher.disconnect();
                //        play_radio(client)
                //    };
                //});
            });
        }
    }
}

// ---------------------------------------------- //

//function speaking(client, connection, dispatcher) {
//   
//    dispatcher.on('speaking', (speaking) => {
//        if (speaking == false) {
//            const channel_id = connection.channel.id;
//            hook.send(`${connection.client.users.get('139191103625625600')} | Something went wrong with the stream in "${connection.channel.name}"`);
//            connection.disconnect();
//            play_stream(client, channel_id)
//        };
//    })
//}

module.exports.play_radio       = play_radio;