const Discord       = require('discord.js');
const music_module  = require('../../custom_modules/musicModule');
const musicModule   = new music_module();
const utils         = require('../../custom_modules/utils');

module.exports = {
    name: 'm',
    description: 'You like to listen to music? Or you just wanna share that one song with everyone in your Voice-channel? Go for it! \n[Click here to read more](https://www.kawaaii.moe/anzu/music)',
    aliases: ['music'],
    usage: ['play <url>', 'queue <url>', 'skip', 'stop'],
    testMode: true,
    guildOnly: true,
    ownerOnly: true,
    execute(message, args) {

        if (args[0] == 'playing') {
            musicModule.getPlaying(message);
        }

        if (args[0] == 'play') {
            musicModule.play(message, args);
        }

        if (args[0] == 'leave') {
            musicModule.stopConnection(message);
        }

        if (args[0] == 'queue') {

            function paginate(array, page_number) {
                let page_size = 10;
                if (!page_number || page_number == 0) page_number = 1;

                --page_number;
                return array.slice(page_number * page_size, (page_number + 1) * page_size);
            }

            musicModule.getQueue(message).then((queue) => {
                if (!queue.length) {
                    return message.channel.send(`There are no songs queued, gomenesai desu~`);
                };

                if (paginate(queue, args[1]).length == 0) { return; };
                const embed = new Discord.RichEmbed()
                    embed.setColor(16670894)
                    embed.setTitle(`Music Queue for ${message.guild.name}`) 
    
                    paginate(queue, args[1]).forEach(function (value, i) {
                        embed.addField(`${value.song_name}`, `Duration: **${value.song_duration}** | Requester: ${message.client.users.get(value.requester)}`, false)
                    })
    
                    embed.setFooter(`Songs in Queue: ${queue.length}`, `https://kawaaii.moe/images/discord/Anzu/AnzuDJ.png`)
                    embed.setThumbnail(`https://kawaaii.moe/images/discord/Anzu/AnzuDJ.png`)
                return message.channel.send({embed: embed})

            })
        }

        if (args[0] == 'playlist') {
            musicModule.queuePlaylist(message, args[1])
        }

    }
}