const Discord   = require('discord.js');
const moe       = require('../main.js').moe;

module.exports = {
    name: 'nowplaying',
    description: `To see the current playing song on LISTEN.moe, execute this command.`,
    //usage: '[emoji]',
    aliases: ['np', 'current'],
    guildOnly: true,
    execute(message, args) {

        //moe.connect();
        current_track = moe.getCurrentTrack();
        console.log(current_track)

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

    },
};