module.exports = {
    name: 'listen',
    description: `Wanna listen to LISTEN.moe radio? Join a voice channel, and then run this command.`,
    aliases: ['listenmoe', 'join'],
    permissions: 'manage_guild',
    guildOnly: true,
    execute(message, args) {

        const { voiceChannel } = message.member;
        const { voiceConnection } = message.guild;

        if (voiceConnection) {
            voiceConnection.disconnect();
        }

        if (!voiceChannel) {
            return message.channel.send('you have to be in a voice channel to add me, b-baka! ｡゜(｀Д´)゜｡');
        }

        if (!voiceChannel.joinable) {
            return message.channel.send('I can not join this voice channel, b-baka! ｡゜(｀Д´)゜｡');
        }

        voiceChannel.join({ shared: true })
            .then(vc => { vc.playStream('async:https://listen.moe/opus') })
            .then(vc => { message.channel.send(`Streaming to your server now, ${message.author}-san! (* ^ ω ^)`) })

    },
};