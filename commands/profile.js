const Discord        = require('discord.js');
const connection     = require('../dbPromised.js');

async function profile(message) {
    member = message.mentions.users.first()
    if (!member) {
        member = message.author
    };

    let married_with;
    let commands_used;
    let experience_total;
    let user_level;
    let active_boosts_list;

    const [experience] = await connection.execute("SELECT * FROM user_experience WHERE user_id = ?;", [member.id]);
    if (!experience[0]) {
        experience_total = 'None yet';
        user_level = 0;
    } else {
        experience_total = `${experience[0]['user_exp'] + 1 - Math.floor(Math.pow((experience[0]['user_lvl'] + 0) / 0.2, 2) + 1)} / ${Math.floor(Math.pow((experience[0]['user_lvl'] + 1) / 0.2, 2)) - Math.pow((experience[0]['user_lvl'] + 0) / 0.2, 2)}`
        user_level = experience[0].user_lvl;
    }

    const [currency] = await connection.execute("SELECT * FROM user_currency WHERE user_id = ?;", [member.id]);
    if (!currency[0]) {
        currency_total = 'None yet'
    } else {
        currency_total = `${currency[0].user_amount} Naruto's`
    }

    const [counts] = await connection.execute("SELECT command, COUNT(*) as count FROM commands WHERE author_id = ? GROUP BY command ORDER BY count DESC LIMIT 1;", [member.id]);
    if (!counts[0]) {
        commands_used = 'None yet'
    } else {
        commands_used = `${counts[0].command} (${counts[0].count} uses)`;
    }

    const [profile] = await connection.execute("SELECT * FROM user_marriages WHERE user_id = ? OR user_married_id = ?;", [member.id, member.id]);
    if (!profile[0]) {
        married_with = 'Nobody yet'
    } else {
        if (profile[0].user_id === member.id) {
            married_with = message.client.users.get(profile[0].user_married_id) || message.client.users.get(profile[0].user_married_id).username;
        } 
        if (profile[0].user_married_id === member.id) {
            married_with = message.client.users.get(profile[0].user_id) || message.client.users.get(profile[0].user_id).username;
        }
    }

    const [boosts] = await connection.execute("SELECT * FROM user_boosts INNER JOIN boosts ON user_boosts.boost_type_id=boosts.type_id WHERE user_boosts.user_id = ? ORDER BY user_boosts.boost_activated DESC;", [member.id]);
    let time;
    let active_boosts = [];
    let total_xp_boost = 0;
    let total_currency_boost = 0;
    if (boosts[0]) {
        await boosts.forEach(function (value, i) {

            if (value.type_xp_value) total_xp_boost = total_xp_boost + value.type_xp_value;
            if (value.type_curr_value) total_currency_boost = total_currency_boost = value.type_curr_value;

            if (!parseInt(value.type_time) == 0) time = ` for ${value.type_time / 60000} minutes`; 
            else time = ""; 

            if (value.type_xp_value && !value.type_curr_value) {
                active_boosts.push(`- **${value.type_name}** (+${value.type_xp_value}% XP${time})`);
            }
            if (!value.type_xp_value && value.type_curr_value) {
                active_boosts.push(`- **${value.type_name}** (+${value.type_curr_value}% Naruto's${time})`);
            }
            if (value.type_xp_value && value.type_curr_value) {
                active_boosts.push(`- **${value.type_name}** (+${value.type_xp_value}% XP & +${value.type_curr_value}% Naruto's${time})`);
            }
            
        });
        active_boosts_list = active_boosts.join("\n");
    } else {
        active_boosts_list = '**No Boost active.**\n*Boost can be obtained through the naruto shop or by participating in special global events!*';
    }

    const exampleEmbed = new Discord.RichEmbed()
        .setColor(16670894)
        .setAuthor(`${member.username}#${member.discriminator} | (level: ${user_level})`, member.avatarURL)
        .setThumbnail(member.avatarURL)
        .addField(`📈 | Experience (+${total_xp_boost}%): `, experience_total, true)
        .addField(`🍥 | Currency: (+${total_currency_boost}%)`, currency_total, true)
        .addField('📟 | Most Used Command: ', commands_used, true)
        .addField('💍 | Married with: ', married_with, false)
        .addField(`🍼 | Active Boosts: `, active_boosts_list, false)
    return await message.channel.send({ embed: exampleEmbed });
}

module.exports = {
    name: 'profile',
    description: 'Check out your profile or that from someone else.',
    guildOnly: true,
    testMode: true,
    execute(message, args) {

        return profile(message)

    },
};