const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };

module.exports = {
    name: 'play',
    description: `Make me join your current voice-channel, so you can play music!`,
    aliases: ['join', 'listen', 'summon'],
    guildOnly: true,
    execute(message, args) {

        const { voiceChannel } = message.member;
        const { voiceConnection } = message.guild;

        if (!voiceChannel) {
            return message.channel.send('you have to be in a voice channel to add me, b-baka! ｡゜(｀Д´)゜｡');
        };

        if (!voiceChannel.joinable) {
            return message.channel.send('I can not join this voice channel, b-baka! ｡゜(｀Д´)゜｡');
        };

        if (!args[0]) {
            voiceChannel.join().then(connection => message.channel.send(`Successfully joined **${voiceChannel.name}** Senpai desu~`))
        } else {
            voiceChannel.join().then(connection => {
                const stream = ytdl(args[0], { filter : 'audioonly' });
                const dispatcher = connection.playStream(stream, streamOptions);
            })
            .catch(console.error);
        }

    }
}