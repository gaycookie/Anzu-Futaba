const db      = require("../db.js");
const Discord   = require('discord.js');

module.exports = {
    name: 'balance',
    description: 'Check your current 🍥 or that from others.',
    aliases: ['bal', '🍥', 'currency', 'cur', '$'],
    guildOnly: true,
    execute(message, args) {

        var member = message.mentions.users.first();
        if (!member) {
            var member = message.author;
        }

        var currency_type = '\🍥';

        db.query("SELECT * FROM user_currency WHERE user_id = ?", [`${member.id}`], function(err, result, fields) {
            if (!result[0]) {
                if (member.id === message.author.id) {
                    return message.reply(`you have not earned any ${currency_type} yet, gomenesai desu~`);
                } else {
                    return message.reply(`this user has not earned any ${currency_type} yet, gomenesai desu~`);
                }
            };

            if (member.id === message.author.id) {
                return message.reply(`you have a balance of **${result[0]['user_amount']}** ${currency_type}, desu~`);
            } else {
                return message.reply(`${member.username} has a balance of **${result[0]['user_amount']}** ${currency_type}, desu~`);
            }
            

        })
    },
};