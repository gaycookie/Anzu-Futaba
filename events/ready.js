const auto_track        = require('../custom_modules/current-track.js');
const main              = require('../main.js');
const fs                = require('fs');
const request           = require('request')
const settings          = main.settings;
const webhook           = main.webhook;
const streamOptions     = {
    type: 'ogg/opus'
}

//let broadcastJPOP;
let broadcastKPOP;

exports.run = (client) => {

    createBroadcast(client);
    function createBroadcast(client) {
        //broadcastJPOP = client.createVoiceBroadcast();
        broadcastKPOP = client.createVoiceBroadcast();
        
        //broadcastJPOP.playStream('https://listen.moe/opus', streamOptions)
        broadcastKPOP.playStream('https://listen.moe/kpop/stream', streamOptions)

        //broadcastJPOP.on('end', () => {
        //    webhook.send(`${client.users.get('139191103625625600')} | **Listen.moe JPOP** broadcast was ended, reloading it now...`);
        //    createBroadcast(client);
        //})

        broadcastKPOP.on('end', () => {
            webhook.send(`${client.users.get('139191103625625600')} | **Listen.moe KPOP** broadcast was ended, reloading it now...`);
            createBroadcast(client);
        })
    }

    async function joinChannel(channel) {
        const radio_channel = client.channels.get(channel)
        if (radio_channel.type == 'voice' && radio_channel.speakable) {
            const connection = await radio_channel.join();
            await connection.playBroadcast(broadcastKPOP)
                .on('error', (err) => {
                    webhook.send(`Something went wrong ${this.client.users.get('139191103625625600')}!\n${err}`)
                });
        };
    }

    let joined_channels = 0;
    for (let item of settings.get_channels('radio')) {
        joinChannel(item);
        joined_channels = joined_channels + 1;
    };
    webhook.send(`Started broadcasting in **${joined_channels}** configured voice-channels.`)

    const { status } = require('../data/constants.js');
    function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms));}
    async function activity() {
        let current = 0;
        while (true) {
            if (current === status.length) {current = 0}
            client.user.setActivity(`${status[current]}`, { url: 'https://www.twitch.tv/noella_kawaii', type: 'STREAMING' })
            await sleep(20000);
            current++;
        }
    }

    console.log("|-------------------")
    console.log("| Anzu Discord Bot  ")
    console.log("|-------------------")
    console.log(`| ${client.user.username}`)
    console.log("| ")
    console.log(`| Guilds: ${client.guilds.size}`)
    console.log(`| Users: ${client.users.size}`)
    console.log(`|-------------------`)
    activity();

}

//const moe               = main.moe;
//const feeder            = main.feeder;
//const humble_bundle     = require('../custom_modules/humble-bundle.js');
//const Discord           = require('discord.js');

    //feeder.on('new-item', (item) => {
    //    console.log('There was an Humble Blog posted.')
    //    if (item.categories.includes('humble free game') && !item.categories.includes('humble monthly')) {
    //        console.log('And this time it was one that we wanna sent around!')
    //        channel = client.channels.get('401377602842918920');
    //        owner = client.users.get('139191103625625600');
    //        const KawaaiiEmbed = new Discord.RichEmbed()
    //            .setColor(16670894)
    //            .setThumbnail(`${client.user.avatarURL}`)
    //            .setTitle(`New free game available on Humble Bundle! ❤`)
    //            .setURL(`https://www.humblebundle.com/`)
    //            .setDescription(`Be fast, there is a new free game available on Humble Bundle.\nAlso make sure to share this with everyone you know!\nThis message was automaticly sent by ${client.user}`)
    //
    //        channel.send({ embed: KawaaiiEmbed });
    //        channel.send(`${owner}`);
    //    }
    //});