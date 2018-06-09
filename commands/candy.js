module.exports = {
    name: 'candy',
    description: 'Eat, give or steal candies! Yummie',
    //args: true,
    guildOnly: true,
    execute(message, args) {

        if (args[0] === 'eat') {
            args.shift();
            return message.channel.send(`*${message.author} nomnoms a piece of candy*`);
        }

        if (args[0] === 'steal') {
            args.shift();
            const users = message.mentions.users.map(user => user);
            const last = users.pop();
            const others = users.join(', ');
            const usersWithCommaAnd = (others ? [others, last].join(' and ') : last) || `${message.client.user}`;
            return message.channel.send(`*${message.author} steals a piece of candy from ${usersWithCommaAnd}*`);
        }

        if (args[0] === 'give') {
            args.shift();
            const users = message.mentions.users.map(user => user);
            const last = users.pop();
            const others = users.join(', ');
            const usersWithCommaAnd = (others ? [others, last].join(' and ') : last) || `${message.client.user}`;
            return message.channel.send(`*${message.author} gives a piece of candy to ${usersWithCommaAnd}*`);
        }

        return message.channel.send(`${message.author}, you need to use the following options: \`eat\`, \`give\` or \`steal\``)

    },
};