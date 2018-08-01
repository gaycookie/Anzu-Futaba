const Discord    = require('discord.js');
const connection = require('../../dbPromised.js');
const lookup     = ['💟', '2⃣', '3⃣', '4⃣', '5⃣'];

async function show_guild_stats(message) {

    const guild = message.guild;
    const [counts] = await connection.execute("SELECT COUNT(*) as count, MIN(used) FROM commands WHERE guild_id = ?;", [guild.id]);
    if (!counts[0].count) return message.channel.send(`${message.author}, this guild has not seen the power of ${message.client.user} yet, gomenesai desu~`);

    const [total5] = await connection.execute("SELECT command, COUNT(*) as count FROM commands WHERE guild_id = ? GROUP BY command ORDER BY count DESC LIMIT 5;", [guild.id]);
    let top5_total = [];
    await total5.forEach(function (value, i) {
        top5_total.push(`${lookup[i]}: ${value.command} (${value.count} uses)`)
    });

    const [monthly5] = await connection.execute("SELECT command, COUNT(*) as count FROM commands WHERE guild_id = ? AND used > (CURRENT_TIMESTAMP - INTERVAL 1 MONTH) GROUP BY command ORDER BY count DESC LIMIT 5;", [guild.id]);
    let top5_monthly = [];
    await monthly5.forEach(function (value, i) {
        top5_monthly.push(`${lookup[i]}: ${value.command} (${value.count} uses)`)
    });

    const [weekly5] = await connection.execute("SELECT command, COUNT(*) as count FROM commands WHERE guild_id = ? AND used > (CURRENT_TIMESTAMP - INTERVAL 1 WEEK) GROUP BY command ORDER BY count DESC LIMIT 5;", [guild.id]);
    let top5_weekly = [];
    await weekly5.forEach(function (value, i) {
        top5_weekly.push(`${lookup[i]}: ${value.command} (${value.count} uses)`)
    });

    const [daily5] = await connection.execute("SELECT command, COUNT(*) as count FROM commands WHERE guild_id = ? AND used > (CURRENT_TIMESTAMP - INTERVAL 1 DAY) GROUP BY command ORDER BY count DESC LIMIT 5;", [guild.id]);
    let top5_daily = [];
    await daily5.forEach(function (value, i) {
        top5_daily.push(`${lookup[i]}: ${value.command} (${value.count} uses)`)
    });

    const [users5] = await connection.execute("SELECT author_id, COUNT(*) AS count FROM commands WHERE guild_id = ? GROUP BY author_id ORDER BY count DESC LIMIT 5;", [guild.id]);
    let top5_users = [];
    await users5.forEach(function (value, i) {
        user = message.client.users.get(value.author_id) || `<Unknown ${value.author_id}>`;
        top5_users.push(`${lookup[i]}: ${user} (${value.count} uses)`)
    });

    const exampleEmbed = new Discord.RichEmbed()
        .setColor(16670894)
        .setTitle('Guild Command Stats')
        .setAuthor(guild.name, guild.iconURL)
        .setThumbnail(guild.iconURL)
        .setDescription(`${counts[0].count} commands used.\n`)
        .addField('Most Used Commands', top5_total.join('\n'), true)
        .addField('Most Used This Month', top5_monthly.join('\n'), true)
        .addField('Most Used This Week', top5_weekly.join('\n'), true)
        .addField('Most Used Today', top5_daily.join('\n'), true)
        .addField('Top Users in Total', top5_users.join('\n'), false)
    await message.channel.send({ embed: exampleEmbed });
}

async function show_user_stats(message) {

    user = message.mentions.users.first()
    if (!user) {
        user = message.author
    };
    const [counts] = await connection.execute("SELECT COUNT(*) as count FROM commands WHERE author_id = ?;", [user.id]);
    if (!counts[0].count) return message.channel.send(`${message.author}, this user has not used any command yet, gomenesai desu~`);
    
    const [total5] = await connection.execute("SELECT command, COUNT(*) as count FROM commands WHERE author_id = ? GROUP BY command ORDER BY count DESC LIMIT 5;", [user.id]);
    let top5_total = [];
    if (total5[0]) {
        await total5.forEach(function (value, i) {
            top5_total.push(`${lookup[i]}: ${value.command} (${value.count} uses)`)
        })
    } else {
        top5_total.push('None')
    };

    const [monthly5] = await connection.execute("SELECT command, COUNT(*) as count FROM commands WHERE author_id = ? AND used > (CURRENT_TIMESTAMP - INTERVAL 1 MONTH) GROUP BY command ORDER BY count DESC LIMIT 5;", [user.id]);
    let top5_monthly = [];
    if (monthly5[0]) {
        await monthly5.forEach(function (value, i) {
            top5_monthly.push(`${lookup[i]}: ${value.command} (${value.count} uses)`)
        })
    } else {
        top5_monthly.push('None')
    };

    const [weekly5] = await connection.execute("SELECT command, COUNT(*) as count FROM commands WHERE author_id = ? AND used > (CURRENT_TIMESTAMP - INTERVAL 1 WEEK) GROUP BY command ORDER BY count DESC LIMIT 5;", [user.id]);
    let top5_weekly = [];
    if (weekly5[0]) {
        await weekly5.forEach(function (value, i) {
            top5_weekly.push(`${lookup[i]}: ${value.command} (${value.count} uses)`)
        })
    } else {
        top5_weekly.push('None')
    };

    const [daily5] = await connection.execute("SELECT command, COUNT(*) as count FROM commands WHERE author_id = ? AND used > (CURRENT_TIMESTAMP - INTERVAL 1 DAY) GROUP BY command ORDER BY count DESC LIMIT 5;", [user.id]);
    let top5_daily = [];
    if (daily5[0]) {
        await daily5.forEach(function (value, i) {
            top5_daily.push(`${lookup[i]}: ${value.command} (${value.count} uses)`)
        })
    } else {
        top5_daily.push('None')
    };

    const exampleEmbed = new Discord.RichEmbed()
        .setColor(16670894)
        .setTitle('Global User Command Stats')
        .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL)
        .setThumbnail(user.avatarURL)
        .setDescription(`${counts[0].count} commands used.\n`)
        .addField('Most Used Commands', top5_total.join('\n'), true)
        .addField('Most Used This Month', top5_monthly.join('\n'), true)
        .addField('Most Used This Week', top5_weekly.join('\n'), true)
        .addField('Most Used Today', top5_daily.join('\n'), true)
    await message.channel.send({ embed: exampleEmbed });
}

async function show_global_stats(message) {

    const [counts] = await connection.execute("SELECT COUNT(*) as count FROM commands;");

    const [total5] = await connection.execute("SELECT command, COUNT(*) as count FROM commands GROUP BY command ORDER BY count DESC LIMIT 5;");
    let top5_total = [];
    await total5.forEach(function (value, i) {
        top5_total.push(`${lookup[i]}: ${value.command} (${value.count} uses)`)
    });

    const [monthly5] = await connection.execute("SELECT command, COUNT(*) as count FROM commands WHERE used > (CURRENT_TIMESTAMP - INTERVAL 1 MONTH) GROUP BY command ORDER BY count DESC LIMIT 5");
    let top5_monthly = [];
    await monthly5.forEach(function (value, i) {
        top5_monthly.push(`${lookup[i]}: ${value.command} (${value.count} uses)`)
    });

    const [weekly5] = await connection.execute("SELECT command, COUNT(*) as count FROM commands WHERE used > (CURRENT_TIMESTAMP - INTERVAL 1 WEEK) GROUP BY command ORDER BY count DESC LIMIT 5");
    let top5_weekly = [];
    await weekly5.forEach(function (value, i) {
        top5_weekly.push(`${lookup[i]}: ${value.command} (${value.count} uses)`)
    });

    const [guilds5] = await connection.execute("SELECT guild_id, COUNT(*) AS count FROM commands GROUP BY guild_id ORDER BY count DESC LIMIT 5;");
    let top5_guilds = [];
    await guilds5.forEach(function (value, i) {
        if (!value.guild_id) {
            guild = 'Private Message'
        } else {
            guild = message.client.guilds.get(value.guild_id) || `<Unknown ${value.guild_id}>`
        }
        top5_guilds.push(`${lookup[i]}: ${guild} (${value.count} uses)`)
    });

    const [users5] = await connection.execute("SELECT author_id, COUNT(*) AS count FROM commands GROUP BY author_id ORDER BY count DESC LIMIT 5;");
    let top5_users = [];
    await users5.forEach(function (value, i) {
        user = message.client.users.get(value.author_id) || `<Unknown ${value.author_id}>`;
        top5_users.push(`${lookup[i]}: ${user} (${value.count} uses)`)
    });

    const exampleEmbed = new Discord.RichEmbed()
        .setColor(16670894)
        .setTitle('Global Command Stats')
        .setDescription(`${counts[0].count} commands used.\n`)
        .addField('Most Used Commands', top5_total.join('\n'), true)
        .addField('Most Used This Month', top5_monthly.join('\n'), true)
        .addField('Most Used This Week', top5_weekly.join('\n'), true)
        .addField('Top Guilds in Total', top5_guilds.join('\n'), false)
        .addField('Top Users in Total', top5_users.join('\n'), false)
    await message.channel.send({ embed: exampleEmbed });
}

module.exports = {
    name: 'stats',
    description: 'View command statistics, per guild or global.',
    guildOnly: true,
    testMode: true,
    execute(message, args) {

        if (args[0] === 'global') {
            return show_global_stats(message);
        } 
        if (args[0] === 'guild') {
            return show_guild_stats(message);
        } 
        
        return show_user_stats(message)

    },
};