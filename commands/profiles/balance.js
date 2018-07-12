const connection = require('../../dbPromised.js');
const Discord   = require('discord.js');

module.exports = {
    name: 'balance',
    description: 'Check your current 🍥 or that from others.',
    aliases: ['bal', '🍥', 'currency', 'cur', '$'],
    guildOnly: true,
    execute(message, args) {

        async function curr(message) {
            var member = message.mentions.users.first();
            if (!member) {
                var member = message.author;
            }

            var currency_type = '\🍥';

            const [profile] = await connection.execute("SELECT * FROM user_currency WHERE user_id = ?;", [member.id]);
            if (!profile[0]) {
                if (member.id === message.author.id) {
                    return await message.reply(`you have not earned any ${currency_type} yet, gomenesai desu~`);
                } else {
                    return await message.reply(`this user has not earned any ${currency_type} yet, gomenesai desu~`);
                }
            };

            if (member.id === message.author.id) {
                return await message.reply(`you have a balance of **${profile[0].user_amount}** ${currency_type}, desu~`);
            } else {
                return await message.reply(`${member.username} has a balance of **${profile[0].user_amount}** ${currency_type}, desu~`);
            }
        }

        curr(message);
    },
};