const fs = require('fs');

let _lastManager = null; // This will hold the last manager created

class PrefixManager {
    constructor(path, defaultPrefix) {
        this.path = path;
        this.defaultPrefix = defaultPrefix;
        this.prefixes = {};
        
        this.load()
        _lastManager = this; // Set the _lastManager as the last create PrefixManager
    }
    
    load() {
        try {
            const data = fs.readFileSync(this.path);
            const json = JSON.parse(data);
            this.prefixes = json;
        } catch (e) {
            console.log('error while reading or parsing prefix json', e.message)
        }
    }
    
    save() {
        fs.writeFileSync(this.path, JSON.stringify(this.prefixes));
    }
    
    get(message) {
        if (message.guild && this.prefixes[message.guild.id]) {// hello ^_^ // hi ;D
            return this.prefixes[message.guild.id];
        }
        return this.defaultPrefix;
    }
    
    set(message, prefix) {
        if (message.guild) {
            this.prefixes[message.guild.id] = prefix;
            this.save();
            return true
        }
    }

    static lastManager() { // static method so it can be accessed from PrefixManager.lastManager() (without new)
        return _lastManager;
    }
}

module.exports = PrefixManager;