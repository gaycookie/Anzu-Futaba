const fs     = require('fs');
const config = require('./data/config.json');

let _lastSettings = null;

class GuildSettings {
    constructor() {
        this.path           = './data/guild_settings.json';
        this.defaultPrefix  = config.prefix;
        this.settings       = {};
        
        this.load()
        _lastSettings = this;
    };
    
    load() {
        try {
            const data = fs.readFileSync(this.path);
            const json = JSON.parse(data);
            this.settings = json;
        } catch (e) {
            console.log('error while reading or parsing setting json', e.message)
        };
    };
    
    save() {
        fs.writeFileSync(this.path, JSON.stringify(this.settings));
    };
    
    get(message, type) {

        if (type == 'prefix') {
            if (!message.guild) return this.defaultPrefix;
    
            if (message.guild) {
                if (this.settings[message.guild.id]) {
                    return this.settings[message.guild.id]['prefix'];
                } else {
                    return this.defaultPrefix;
                };
            };
        };

        if (type == 'radio_channel') {
            if (!message.guild) return;

            if (this.settings[message.guild.id]['radio_channel']) {
                return this.settings[message.guild.id]['radio_channel'];
            } else {
                return;
            };
        };

        if (type == 'radio_genre') {
            if (!message.guild) return;

            if (this.settings[message.guild.id]['radio_genre']) {
                return this.settings[message.guild.id]['radio_genre'];
            } else {
                return 'jpop';
            };
        };

    };
    
    getAllKPOP() {
        let kpop_array = [];
        for (let guilds in this.settings) {
            if (this.settings[guilds]['radio_genre'] == 'kpop' && this.settings[guilds]['radio_channel'])
            kpop_array.push(this.settings[guilds]['radio_channel'])
        };
        return kpop_array;
    }

    getAllJPOP() {
        let jpop_array = [];
        for (let guilds in this.settings) {
            if (this.settings[guilds]['radio_genre'] == 'jpop' && this.settings[guilds]['radio_channel'])
            jpop_array.push(this.settings[guilds]['radio_channel'])
        };
        return jpop_array;
    }

    getAll(type) {
        if (type == 'radio_channel') {
            let array = [];
            for (let guilds in this.settings) {
                var value = this.settings[guilds][type];
                if (value) {array.push(value)};
            };
            return array;
        };
    };

    set(message, type, argument) {
        if (!message.guild) return;

        if (type == 'prefix') {
            this.settings[message.guild.id]['prefix'] = argument;
            this.save();
            return true
        };

        if (type == 'radio_channel'){
            this.settings[message.guild.id]['radio_channel'] = argument;
            this.save();
            return true            
        };

        if (type == 'radio_genre'){
            this.settings[message.guild.id]['radio_genre'] = argument;
            this.save();
            return true            
        };
    };

    static lastSettings() {
        return _lastSettings;
    };
}

module.exports = GuildSettings;