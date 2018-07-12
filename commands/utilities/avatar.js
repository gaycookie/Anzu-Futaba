module.exports = {
    name: 'avatar',
    description: 'Show the avatar of yourself or a tagged member.',
    usage: '[@mention]',
    aliases: ['pfp'],
    guildOnly: true,
    execute(message, args) {
        var member = message.mentions.users.first();
        if (!member) {
            var member = message.author;
        }

        const embed = {
            "description": `**${member}**'s Avatar.\n[Click to open the avatar external.](${member.displayAvatarURL})`,
            "color": 16670894,
            "image": {"url": `${member.displayAvatarURL}`}
        };
        message.channel.send({embed});
    },
};