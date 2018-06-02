module.exports = {
    name: 'dsay',
    description: 'Make Noëlla repeat what you said, and removes the command.',
    args: true,
    usage: '<message>',
    guildOnly: true,
    execute(message, args) {

        if (!args.length) {
            return message.channel.send(`${message.author}, you didn't provide anything that I can repeat, gomenesai desu~`);
        }

        try {
            message.delete();
            return message.channel.send(`${args.join(" ")}`)
        } catch (error) {
            console.log(error)
            return message.channel.send(`${message.author}, something went wrong, please try again. Gomenesai desu~`)
        }

    },
};