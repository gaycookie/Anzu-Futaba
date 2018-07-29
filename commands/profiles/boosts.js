const connection = require('../../dbPromised.js');

module.exports = {
    name: 'boosts',
    description: 'Boosts command',
    guildOnly: true,
    testMode: true,
    execute(message, args) {

        async function get_boosts(message, args) {
            const [boosts] = await connection.execute(`SELECT * FROM boosts WHERE type_name LIKE ?;`, [`%${args.join(" ")}%`]);
            if (boosts[0]) {
    
                let boost_columns = [];
                boost_columns.push({
                    name: '⏱ | Boost Duration',
                    value: `${Math.floor(boosts[0].type_time / 60000)} minutes`,
                    inline: true
                });

                if (boosts[0].type_xp_value && !boosts[0].type_curr_value) {
                    boost_text = `+${boosts[0].type_xp_value}% XP`;
                }
                if (!boosts[0].type_xp_value && boosts[0].type_curr_value) {
                    boost_text = `+${boosts[0].type_curr_value}% Naruto's`;
                }
                if (boosts[0].type_xp_value && boosts[0].type_curr_value) {
                    boost_text = `+${boosts[0].type_xp_value}% XP & +${boosts[0].type_curr_value}% Naruto's`;
                }

                boost_columns.push({
                    name: '🍼 | Boost Effect',
                    value: boost_text,
                    inline: true
                });
                boost_columns.push({
                    name: '🍥 | Boost Price',
                    value: `${boosts[0].type_price} Naruto's`,
                    inline: true
                });
                if (boosts[0].type_activable) {
                    boost_columns.push({
                        name: '🔓 | Activate Boost',
                        value: `**!activate ${boosts[0].type_name}**`,
                        inline: true
                    });
                }

                const embed = {
                    'color': 16670894,
                    'title': boosts[0].type_name,
                    'description': boosts[0].type_description,
                    'thumbnail': {
                        'url': boosts[0].type_image,
                    },
                    'fields': boost_columns
                };
                return message.channel.send({embed});
            };
        };

        get_boosts(message, args);

    },
};