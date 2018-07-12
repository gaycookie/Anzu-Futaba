const connection    = require('../../dbPromised.js');
const Discord       = require('discord.js');
const config        = require('../../data/config.json');

module.exports = {
    name: 'rep',
    description: 'reputation',
    guildOnly: true,
    testMode: true,
    execute(message, args) {

        async function rep(message) {

            const [rep_given] = await connection.execute("SELECT * FROM reputations WHERE user_id = ?;", [message.author.id]);
            if (rep_given[0]) { return await message.reply(`you already gave someone reputation today, gomenesay desu~`); }

            if (!message.mentions.users.first()) {
                return await message.reply(`you can give someone reputation today, yaay <:kawaii_wave:455229625170264064>`)
            }

            if (message.mentions.users.first() === message.author) {
                return await message.reply(`you can not give yourself reputation points, b-baka!`)
            }

            let member = message.mentions.users.first();
            await connection.execute("INSERT INTO reputations (user_id) VALUES (?);", [message.author.id]);
            await connection.execute("INSERT INTO user_reputations (user_id, by_user_id) VALUES (?, ?);", [member.id, message.author.id]);
            return await message.channel.send(`**${member}-san, you received an reputation point from ${message.author}**, yaayy <:kawaii_wave:455229625170264064>`);

        }

        rep(message);

    },
};