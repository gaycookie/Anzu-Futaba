const GuildSettings = require('../../guildSettings.js');
const settings      = new GuildSettings();

module.exports = {
    name: 'prefix',
    description: 'Check the current guild prefix.',
    args: false,
    guildOnly: true,
    //usage: null,
    aliases: ['prefix'],
    //permissions: 'manage_guild',
    execute(message, args) {

        if (message.guild) {
            message.guild.fetchMember(message.author).then(guildMember => {
                if (guildMember.permissions.has("MANAGE_GUILD")) {
                    return message.reply(`the prefix for **${message.guild.name}** is \`${settings.get(message, 'prefix')}\`\nTo edit the prefix for this guild, simply use \`${settings.get(message, 'prefix')}setprefix <prefix>\``)    
                }
                return message.reply(`the prefix for **${message.guild.name}** is \`${settings.get(message, 'prefix')}\``)
        })}
    },
};