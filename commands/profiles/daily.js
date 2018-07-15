const connection    = require('../../dbPromised.js');
const config        = require('../../data/config.json');

module.exports = {
    name: 'daily',
    description: 'daily',
    guildOnly: true,
    execute(message, args) {

        async function daily(message) {
            const [dailies] = await connection.execute("SELECT * FROM user_dailies WHERE user_id = ?;", [message.author.id]);
            if (dailies[0]) {
                return await message.reply(`you already claimed your daily for today, gomenesai desu~`);
            }

            await connection.execute("INSERT INTO user_dailies (user_id) VALUES (?);", [message.author.id]);
            await connection.execute("UPDATE user_currency SET user_amount = user_amount + ? WHERE user_id = ?;", [config.daily_amount, message.author.id]);
            return await message.reply(`you successfully claimed your **${config.daily_amount} daily ${config.currency_icon}**, for today!`)
        }

        daily(message);

    },
};