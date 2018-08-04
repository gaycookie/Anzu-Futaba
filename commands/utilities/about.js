const Discord           = require('discord.js');
const connection        = require('../../dbPromised.js');
const config            = require('../../data/config.json');
const process           = require('process')

async function show_about(message) {

    developer   = message.client.users.get(config.owners[0]);
    client      = message.client;
    bot         = client.user;
    
    // Functions to get all members/users //

    async function get_all_members_count() {
        let unique_members = 0;
        client.users.forEach(async user => {
            if (user.bot == false){
                unique_members++;
            }
        });
        return unique_members;
    }

    function get_all_members_online_count() {
        let unique_members_online = 0;
        client.guilds.forEach(async guild => {
            guild.members.forEach(async member => {
                if (member.presence.status != 'offline'){
                    unique_members_online++;
                }
            });
        });
        return unique_members_online;
    }

    function get_all_bots_count() {
        let unique_bots = 0;
        client.users.forEach(async user => {
            if (user.bot == true){
                unique_bots++;
            }
        });
        return unique_bots;
    }

    // Functions to get all channels //

    function get_all_categories() {
        let categories = 0;
        client.guilds.forEach(async guild => {
            guild.channels.forEach(async channel => {
                if (channel.type == 'category'){
                    categories++;
                }
            });
        });
        return categories;
    }

    function get_all_text_channels() {
        let text = 0;
        client.guilds.forEach(async guild => {
            guild.channels.forEach(async channel => {
                if (channel.type == 'text'){
                    text++;
                }
            });
        });
        return text;
    }

    function get_all_voice_channels() {
        let voice = 0;
        client.guilds.forEach(async guild => {
            guild.channels.forEach(async channel => {
                if (channel.type == 'voice'){
                    voice++;
                }
            });
        });
        return voice;
    }

    const [most_used] = await connection.execute("SELECT command, COUNT(*) as 'uses' FROM commands GROUP BY command ORDER BY COUNT(*) DESC LIMIT 1");
    const [total_used] = await connection.execute("SELECT COUNT(*) as 'uses' FROM commands;")

    total_members = `Total Unqiue: **${await get_all_members_count()}**\nTotal Online: **${await get_all_members_online_count()}**\nTotal Bots: **${await get_all_bots_count()}**`;
    total_channels = `Total Categories: **${await get_all_categories()}**\nTotal Text-channels: **${await get_all_text_channels()}**\nTotal Voice-channels: **${await get_all_voice_channels()}**`;
    commands_stats = `Total Uses: **${total_used[0]['uses']}**\nMost Used: **${most_used[0]['command']}**`
    global_information = `Node.js version: **${process.version}**\ndiscord.js version: **v${Discord.version}**`

    const exampleEmbed = new Discord.RichEmbed()
        .setColor(16670894)
        .setTitle(`Official ${bot.username} Support Server Invite`)
        .setAuthor(`${developer.username}#${developer.discriminator}`, developer.avatarURL)
        .setThumbnail(bot.avatarURL)
        .setURL(config.discord_invite)
        .addField('Members in all guilds', total_members, true)
        .addField('Channels in all guilds', total_channels, true)
        .addField('Global command stats', commands_stats, true)
        .addField('Global Information', global_information, true)
    await message.channel.send({ embed: exampleEmbed });
}

module.exports = {
    name: 'about',
    description: 'View all information about Anzu.',
    guildOnly: true,
    testMode: true,
    execute(message, args) {
        
        return show_about(message)

    },
};