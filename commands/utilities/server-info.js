const Discord           = require('discord.js');
const connection        = require('../../dbPromised.js');
const config            = require('../../data/config.json');
const process           = require('process')

async function show_guild(message) {

    client = message.client;
    guild  = message.guild;
    bot    = client.user;

    function get_online_members() {
        let counter = 0;
        guild.members.forEach(async GuildMember => {
            if (GuildMember.presence.status != 'offline'){
                counter++;
            }
        });
        return counter;
    }

    function get_text_channels() {
        let counter = 0;
        guild.channels.forEach(async GuildChannel => {
            if (GuildChannel.type == 'text'){
                counter++;
            }
        });
        return counter;
    }

    function get_voice_channels() {
        let counter = 0;
        guild.channels.forEach(async GuildChannel => {
            if (GuildChannel.type == 'voice'){
                counter++;
            }
        });
        return counter;
    }

    function verification_level() {
        let verification;
        if (guild.verificationLevel == 0) {verification = `Protection: **None**\n*Unrestricted*`}
        if (guild.verificationLevel == 1) {verification = `Protection: **Low**\n*Verified Email*`}
        if (guild.verificationLevel == 2) {verification = `Protection: **Medium**\n*Registered for 5 minutes*`}
        if (guild.verificationLevel == 3) {verification = `Protection: **High**\n*Member for 10 minutes*`}
        if (guild.verificationLevel == 4) {verification = `Protection: **Super High**\n*Verified Phone Number*`}
        return verification;
    }

    const exampleEmbed = new Discord.RichEmbed()
        .setColor(16670894)
        .setAuthor(`Discord Guild Information`, guild.iconURL)
        .setThumbnail(guild.iconURL)
        .addField('Guild Name/ID', `**${guild.name}**\n${guild.id}`, true)
        .addField('Guild Owner', `**${guild.owner.user.username}**\n${guild.owner.user.id}`, true)
        .addField('Guild Members', `Total Members: **${guild.members.size}**\nTotal Online: **${get_online_members()}**`, true)
        .addField('Guild Channels', `Text-channels: **${get_text_channels()}**\nVoice-channels: **${get_voice_channels()}**`, true)
        .addField('Verification Level', verification_level(), true)
        .addField('AFK Channel', `Channel: **${guild.afkChannel ? guild.afkChannel.name : 'None'}**\nAFK Time: **${guild.afkTimeout / 60} minutes**`, true)
        .addField('Guild Region', guild.region, true)
        .addField('Guild Roles', guild.roles.size, true)
        .setFooter(`Server Created: ${(new Date(guild.createdTimestamp)).toUTCString()}`, guild.iconURL)
    await message.channel.send({ embed: exampleEmbed });
}

module.exports = {
    name: 'guild',
    description: 'Show all guild related information in one single embed!',
    guildOnly: true,
    aliases: ['server', 'server-info', 'si', 'guild-info', 'gi'],
    execute(message, args) {
        
        return show_guild(message)

    },
};