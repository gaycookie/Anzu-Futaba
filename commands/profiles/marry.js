const Discord    = require('discord.js');
const connection = require('../../dbPromised.js');

async function marriage_request(message) {
    member = message.mentions.users.first()
    if (member === message.author) {
        member = null;
    };
    if (!member) {
        return await message.reply('you need to tag someone you wanna marry, b-baka~');
    };

    const [profile] = await connection.execute("SELECT * FROM user_marriages WHERE user_id = ? OR user_married_id = ?;", [message.author.id, message.author.id]);
    const [user] = await connection.execute("SELECT * FROM user_marriages WHERE user_id = ? OR user_married_id = ?;", [member.id, member.id]);

    if (profile[0]) {
        return await message.reply('you\'re married already, b-baka~');
    }
    
    if (user[0]) {
        return await message.reply('this person is already married with someone else, bummer~');
    }
    
    const [proposals_asked] = await connection.execute("SELECT * FROM user_proposals WHERE proposal_asker = ?;", [message.author.id]);
    if (proposals_asked[0]) {
        return await message.reply(`you have already made a proposal to ${message.client.users.get(proposals_asked[0].proposal_receiver).username}, gomenesai desu~`)
    }

    const [proposals_received] = await connection.execute("SELECT * FROM user_proposals WHERE proposal_asker = ? AND proposal_receiver = ?;", [member.id, message.author.id]);
    if (proposals_received[0]) {
        return await message.reply(`you already got a proposal from ${message.client.users.get(proposals_received[0].proposal_asker).username}, accept it!`)
    }

    await connection.execute("INSERT INTO user_proposals (proposal_asker, proposal_receiver) VALUES (?, ?)", [message.author.id, member.id]);
    return await message.channel.send(`💍 **| ${member.username}** do you take **${message.author.username}** to be your lawfully wedded partner? \n[\`!marry accept @mention\` or \`!marry deny @mention\`]`);
}

async function marriage_accept(message) {
    member = message.mentions.users.first()
    if (member === message.author) {
        member = null;
    };
    if (!member) {
        return await message.reply('you need to mention someone, to be able to accept their proposal.');
    };

    const [profile] = await connection.execute("SELECT * FROM user_marriages WHERE user_id = ? OR user_married_id = ?;", [message.author.id, message.author.id]);
    if (profile[0]) {
        return await message.reply('you\'re such a horrible person, youre married already!')
    }

    const [proposals_received] = await connection.execute("SELECT * FROM user_proposals WHERE proposal_asker = ? AND proposal_receiver = ?;", [member.id, message.author.id]);
    if (!proposals_received[0]) {
        return await message.reply('this person did not sent you a proposal, gomenesai desu~');
    } else {
        await connection.execute("INSERT INTO user_marriages (user_id, user_married_id) VALUES (?, ?)", [member.id, message.author.id]);
        await connection.execute(`INSERT INTO user_boosts (boost_type_id, boost_time, user_id) VALUES ('3', '0', ${message.author.id}), ('3', '0', ${member.id});`);
        await connection.execute("DELETE FROM user_proposals WHERE proposal_asker = ? OR proposal_receiver = ?;", [message.author.id, message.author.id]);
        await connection.execute("DELETE FROM user_proposals WHERE proposal_asker = ? OR proposal_receiver = ?;", [member.id, member.id]);
        const embed = {
            "color": 16670894,
            "image": {"url": "https://i.imgur.com/Xrql4wR.gif"},
        };
        return await message.channel.send(`I hereby pronounce **${message.author.username}** and **${member.username}** as married partners, **kawaii desu~** <:kawaii_wave:455229625170264064>`, {embed});
    }
}

async function marriage_deny(message) {
    member = message.mentions.users.first()
    if (member === message.author) {
        member = null;
    };
    if (!member) {
        return await message.reply('you need to mention someone, to be able to deny their proposal.');
    };

    const [profile] = await connection.execute("SELECT * FROM user_marriages WHERE user_id = ? OR user_married_id = ?;", [message.author.id, message.author.id]);
    if (profile[0]) {
        return await message.reply('indeed. Youre already married, no room for someone else.')
    }

    const [proposals_received] = await connection.execute("SELECT * FROM user_proposals WHERE proposal_asker = ? AND proposal_receiver = ?;", [member.id, message.author.id]);
    if (!proposals_received[0]) {
        return await message.reply('this person did not sent you a proposal, gomenesai desu~');
    } else {
        await connection.execute("DELETE FROM user_proposals WHERE proposal_asker = ? AND proposal_receiver = ?;", [member.id, message.author.id]);
        return await message.channel.send(`You successfully denied the proposal of **${member.username}**`);
    }
}

async function marriage_cancel(message) {
    const [profile] = await connection.execute("SELECT * FROM user_marriages WHERE user_id = ? OR user_married_id = ?;", [message.author.id, message.author.id]);
    if (profile[0]) {
        return await message.reply('if you wanna cancel your marriage, use `!marry divorce`')
    }

    const [proposals_asked] = await connection.execute("SELECT * FROM user_proposals WHERE proposal_asker = ?;", [message.author.id]);
    if (!proposals_asked[0]) {
        return await message.reply(`you did not made a proposel towards someone yet, so nothing to cancel~`)
    } else {
        await connection.execute("DELETE FROM user_proposals WHERE proposal_asker = ?;", [message.author.id]);
        return await message.channel.send(`You successfully cancelled your proposal to **${message.client.users.get(proposals_asked[0].proposal_receiver).username}**, gomenesai desu~`);
    }
}

async function marriage_divorce(message) {
    const [profile] = await connection.execute("SELECT * FROM user_marriages WHERE user_id = ? OR user_married_id = ?;", [message.author.id, message.author.id]);
    if (!profile[0]) {
        return await message.reply('you\'re not married to someone yet, gomenesai desu~')
    } else {
        if (profile[0].user_id === message.author.id) {
            other_person = profile[0].user_married_id;
        } else {
            other_person = profile[0].user_id;
        }

        const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
        const comfirm = await message.reply(`you really wanna divorce **${message.client.users.get(other_person).username}**?`)

        let collector = comfirm.createReactionCollector(filter, { time: 20000 });
        collector.on('collect', async (reaction, collector) => {
            await comfirm.delete();
            await connection.execute("DELETE FROM user_marriages WHERE user_id = ? OR user_married_id = ?;", [message.author.id, message.author.id]);
            await connection.execute("DELETE FROM user_boosts WHERE user_id = ? AND boost_type_id = 3 OR user_id = ? AND boost_type_id = 3;", [message.author.id, other_person]);
            await message.reply(`you and **${message.client.users.get(other_person).username}** are now officially divorced!`)
        });
        collector.on('end', async collected => {
            if (!collected.size) {
                await comfirm.delete();
                await message.reply(`you took too long to decide, divorce cancelled!`)
            };
        });
        comfirm.react("✅");
        
    }
}

module.exports = {
    name: 'marry',
    description: 'View with who you\'re married or ask someone to marry!',
    guildOnly: true,
    testMode: true,
    execute(message, args) {

        if (args[0] === 'accept') {
            return marriage_accept(message);
        }

        if (args[0] === 'deny') {
            return marriage_deny(message);
        }

        if (args[0] === 'cancel') {
            return marriage_cancel(message);
        }

        if (args[0] === 'divorce') {
            return marriage_divorce(message);
        }

        return marriage_request(message)

    },
};