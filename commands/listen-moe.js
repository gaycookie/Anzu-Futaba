module.exports = {
    name: 'listen',
    description: `Wanna listen to LISTEN.moe radio? Join a voice channel, and then run this command.`,
    //usage: '[emoji]',
    aliases: ['listenmoe', 'join'],
    permissions: 'manage_guild',
    guildOnly: true,
    execute(message, args) {

        let guilds;
        const { voiceChannel } = message.member;

        if (message.guild.voiceConnection) {
            return message.channel.send('I am already in a voice channel here, b-baka! ｡゜(｀Д´)゜｡');
        }

        if (!voiceChannel) {
            return message.channel.send('you have to be in a voice channel to add me, b-baka! ｡゜(｀Д´)゜｡');
        }

        voiceChannel.join({ shared: true })
            .then(vc => { vc.playStream('async:https://listen.moe/opus') })
            .then(vc => { message.channel.send(`Streaming to your server now, ${message.author}-san! (* ^ ω ^)`) })

    },
};