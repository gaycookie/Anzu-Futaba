const Discord           = require('discord.js');
const main              = require('../main.js');
const config            = require('../data/config.json');
const settings          = main.settings;
const client            = main.client;
const webhook           = main.webhook;

function autoRadio(broadcast) {

    let joined_channels = 0;
    // Connects to all the Radio channels (upon startup)
    for (let item of settings.get_channels('radio')) {
        const radio_channel = client.channels.get(item);
    
        if (radio_channel.type == 'voice' && radio_channel.speakable) {
            radio_channel.join()
            joined_channels = joined_channels + 1;
        };
    };
    webhook.send(`Started broadcasting in **${joined_channels}** configured voice-channels.`)

    // Starts streaming the radio to all current connected channels.
    for (const connection of client.voiceConnections.values()) {
        connection.playBroadcast(broadcast);
    };
};

function newRadio(message, broadcast) {
    // Add a new guild to the settings, and then plays the radio.
};

function playRadio(message, broadcast) {
    // Just plays the radio for one time, doesn't add settings.
}

module.exports.autoRadio = autoRadio;