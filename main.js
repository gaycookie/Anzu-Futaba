const fs        = require('fs');
const Discord   = require('discord.js');
const config    = require('./data/config.json');
const client    = new Discord.Client({autoReconnect:true});
const cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();
client.config   = config;

// Constants //
const { hearts, sad, status } = require('./constants.js');

// New GuildSettings System //
const GuildSettings = require('./guildSettings.js');
const settings      = new GuildSettings();

// Make Connection to LISTEN.moe //
const ListenMoeJS  = require('listenmoe.js');
const moe          = new ListenMoeJS('jpop');
const connectMoe   = moe.connect();
module.exports.moe = moe;

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      let eventFunction = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      client.on(eventName, (...args) => eventFunction.run(client, ...args));
    });
});

const commandFiles = fs.readdirSync('./commands');
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('message', message => {

    if (!message.author.bot && Math.floor(Math.random() * 5) + 1 === 2) {
        if (message.content.includes(`❤`) || message.content.includes(`♥`)) {
            message.channel.send(`${hearts[Math.floor(hearts.length * Math.random())]}`)
            .catch(() => {})
        }
        if (message.content.includes(`😢`) || message.content.includes(`😭`) || message.content.includes(`😦`)) {
            message.channel.send(`${sad[Math.floor(sad.length * Math.random())]}`)
            .catch(() => {})
        }
    }

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${settings.get(message, 'prefix').replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')})\\s*`);
    
    if (!prefixRegex.test(message.content) || message.author.bot) return;
    const [matchedPrefix] = message.content.match(prefixRegex);

    const botMentionRegex = new RegExp(`<@!?${client.user.id}>`);
    if (botMentionRegex.test(matchedPrefix)) {
        if (!botMentionRegex.test(message.content.slice(matchedPrefix.length))) {
            message.mentions.users.delete(client.user.id);
            if (message.mentions.members) {
                message.mentions.members.delete(client.user.id);
            }
        }
    }

    const args = message.content.slice(matchedPrefix.length).split(/\s+/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (!config.owners.includes(message.author.id)) {

        if (command.NSFW && !message.channel.nsfw) {
            return message.reply(`this command can only be used in a NSFW channel, gomenesai desu~`);
        } 

        if (command.ownerOnly) {
            return message.reply(`you're not allowed to use this command, gomenesai desu~`);
        }

        if (command.disabled){
            return message.reply(`this command is disabled globally and can not be used, gomenesai desu~`);
        }

        if (command.permissions) {
            if (message.guild) {
                if (command.permissions === 'guild_owner' && message.member.id !== message.guild.owner.id) {
                    return message.reply(`you need to be the \`Guild Owner\` for this command, gomenesai desu~`)
                }

                if (command.permissions === 'administrator' && !message.member.permissions.has("ADMINISTRATOR")) {
                    return message.reply(`you need to have the \`Administrator\` permission for this command, gomenesai desu~`)
                }
                
                if (command.permissions === 'manage_guild' && !message.member.permissions.has("MANAGE_GUILD")) {
                    return message.reply(`you need to have the \`Manage Guild\` permission for this command, gomenesai desu~`)
                }
            } else {
                return;
            }
        }

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }
        
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;
        
        if (!timestamps.has(message.author.id)) {
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }
        else {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }

    }

    if (command.args && !args.length) {
        return message.reply(`this command requires arguments.\nFor more help about this command use: \`${prefix.get(message)}help ${commandName}\``);
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

client.login(config.token);