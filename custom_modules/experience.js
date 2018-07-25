const connection     = require('../dbPromised.js');
const Discord        = require('discord.js');
const talkedRecently = new Set();
const Canvas         = require('canvas');
const snekfetch      = require('snekfetch');
const freude         = Canvas.registerFont('./data/images/resources/fonts/freude.otf', {family: 'freude'});

async function level_up_image(message, currentLevel) {

    const canvas = Canvas.createCanvas(89, 110);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('./data/images/resources/levelup-v1/base.png');
    const overlay = await Canvas.loadImage('./data/images/resources/levelup-v1/levelup.png');

    const {body: buffer1} = await snekfetch.get(message.author.displayAvatarURL);
    const avatar = await Canvas.loadImage(buffer1);
    
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(avatar, 15, 12, 58, 58);
    ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);

    ctx.font = '18px freude';
    ctx.fillStyle = '#ef9ab7';
    ctx.fillText(`level ${currentLevel}`, 12, 102.5);

    const attachment = new Discord.Attachment(canvas.toBuffer(), 'level-up.png');
    try {
        await message.reply(`<:kawaii_wave:455229625170264064> | **${message.author.username} leveled up!**`, attachment);
    } catch {
        return;
    }

}

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
            level_up_image(message, currentLevel);
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