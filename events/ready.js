const auto_track        = require('../custom_modules/current-track.js');
const main              = require('../main.js');
const settings          = main.settings;


//const moe               = main.moe;
//const feeder            = main.feeder;
//const humble_bundle     = require('../custom_modules/humble-bundle.js');
//const Discord           = require('discord.js');

exports.run = (client) => {

    const listen_moe        = require('../custom_modules/listen-moe.js');
    listen_moe.play_radio(client);

    //moe.on('updateTrack', (current_track) => {
    //    channel = client.channels.get('458310090454466562');
    //    auto_track(client, channel, current_track);
    //});

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
