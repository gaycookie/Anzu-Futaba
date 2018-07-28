const GuildSettings     = require('../guildSettings.js');
const settings          = GuildSettings.lastSettings();
const auto_track        = require('../custom_modules/current-track.js')
const main              = require('../main.js');
//const moe               = main.moe;
//const feeder            = main.feeder;
const humble_bundle     = require('../custom_modules/humble-bundle.js');
const Discord           = require('discord.js');

exports.run = (client) => {

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

    function speaking(connection, dispatcher) {
        const hook = new Discord.WebhookClient('472727454054744069', 'hhaicowySuB5qAxGvwcO9rHt3OFl1SzmAf1Ij1wA3BD3cFTX7A4TlUwhFASpdwXCP96u');
        connection.on('speaking', (user, speaking) => {
            if (speaking == true) {
                hook.send(`${connection.client.users.get('139191103625625600')} | Started Streaming in "${connection.channel.name}"`)
            } else {
                hook.send(`${connection.client.users.get('139191103625625600')} | Something went wrong with the stream in "${connection.channel.name}"`)
            }
        })
    }

    const streamKPOP = 'async:https://listen.moe/kpop/opus';
    const streamJPOP = 'async:https://listen.moe/opus';
    const streamOptions = { passes: 10, bitrate: 'auto' }

    for (let item of settings.getAllKPOP()) {
        if (client.channels.get(item).type === 'voice') {
            client.channels.get(item).join({ shared: true })
                .then(connection => {
                    const dispatcher = connection.playStream(streamKPOP, streamOptions);
                    speaking(connection, dispatcher);
                })
                .catch(vc => { })
        }
    }

    for (let item of settings.getAllJPOP()) {
        if (client.channels.get(item).type === 'voice') {
            client.channels.get(item).join({ shared: true })
                .then(connection => {
                    const dispatcher = connection.playStream(streamJPOP, streamOptions);
                    speaking(connection, dispatcher);
                })
                .catch(vc => { })
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
