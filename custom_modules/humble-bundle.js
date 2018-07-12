const Discord   = require('discord.js');
const main      = require('../main.js');
const feeder    = main.feeder;

function humble_bundle(client, channel_id) {

    feeder.on('new-item', item => {
        console.log("I received a event");
    });
}

module.exports = humble_bundle;