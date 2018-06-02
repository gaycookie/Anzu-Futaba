module.exports = {
    name: 'guildicon',
    description: 'Show the icon of the guild.',
    aliases: ['gicon'],
    guildOnly: true,
    execute(message, args) {
        const embed = {
            "description": `**${message.guild.name}** Guild Icon.\n[Click to open the icon external.](${message.guild.iconURL}?size=2048)`,
            "color": 16670894,
            "image": {"url": `${message.guild.iconURL}?size=2048`}
        };
        message.channel.send({embed});
    },
};