module.exports = {
    name: 'test',
    description: 'test',
    //args: true,
    guildOnly: true,
    //guildOwnerOnly: true,
    permissions: 'manage_guild',
    //disabled: true,
    //ownerOnly: true,
    execute(message, args) {

        member = message.mentions.users.first()
        if (!member) {
            member = message.author;
        }

        message.channel.send(`${member.lastMessage}`)

    },
};