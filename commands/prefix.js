const config        = require('../data/config.json');
const PrefixManager = require('../prefixManager.js');
const prefix        = PrefixManager.lastManager();

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
                    return message.reply(`the prefix for **${message.guild.name}** is \`${prefix.get(message)}\`\nTo edit the prefix for this guild, simply use \`${prefix.get(message)}setprefix <prefix>\``)    
                }
                return message.reply(`the prefix for **${message.guild.name}** is \`${prefix.get(message)}\``)
        })}
    },
};