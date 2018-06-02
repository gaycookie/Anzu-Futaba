const config = require('../data/config.json');

module.exports = {
    name: 'ping',
    description: 'Get the bot\'s latency, between the Bot and Discord and Bot and the API.',
    aliases: ['latency'],
    cooldown: 5,
    execute(message, args) {
        const client = message.client;
        message.channel.send("Ping?")
        .then(m => m.edit(`${config.emotes['noella']} | Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms ${config.emotes['thumb_up']}`));
    },
};