const connection = require('../dbPromised.js');
const talkedRecently = new Set();

async function currency_function(message) {
    if (talkedRecently.has(message.author.id))
        return;

    let bonus_amount = 0;
    const [bonus] = await connection.execute("SELECT * FROM user_boosts INNER JOIN boosts ON user_boosts.boost_type_id = boosts.type_id WHERE user_boosts.user_id = ? AND boosts.type_curr_value IS NOT NULL;", [message.author.id]);
    if (bonus) {
        await bonus.forEach(function (value, i) {
            bonus_amount = bonus_amount + value.type_curr_value
        });
    } 

    curr = Math.round(((Math.floor(Math.random() * 5) + 1) / 100) * bonus_amount) + Math.floor(Math.random() * 5) + 1

    const [user] = await connection.execute("SELECT * FROM user_currency WHERE user_id = ?;", [message.author.id]);
    if (!user[0]) {
        await connection.execute("INSERT INTO user_currency (user_id, user_amount, user_daily) VALUES (?, ?, ADDTIME(UTC_TIMESTAMP(), '-240000'));", [message.author.id, curr]);
    } else {
        await connection.execute("UPDATE user_currency SET user_amount = ? + ? WHERE user_id = ?;", [user[0]['user_amount'], curr, message.author.id]);
    }

    talkedRecently.add(message.author.id);
    setTimeout(() => {
        talkedRecently.delete(message.author.id);
    }, 300000);

}
module.exports = currency_function;