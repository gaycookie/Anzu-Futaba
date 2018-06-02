var alphabet1  = "abcdefghijklmnopqrstuvwxyz,";
var alphabet2  = "🇦🇧🇨🇩🇪🇫🇬🇭🇮🇯🇰🇱🇲🇳🇴🇵🇶🇷🇸🇹🇺🇻🇼🇽🇾🇿 ";

function encode(messageo, alphabet1, alphabet2) {
    var newMessage = "";
    messageArr = messageo.split('');
    for(i in messageArr) {
        index = alphabet1.search(messageArr[i]);
        newMessage += alphabet2[index];
    }
    return newMessage;
};

module.exports = {
    name: 'bigsay',
    description: 'Make Noëlla repeat what you said, in big Emoji Letters',
    args: true,
    usage: '<message>',
    guildOnly: true,
    execute(message, args) {

        if (!args.length) {
            return message.channel.send(`${message.author}, you didn't provide anything that I can repeat, gomenesai desu~`);
        }

        try {
            return message.channel.send(`${encode(args.join(" ").toLowerCase(), alphabet1, alphabet2)}`)
        } catch (error) {
            console.log(error)
            return message.channel.send(`${message.author}, something went wrong, please try again. Gomenesai desu~`)
        }

    },
};