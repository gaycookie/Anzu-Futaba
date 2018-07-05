const db      = require("../db.js");
const Discord   = require('discord.js');

module.exports = {
    name: 'xp',
    description: 'Check your current Level and earned Experience. (global)',
    aliases: ['experience', 'level', 'lvl', 'exp', 'points'],
    guildOnly: true,
    execute(message, args) {

        var member = message.mentions.users.first();
        if (!member) {
            var member = message.author;
        }

        db.query("SELECT * FROM user_experience WHERE user_id = ?", [`${member.id}`], function(err, result, fields) {
            if (!result[0]) {
                if (member.id === message.author.id) {
                    return message.reply('you have not earned any experience yet, gomenesai desu~');
                } else {
                    return message.reply('this user has not earned any experience yet, gomenesai desu~');
                }
            };

            const EXPEmbed = new Discord.RichEmbed()
                .setColor(16670894)
                .setAuthor(`${member.username}#${member.discriminator}`, member.avatarURL)
                .addField('Earned Levels', result[0]['user_lvl'], true)
                .addField('Earned EXP', result[0]['user_exp'], true)
                .addField('Next Level Up', `${Math.floor(Math.pow((result[0]['user_lvl'] + 1) / 0.2, 2) - 1) - result[0]['user_exp'] + 1} EXP remaining`, true)
                .setFooter('You earn 15-20exp per 5 minutes.')

            message.channel.send({ embed: EXPEmbed });

        })
    },
};