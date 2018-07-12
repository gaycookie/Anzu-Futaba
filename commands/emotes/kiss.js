const weeb_embed = require('../../weebsh.js');

module.exports = {
    name: 'kiss',
    description: 'Kawaii Emotes: Kiss Emote',
    usage: '<@mention>',
    guildOnly: true,
    aliases: ['kisses'],
    execute(message, args) {

        message.guild.fetchMember(message.client.user).then(clientMember => {
            if (!clientMember.permissionsIn(message.channel).has('EMBED_LINKS')) {
                return message.channel.send(`**I'm not allowed to sent Embed's in this channel, gomensai desu~**\n${message.guild.owner}, you b-baka! Fix my permissions! <:kawaiiBaka:437030808696520724>`);
            }

            if (message.mentions.users.has(message.client.user.id)) {
                return message.channel.send(`**B-baka, you can not kiss me, thats illegal!**`)
            }

            if (message.mentions.users.size > 5) {
                return message.channel.send(`**B-baka, more then five members is not allowed due spam, gomenesai~**`)
            }

            var author = message.author
            const users = message.mentions.users.map(user => user);
            const last = users.pop();
            const others = users.join(', ');
            const usersWithCommaAnd = (others ? [others, last].join(' and ') : last) || 'themself';
    
            weeb_embed('kiss', `**${author} kisses ${usersWithCommaAnd}, ohlala~**`, message);

        })
    },
};