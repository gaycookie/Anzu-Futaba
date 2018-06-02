module.exports = {
    name: 'say',
    description: 'Make Noëlla repeat what you said.',
    args: true,
    usage: '<message>',
    guildOnly: true,
    execute(message, args) {

        if (!args.length) {
            return message.channel.send(`${message.author}, you didn't provide anything that I can repeat, gomenesai desu~`);
        }

        try {
            return message.channel.send(`${args.join(" ")}`)
        } catch (error) {
            console.log(error)
            return message.channel.send(`${message.author}, something went wrong, please try again. Gomenesai desu~`)
        }

    },
};