const Discord   = require('discord.js');
const main      = require('../../main.js');
const moeKPOP   = main.moeKPOP;
const moeJPOP   = main.moeJPOP;

function listen_embed(message, type) {

    if (type == 'jpop') {
        current_track = moeJPOP.getCurrentTrack();
    } else {
        current_track = moeKPOP.getCurrentTrack();
    }

    let artists = current_track.song.artists[0].name;
    if (current_track.song.artists.length > 1) {
        artists_array = [];
        for (let artist in current_track.song.artists) {
            var value = current_track.song.artists[artist].name;
            if (value) {artists_array.push(value)};
        }
        artists = artists_array.join(", ")
    }

    let albums = 'None';
    let thumbnail = `${message.client.user.avatarURL}`;

    if (current_track.song.albums.length) {
        albums = current_track.song.albums[0].name

        if (current_track.song.albums[0].image) {
            thumbnail = `https://cdn.listen.moe/covers/${current_track.song.albums[0].image}`
        }

        if (current_track.song.albums.length > 1) {
            albums_array = [];
            for (let album in current_track.song.albums) {
                var value = current_track.song.albums[album].name;
                if (value) {albums_array.push(value)};
            }
            albums = albums_array.join(", ")
        };
    }

    const nowPlayingEmbed = new Discord.RichEmbed()
        .setColor(16670894)
        .setTitle(`${message.client.user.username} is now playing`)
        .setThumbnail(`${thumbnail}`)
        .addField('Song Name:', `${current_track.song.title}`)
        .addField('Song Artist: ', `${artists}`)
        .addField('Song Albums:', `${albums}`)
        .setFooter('Music Powered by LISTEN.moe', 'https://listen.moe/public/images/icons/android-chrome-192x192.png');

    message.channel.send({ embed: nowPlayingEmbed });
}

module.exports = {
    name: 'nowplaying',
    description: `To see the current playing song on LISTEN.moe, execute this command.`,
    //usage: '[emoji]',
    aliases: ['np', 'current'],
    guildOnly: true,
    execute(message, args) {

        if (!args[0]) {

            radio_genre = settings.get(message, 'radio_genre');
            if (radio_genre) {
                if (radio_genre == 'jpop') {
                    return listen_embed(message, 'jpop')
                } else {
                    return listen_embed(message, 'kpop')
                };
            } else {
                return listen_embed(message, 'jpop')
            }

        } else {
            if (args[0] == 'jpop') {
                return listen_embed(message, 'jpop')
            } if (args[0] == 'kpop') {
                return listen_embed(message, 'kpop')
            } else {
                return message.channel.send(`B-baka, you can only use these options: \`JPOP\` and \`KPOP\`. ｡゜(｀Д´)゜｡`)
            }

        }

    },
};