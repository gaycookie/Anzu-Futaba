const connection = require('../../dbPromised.js');
const Discord   = require('discord.js');

module.exports = {
    name: 'xp',
    description: 'Check your current Level and earned Experience. (global)',
    aliases: ['experience', 'level', 'lvl', 'exp', 'points'],
    guildOnly: true,
    execute(message, args) {

        async function xp(message) {
            var member = message.mentions.users.first();
            if (!member) {
                var member = message.author;
            }

            const [profile] = await connection.execute("SELECT * FROM user_experience WHERE user_id = ?;", [member.id]);
                if (!profile[0]) {
                    if (member.id === message.author.id) {
                        return await message.reply('you have not earned any experience yet, gomenesai desu~');
                    } else {
                        return await message.reply('this user has not earned any experience yet, gomenesai desu~');
                    }
                };

            const EXPEmbed = new Discord.RichEmbed()
                .setColor(16670894)
                .setAuthor(`${member.username}#${member.discriminator}`, member.avatarURL)
                .addField('Earned Levels', profile[0]['user_lvl'], true)
                .addField('Earned EXP', profile[0]['user_exp'], true)
                .addField('Next Level Up', `${Math.floor(Math.pow((profile[0]['user_lvl'] + 1) / 0.2, 2) - 1) - profile[0]['user_exp'] + 1} EXP remaining`, true)
                .setFooter('You earn 15-20exp per 5 minutes.')

            await message.channel.send({ embed: EXPEmbed });
        }

        xp(message);
    },
};