const https = require("https");
const url = require('url');
const {post, get} = require('request').defaults({encoding: null});
const {BASE_URL, ENDPOINTS, FILE_TYPES, KEY_TYPES, DISCORD_STATUSES} = require("./base");
const version = require("../package").version;

class Handler {
    constructor(key, agent=null) {
        if (typeof key !== 'string') throw new TypeError('Authorization Key is not a string.');
        let type = key.split(" ")[0];
        if (!KEY_TYPES.includes(type)) throw new Error("The Authorization key type must be either Wolke or Bearer");
        if(agent) {
            if(typeof agent != "string") throw new TypeError('User-Agent is not a string.');
            if(agent.split("/").length < 2) throw new Error("Your user agent should contain your application name and version (Name/Version)");
            this.agent = agent;
        }
        this.key = key;
    }

    getTags(hidden = false) {
        return new Promise((resolve, reject) => {
            if (typeof hidden != "boolean") reject(new TypeError("Hidden must be a boolean"));
            https.request(Object.assign(url.parse(BASE_URL + ENDPOINTS.TAGS), {
                headers: {'Authorization': this.key, 'User-Agent': this.agent ? this.agent : "Weeb.js/"+version}
            }), res => {
                let chunked = '';

                res.setEncoding('utf8');
                res.on('data', chunk => chunked += chunk);
                res.on('error', reject);
                res.on('end', () => {
                    try {
                        let ret = JSON.parse(chunked);

                        if (ret.status !== 200) reject(ret);
                        else resolve(ret.tags);
                    } catch (err) {
                        reject(err);
                    }
                });
            }).on('error', reject).end();
        });
    }

    getTypes(hidden = false) {
        return new Promise((resolve, reject) => {
            if (typeof hidden != "boolean") reject(new TypeError("Hidden must be a boolean"));
            https.request(Object.assign(url.parse(BASE_URL + ENDPOINTS.TYPES), {
                headers: {'Authorization': this.key, 'User-Agent': this.agent ? this.agent : "Weeb.js/"+version}
            }), res => {
                let chunked = '';

                res.setEncoding('utf8');
                res.on('data', chunk => chunked += chunk);
                res.on('error', reject);
                res.on('end', () => {
                    try {
                        let ret = JSON.parse(chunked);

                        if (ret.status !== 200) reject(ret);
                        else resolve(ret.types);
                    } catch (err) {
                        reject(err);
                    }
                });
            }).on('error', reject).end();
        });
    }

    getRandom(options = {}) {
        return new Promise((resolve, reject) => {
            if (!options.type && !options.tags) return reject(new Error('Either tags or type are required.'));
            if (options.tags && !(options.tags instanceof Array)) return reject(new TypeError("Tags is not an array"));
            if (options.nsfw && typeof options.nsfw != "boolean" && options.nsfw != "only") return reject(new Error("nsfw must either be true, false or only"));
            if (options.hidden && typeof options.hidden != "boolean") return reject(new TypeError("hidden must be a boolean"));
            if (options.filetype && typeof options.filetype != "string") return reject(new TypeError("filetype must be a string"));
            if (options.filetype && !FILE_TYPES.includes(options.filetype.toLowerCase())) return reject(new Error("filetype must be either jpeg, jpg, png or gif"));
            let query = `?hidden=${options.hidden || false}&nsfw=${options.nsfw || false}`;
            if (options.type) query += `&type=${options.type}`;
            if (options.tags) query += `&tags=${options.tags.join(",")}`;
            if (options.filetype) query += `&filetype=${options.filetype}`;

            https.request(Object.assign(url.parse(BASE_URL + ENDPOINTS.RANDOM + query), {
                headers: {'Authorization': this.key, 'User-Agent': this.agent ? this.agent : "Weeb.js/"+version}
            }), res => {
                let chunked = '';

                res.setEncoding('utf8');
                res.on('data', chunk => chunked += chunk);
                res.on('error', reject);
                res.on('end', () => {
                    try {
                        let ret = JSON.parse(chunked);

                        if (ret.status !== 200) reject(ret);
                        else {
                            resolve(ret);
                        }
                    } catch (err) {
                        reject(err);
                    }
                });
            }).on('error', reject).end();
        });
    }

    generateDiscordMock(status=null, url=null) {
        return new Promise((resolve, reject) => {
            if(status && !DISCORD_STATUSES.includes(status.toLowerCase())) return reject(new Error("Status can only be online, dnd, idle, offline or streaming."));
            if (url && !url.match(/^https?:\/\/.+\.(?:jpg|png|jpeg|gif|webp)$/g)) return reject(new Error("You need to prove a valid direct image URL."));
            const query = `?status=${status ? status : "online"}${url ? `&avatar=${encodeURIComponent(url)}` : ""}`;
            const options = {
                method: 'get', json: true, url: BASE_URL + ENDPOINTS.DISCORD + query,
                headers: {'Authorization': this.key, 'User-Agent': this.agent ? this.agent : "Weeb.js/"+version}
            };

            get(options, function (error, response, body) {
                if (error) return reject(error);
                if (response.statusCode != 200) reject(body);
                else resolve(body)
            });
        });
    }

    generateImage(type, options = {}) {
        return new Promise((resolve, reject) => {
            if (typeof type != "string" || (type != "awooo" && type != "eyes" && type != "won")) return reject(new TypeError("Type must be a string and either awooo, eyes or won"));
            let query = "?type=" + type;
            if (type = "awoo" && (options.hair || options.face)) {
                if (options.hair && !options.hair.match(/^[0-9a-f]{6}$/gi)) return reject(new Error("Hair must be a valid hex code"));
                if (options.face && !options.face.match(/^[0-9a-f]{6}$/gi)) return reject(new Error("Face must be a valid hex code"));
                query += (options.hair ? "&hair=" + options.hair : "&hair=cc817c") + (options.face ? "&face=" + options.face : "&face=fff0d3")
            }
            const option = {
                method: 'get', json: true, url: BASE_URL + ENDPOINTS.GENERATE + query,
                headers: {'Authorization': this.key, 'User-Agent': this.agent ? this.agent : "Weeb.js/"+version}
            };
            get(option, function (error, response, body) {
                if (error) return reject(error);
                if (response.statusCode != 200) reject(body);
                else resolve(new Buffer(body, 'base64'))
            });
        });
    }

    generateLicense(options = {}) {
        return new Promise((resolve, reject) => {
            if (typeof options.avatar != "string" || typeof options.title != "string") return reject(new TypeError("Title and Avatar need to be given and must be a string."));
            if (options.badges && (!(options.badges instanceof Array) || options.badges.length > 3 || options.badges.length < 1)) return reject(new TypeError("Badges must be an array that contains at least 1 and not more than 3 values"));
            if (options.widgets && (!(options.widgets instanceof Array) || options.widgets.length > 3 || options.widgets.length < 1)) return reject(new TypeError("Widgets must be an array that contains at least 1 and not more than 3 values"));
            const postData = {
                "title": options.title,
                "avatar": options.avatar
            };

            if (options.widgets) postData["widgets"] = options.widgets;
            if (options.badges) postData["badges"] = options.badges;
            const postOptions = {
                method: 'post', body: postData, json: true, url: Object.assign(url.parse(BASE_URL + ENDPOINTS.LICENSE)),
                headers: {'Authorization': this.key, 'User-Agent': this.agent ? this.agent : "Weeb.js/"+version},
            };
            post(postOptions, function (error, response, body) {
                if (error) return reject(error);
                if (response.statusCode != 200) reject(body);
                else resolve(body)
            });
        });
    }

    generateInsult(URL) {
        return new Promise((resolve, reject) => {
            if(typeof URL != "string") reject(new TypeError("The URL must be a string"));
            const postData = {
                "avatar": URL
            };

            const postOptions = {
                method: 'post', body: postData, json: true, url: Object.assign(url.parse(BASE_URL + ENDPOINTS.WAIFU)),
                headers: {'Authorization': this.key, 'User-Agent': this.agent ? this.agent : "Weeb.js/"+version},
            };
            post(postOptions, function (error, response, body) {
                if (error) return reject(error);
                if (response.statusCode != 200) reject(body);
                else resolve(body)
            });
        });
    }

    generateLoveShip(targetOne, targetTwo) {
        return new Promise((resolve, reject) => {
            if(typeof targetOne != "string" || typeof targetTwo != "string") reject(new TypeError("Both targetOne and targetTwo need to be given and need to be a string"));

            const postData = {
                "targetOne": targetOne,
                "targetTwo": targetTwo
            };

            const postOptions = {
                method: 'post', body: postData, json: true, url: Object.assign(url.parse(BASE_URL + ENDPOINTS.LOVE_SHIP)),
                headers: {'Authorization': this.key, 'User-Agent': this.agent ? this.agent : "Weeb.js/"+version},
            };
            post(postOptions, function (error, response, body) {
                if (error) return reject(error);
                if (response.statusCode != 200) reject(body);
                else resolve(body)
            });
        });
    }

}

module.exports = Handler;
