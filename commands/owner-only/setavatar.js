const config        = require('../../data/config.json');
const PrefixManager = require('../../prefixManager.js');
const prefix        = PrefixManager.lastManager();

module.exports = {
    name: 'setavatar',
    description: 'Change the Bot\'s avatar.',
    usage: '<filename>',
    args: false,
    guildOnly: true,
    ownerOnly: true,
    //aliases: [''],
    //permissions: 'manage_guild',
    execute(message, args) {

        message.client.user.setAvatar(`./data/images/avatars/${args[0] || 'avatar.png'}`)
            .then(() => message.reply(`my avatar is successfuly updated desu~`))
            .catch(() => message.reply(`something went wrong with updating my avatar, gomenesai Senpai~`))
            
    },
};