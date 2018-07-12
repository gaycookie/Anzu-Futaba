const Discord       = require('discord.js');
const config        = require('../../data/config.json');
const GuildSettings = require('../../guildSettings.js');
const settings      = new GuildSettings();

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    execute(message, args) {
        const { commands } = message.client;
        const data = [];
        
        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${settings.get(message, 'prefix')}help [command name]\` to get info on a specific command!`);
            return message.channel.send(data, { split: true })
        }


        else {
            if (!commands.has(args[0])) {
                return message.reply('that\'s not a valid command!');
            }
            
            const command = commands.get(args[0]);
            
            const embed = new Discord.RichEmbed()
                embed.setColor(16670894)
                embed.setTitle(`${command.name}`) 
                embed.setDescription(`${command.description}`)
                embed.setThumbnail(`${message.client.user.avatarURL}`)
                if (command.aliases) embed.addField('Command Aliases: ', `${command.aliases.join(', ')}`, false)
                if (command.usage) embed.addField('Command Usage: ', `${settings.get(message, 'prefix')}${command.name} ${command.usage}`, false)
                if (command.permissions) embed.addField('Required Permissions: ', `${command.permissions}`, false)
                if (command.cooldown) embed.addField('Command Cooldown: ', `${command.cooldown}`, false)
            return message.channel.send({embed: embed})

            //data.push(`**Name:** ${command.name}`);
            //if (command.description) data.push(`**Description:** ${command.description}`);
            //if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
            //if (command.usage) data.push(`**Usage:** ${settings.get(message, 'prefix')}${command.name} ${command.usage}`);
            //if (command.permissions) data.push(`**Permission:** ${command.permissions}`)
            
            //data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
        }
        //message.channel.send(data, { split: true })
        //.then(() => {
        //    if (message.channel.type === 'dm') {
        //        message.channel.send('I\'ve sent you a DM with all my commands!');
        //    }
        //})
        //.catch(() => message.reply('it seems like I can\'t DM you!'));
    },
};