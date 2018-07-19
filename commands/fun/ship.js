const Discord        = require('discord.js');
const crc32          = require("crc32");
const Canvas         = require('canvas');
const snekfetch      = require('snekfetch');
const TooFreakinCute = Canvas.registerFont('./data/images/resources/fonts/TooFreakinCute.ttf', {family: 'TooFreakinCute'});

async function shipImage(message, user1, user2, result) {
    const canvas = Canvas.createCanvas(960, 500);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('./data/images/resources/ship-v1/base.png');
    const overlay = await Canvas.loadImage('./data/images/resources/ship-v1/overlay.png');

    const {body: buffer1} = await snekfetch.get(user1.displayAvatarURL);
    const user1Avatar = await Canvas.loadImage(buffer1);
    const {body: buffer2} = await snekfetch.get(user2.displayAvatarURL);
    const user2Avatar = await Canvas.loadImage(buffer2);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(user1Avatar, 130, 46, 340, 340);
    ctx.drawImage(user2Avatar, 485, 46, 340, 340);
    ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);

    ctx.font = '48px TooFreakinCute';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${result}%`, 620, 430);

    const attachment = new Discord.Attachment(canvas.toBuffer(), 'ship-image.png');
    return await message.channel.send(attachment);
}

module.exports = {
    name: 'ship',
    description: 'lala',
    guildOnly: true,
    execute(message, args) {

        const date = new Date();
        const shipDate = `${date.getMonth()+1}${date.getDate()}`;
        let user1;
        let user2;

        if (message.mentions.users.size) {
            if (message.mentions.users.size < 2) {
                user1 = message.mentions.users.first();
                user2 = message.author;
            } else {
                user1 = message.mentions.users.first();
                user2 = message.mentions.users.last();
            }
        } else {
            return message.reply(`you need to mention at least one person to be able to ship.`);
        }

        //const result = Math.abs((parseInt(crc32(user1.id),32) * shipDate) - (parseInt(crc32(user2.id),32) * shipDate)) % 101;
        const result = Math.abs((parseInt(crc32(`${user1.id}`),16)) - (parseInt(crc32(`${user2.id}`),16)) * shipDate) % 101;
        shipImage(message, user1, user2, result);
    },
};