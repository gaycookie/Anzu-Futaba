const config        = require('../../data/config.json');
const PrefixManager = require('../../prefixManager.js');
const prefix        = PrefixManager.lastManager();

module.exports = {
    name: 'setusername',
    description: 'Change the Bot\'s username.',
    usage: '<username>',
    args: true,
    guildOnly: true,
    ownerOnly: true,
    //aliases: [''],
    //permissions: 'manage_guild',
    execute(message, args) {

        message.client.user.setUsername(`${args.join(' ')}`)
            .then(() => message.reply(`my username is successfuly updated desu~`))
            .catch(() => message.reply(`something went wrong with updating my username, gomenesai Senpai~`))
            
    },
};