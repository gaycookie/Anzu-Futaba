const settings          = require('../../main.js').settings;
const streamKPOP        = 'async:https://listen.moe/kpop/opus';
const streamJPOP        = 'async:https://listen.moe/opus';
const streamOptions     = { passes: 10, bitrate: 'auto' };

function play_stream(msg, genre) {
    const { voiceChannel } = msg.member;
    if (genre == 'kpop') { streamURL = streamKPOP } else { streamURL = streamJPOP };
    voiceChannel.join({ shared: true })
        .then(vc => { vc.playStream(streamURL, streamOptions) })
        .then(vc => { msg.channel.send(`Streaming **${genre}** to your server now, ${msg.author}-san! (* ^ ω ^)`) })
};

module.exports = {
    name: 'listen',
    description: `Wanna listen to LISTEN.moe radio? Join a voice channel, and then run this command.`,
    aliases: ['listenmoe', 'join'],
    permissions: 'manage_guild',
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

        if (voiceConnection) {
            voiceConnection.disconnect();
        };

        if (!args[0]) {

            radio_genre = settings.get(message, 'radio_genre');
            if (radio_genre) {
                if (radio_genre == 'jpop') {
                    return play_stream(message, 'jpop');
                } else {
                    return play_stream(message, 'kpop');
                };
            } else {
                return play_stream(message, 'jpop');
            }

        } else {
            if (args[0] == 'jpop') {
                return play_stream(message, 'jpop');
            } if (args[0] == 'kpop') {
                return play_stream(message, 'kpop');
            } else {
                return message.channel.send(`B-baka, you can only use these options: \`JPOP\` and \`KPOP\`. ｡゜(｀Д´)゜｡`)
            }

        }

    },
};