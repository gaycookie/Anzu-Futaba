const connection = require('../dbPromised.js');
const talkedRecently = new Set();

async function async_experience_function(message) {
    if (talkedRecently.has(message.author.id)) return;

    const [user] = await connection.execute("SELECT * FROM user_experience WHERE user_id = ?;", [message.author.id]);
    if (!user[0]) {
        await connection.execute("INSERT INTO user_experience (user_id, user_exp, user_lvl) VALUES (?, ?, ?);", [message.author.id, Math.floor(Math.random() * 5) + 1, 0]);
    } else {

        let bonus_amount = 0;
        const [bonus] = await connection.execute("SELECT * FROM user_boosts INNER JOIN boosts ON user_boosts.boost_type_id = boosts.type_id WHERE user_boosts.user_id = ? AND boosts.type_xp_value IS NOT NULL;", [message.author.id]);
        if (bonus) {
            await bonus.forEach(function (value, i) {
                bonus_amount = bonus_amount + value.type_xp_value
            });
        } 

        exp = await Math.floor(Math.random() * 5) + 15 + Math.round(((Math.floor(Math.random() * 5) + 15) / 100) * bonus_amount);

        let currentLevel = Math.floor(0.2 * Math.sqrt(user[0]['user_exp'] + 1));
        if (currentLevel > user[0]['user_lvl']) {
            await connection.execute("UPDATE user_experience SET user_exp = ? + ?, user_lvl = ? WHERE user_id = ?;", [user[0]['user_exp'], exp, currentLevel, message.author.id]);
            await message.reply(`You've leveled up to level **${currentLevel}**, yayy! <:kawaii_wave:455229625170264064>`);
        } else {
            await connection.execute("UPDATE user_experience SET user_exp = ? + ? WHERE user_id = ?;", [user[0]['user_exp'], exp, message.author.id]);
        }
    }

    talkedRecently.add(message.author.id);
    setTimeout(() => {
        talkedRecently.delete(message.author.id);
    }, 300000);
}

module.exports = async_experience_function;