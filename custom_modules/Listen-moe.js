const Discord           = require('discord.js');
const main              = require('../main.js');
const config            = require('../data/config.json');
const settings          = main.settings;
const client            = main.client;
const webhook           = main.webhook;

class ListenMoe {
    constructor(client, broadcast) {
        this.client = client;
        this.broadcast = broadcast;
    };

    async joinChannel(channel) {
        try {
            const radio_channel = this.client.channels.get(channel)
            if (radio_channel.type == 'voice' && radio_channel.speakable) {
                const connection = await radio_channel.join();
                await connection.playBroadcast(this.broadcast)
                    .on('error', (err) => {
                        webhook.send(`Something went wrong ${this.client.users.get('139191103625625600')}!\n${err}`)
                    });
            };
        } catch (error) {
            webhook.send(`Something went wrong ${this.client.users.get('139191103625625600')}!\n${error}`)
        };
    };

    async leaveChannel(message) {
        radio_channel = await settings.get(message, 'radio_channel');
        await radio_channel.disconnect();
    };
};

module.exports = ListenMoe;