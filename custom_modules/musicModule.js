const Discord        = require('discord.js');
const ytdl           = require('ytdl-core');
const { getInfo }    = require('ytdl-getinfo')

const { errorEvent } = require('../main');
const utils          = require('../custom_modules/utils');
const config         = require('../data/config.json');
const music_settings = {
    "related_videos": 3,
    "stream_options": { 
        "seek": 0, 
        "volume": 1
    }
}

// This is for another function soon //
//const music_settings = {
//    "related_videos": 3,
//    "stream_options": { 
//        "seek": 0, 
//        "volume": 1
//    }
//}

//let related_songs = [];
//if (!song['related_videos'].length) {};
//song['related_videos'].forEach(function (value, i) {
//    if (value.title && related_songs.length < music_settings.related_videos) {
//        related_songs.push({"song_name": value['title'], "song_url": `https://www.youtube.com/watch?v=${value['id']}`});
//    }
//})
// This is for another function soon //

let _lastQueues = null;

class MusicModule {
    constructor() {
        this.queues = {};
        this.connection = {};
        this.playing = {};
        _lastQueues = this;
    }

    async makeQueue(message) {
        this.queues[message.guild.id] = await [];
    };

    async getQueue(message) {
        if (!this.queues[message.guild.id]) {
            await this.makeQueue(message)
        };
        return this.queues[message.guild.id];
    };

    async getConnection(message, voiceChannel) {
        if (!this.connection[message.guild.id]) {
            await voiceChannel.join().then(async (conn) => {
                this.connection[message.guild.id] = await conn;
            })
            .catch(console.error);
        };
        return this.connection[message.guild.id];
    };

    async stopConnection(message) {
        if (this.connection[message.guild.id]) {
            try {
                this.queues[message.guild.id] = await [];
                this.connection[message.guild.id].disconnect();
                this.connection[message.guild.id].channel.leave();
                this.connection[message.guild.id] = await null;
                this.playing[message.guild.id] = await null;
            } catch (e) {
                console.log(e)
            }
        }
    }

    async addPlaying(message, url) {
        await ytdl.getBasicInfo(url)
            .then(async (song) => {
                const nowPlaying = await {
                    "requester": message.author.id,
                    "channel": message.channel.id,
                    "song_name": song['title'],
                    "song_url": song['video_url'],
                    "song_duration": utils.prettifyDuration(song['length_seconds'])
                }
                this.playing[message.guild.id] = await nowPlaying;
            })
            .catch((e) => {
                console.log(e)
            })
    };

    async getPlaying(message) {
        if (!this.playing[message.guild.id]) {
            return await message.channel.send(`Currently not playing anything, gomenensai desu~`)
        }

        const embed = new Discord.RichEmbed()
            embed.setColor(16670894)
            embed.setTitle(`Now Playing in ${message.guild.name}`) 
            embed.setDescription(`🎵 **[${this.playing[message.guild.id]["song_name"]}](${this.playing[message.guild.id]["song_url"]})**`)
            embed.addField(`Song Duration`, this.playing[message.guild.id]["song_duration"], true)
            embed.addField(`Requested by`, message.client.users.get(this.playing[message.guild.id]["requester"]), true)

            embed.setFooter(`Songs in Queue: ${this.queues[message.guild.id].length}`, `https://kawaaii.moe/images/discord/Anzu/AnzuDJ.png`)
            embed.setThumbnail(`https://kawaaii.moe/images/discord/Anzu/AnzuDJ.png`)
        return await message.channel.send({embed: embed})
    }
    
    async makeQueueEntry(message, url) {
        if (!this.queues[message.guild.id]) {
            await this.getQueue(message);
        };

        await ytdl.getBasicInfo(url)
            .then(async (song) => {
                const queueEntry = await {
                    "requester": message.author.id,
                    "channel": message.channel.id,
                    "song_name": song['title'],
                    "song_url": song['video_url'],
                    "song_duration": utils.prettifyDuration(song['length_seconds'])
                }
                await this.queues[message.guild.id].push(queueEntry);
            })
            .catch((e) => {
                console.log(e)
            })
    };

    async searchSong(query) {
        let song;
        await getInfo(query).then(async (info) => {
            song = await {
                "song_name": info['items'][0]['fulltitle'],
                "song_url": info['items'][0]['webpage_url'],
                "song_duration": utils.prettifyDuration(info['items'][0]['duration'])
            }
        });
        return song;
    }

    async play(message, args) {
        await this.getQueue(message);
        await this.getConnection(message, message.member.voiceChannel)
        await args.shift()
        let argument = await args.join(' ');

        if (this.playing[message.guild.id]) {
            if (!argument) { return; };
            if (!argument.includes('http://') && !argument.includes('https://')) {
                let search_message = await message.channel.send(`⏳ | **Searching...**`);
                try { message.delete(); } catch (e) { };
                this.searchSong(argument).then(async (song) => {
                    search_message.edit(`🎵 | Found a song: **${song.song_name}**, queued it now!`)
                    await this.makeQueueEntry(message, song.song_url);
                    setTimeout(async () => { search_message.delete(); }, parseInt(20000));
                })
            } else {
                await this.makeQueueEntry(message, argument);
                try { message.delete(); } catch (e) { };
            }
        } else {
            if (!argument) { return; };
            if (!argument.includes('http://') && !argument.includes('https://')) {
                let search_message = await message.channel.send(`⏳ | **Searching...**`);
                try { message.delete(); } catch (e) { };
                this.searchSong(argument).then(async (song) => {
                    search_message.edit(`🎵 | Found a song: **${song.song_name}**, playing  it now!`)
                    await this.playMusic(message, song.song_url);
                    setTimeout(async () => { search_message.delete(); }, parseInt(20000));
                })
            } else {
                await this.playMusic(message, argument);
                try { message.delete(); } catch (e) { };
            }
        }
    }

    async playMusic(message, url) {
        let connection = await this.getConnection(message, message.member.voiceChannel)
        const stream = await ytdl(url, { quality: "highestaudio", filter : 'audioonly' });
        const dispatcher = await connection.playStream(stream, music_settings.stream_options);
        await this.addPlaying(message, url);
        this.getPlaying(message);

        dispatcher.on('error', async (err) => {
            return console.log(err)
        })

        dispatcher.on('end', async () => {
            if (this.queues[message.guild.id].length) {
                await this.playMusic(message, this.queues[message.guild.id][0]["song_url"]);
                await this.queues[message.guild.id].splice(0,1);
            } else {
                await message.channel.send(`Music has stopped, disonnecting from **${this.connection[message.guild.id].channel.name}**`)
                await this.stopConnection(message);
            }
        });
    }    

    queuePlaylist(message, playlist, page_token) {

        const url = require('url');
        const url_parts = url.parse(argument, true);
        const query = url_parts.query;
        console.log(query)

        if (query.list) {
            console.log(query.list)
        }

        if (!this.connection[message.guild.id]) {
            this.getConnection(message, message.member.voiceChannel)
        };
        youtube.playlistItems.list({key: config.apis.google_api, part: 'id,snippet', playlistId: playlist, maxResults: 50, pageToken: page_token}, (err, results) => {
            console.log(results);
            results.data.items.forEach((value, i) => {
                this.makeQueueEntry(message, `https://www.youtube.com/watch?v=${value['snippet']['resourceId']['videoId']}`)
            })
            if (results['data']['nextPageToken']) {
                return this.queuePlaylist(message, playlist, results['data']['nextPageToken'])
            }
        });
    };

    static lastQueues() {
        return _lastQueues;
    };
}

module.exports = MusicModule;