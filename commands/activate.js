const connection = require('../dbPromised.js');
const config     = require('../data/config.json');

async function activate_boost_admin(message, args, member) {

    const [boosts] = await connection.execute("SELECT * FROM boosts WHERE type_name = ?;", [args.join(" ").replace(/[<@!1234567890>]/g, '')]);
    if (!boosts[0]) {
        return await message.reply('this boost doesn\'t exist, are you sure you typed it correctly? Gomenesai Senpai~');
    };

    const [active] = await connection.execute("SELECT * FROM user_boosts WHERE user_id = ? AND boost_type_id = ?;", [member.id, boosts[0].type_id])
    if (active[0]) {
        return await message.reply('this user has this boost active already, you can not activate it. Gomenesai Senpai~');
    };

    await connection.execute(`INSERT INTO user_boosts (boost_type_id, boost_time, user_id) VALUES (?, ?, ?);`, [boosts[0].type_id, boosts[0].type_time, member.id]);
    return await message.reply(`I successfuly activated **${boosts[0].type_name}** for **${member.username}** Senpai desu~`);
}

async function activate_boost(message, args) {

    const [user] = await connection.execute("SELECT * FROM user_currency WHERE user_id = ?;", [message.author.id]);
    if (!user[0]) {
        return await message.reply('you did not earn any Naruto\'s yet, come back later? Gomenesai desu~');
    }

    const [boosts] = await connection.execute("SELECT * FROM boosts WHERE type_name = ?;", [args.join(" ").replace(/[<@!1234567890>]/g, '')]);
    if (!boosts[0]) {
        return await message.reply('this boost doesn\'t exist, are you sure you typed it correctly? Gomenesai desu~');
    }
    
    if (!boosts[0].type_activable) {
        return await message.reply(`this boost can not be activated, for more information \`!boosts ${boosts[0].type_name}\`. Gomenesai desu~`);
    };

    const [active] = await connection.execute("SELECT * FROM user_boosts WHERE user_id = ? AND boost_type_id = ?;", [message.author.id, boosts[0].type_id])
    if (active[0]) {
        return await message.reply('you have this boost already activated senpai, gomenesai desu~');
    };

    if (boosts[0].type_price > 0) {
        const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
        const comfirm = await message.reply(`you're sure you wanna activate the **${boosts[0].type_name}**, this boost will cost you **${boosts[0].type_price} 🍥** and can only be activated **ONCE!**?`)

        let collector = comfirm.createReactionCollector(filter, { time: 20000 });
        collector.on('collect', async (reaction, collector) => {
            await comfirm.delete();
            await connection.execute(`INSERT INTO user_boosts (boost_type_id, boost_time, user_id) VALUES (?, ?, ?);`, [boosts[0].type_id, boosts[0].type_time, message.author.id]);
            await connection.execute("UPDATE user_currency SET user_amount = ? - ? WHERE user_id = ?;", [user[0]['user_amount'], boosts[0].type_price, message.author.id]);
            await message.reply(`you have succesfully activated **${boosts[0].type_name}** and **${boosts[0].type_price} 🍥** has been successfully debited from your account, kawaii desu~`);
        });
        collector.on('end', async collected => {
            if (!collected.size) {
                await comfirm.delete();
                await message.reply(`you were not fast enough, so I canceled the purchase. B-baka!`)
            };
        });
        comfirm.react("✅");
    } else {
        return await message.reply(`enjoy your free **${boosts[0].type_name}**, kawaii desu~`);
    };
}

module.exports = {
    name: 'activate',
    description: 'Boosts command',
    guildOnly: true,
    testMode: true,
    execute(message, args) {

        if (message.mentions.users.size > 0 && config.owners.includes(message.author.id)) {
            activate_boost_admin(message, args, message.mentions.users.first());
        } else {
            activate_boost(message, args);
        };

    }
};