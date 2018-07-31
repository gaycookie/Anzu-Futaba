const Discord           = require('discord.js');
const main              = require('../main.js');
const config            = require('../data/config.json');
const settings          = main.settings;
const client            = main.client;
const hook              = new Discord.WebhookClient(config.webhook.id, config.webhook.token);

function autoRadio(broadcast) {
    for (let item of settings.get_channels('radio')) {
        const radio_channel = client.channels.get(item);
        const guild         = radio_channel.guild;
    
        if (radio_channel.type == 'voice' && radio_channel.speakable) {
            radio_channel.join().then(() => {
                hook.send(`Started streaming JPOP in **${guild.name}** in channel **${radio_channel.name}**`)
            });
        };
    };

    for (const connection of client.voiceConnections.values()) {
        const dispatcher = connection.playBroadcast(broadcast);
        dispatcher.on('end', () => { 
            hook.send(`${connection.client.users.get('139191103625625600')} | Something went wrong with the Stream in **${connection.channel.guild.name}** (${connection.channel.name})`);
        });
    };
};

function newRadio() {
    // Add a new guild to the settings, and then plays the radio.
};

function playRadio() {
    // Just plays the radio for one time, doesn't add settings.
}

module.exports.autoRadio = autoRadio;