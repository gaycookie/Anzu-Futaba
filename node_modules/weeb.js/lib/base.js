const BASE_URL = "https://api.weeb.sh";

const PATHS = {
    AUTO: "/auto-image/",
    IMAGES: "/images/"
};

const ENDPOINTS = {
    INFO: {
        IMAGES: PATHS.IMAGES,
        GENERATION: PATHS.AUTO
    },
    TAGS: PATHS.IMAGES + 'tags',
    TYPES: PATHS.IMAGES + 'types',
    RANDOM: PATHS.IMAGES + 'random',
    GENERATE: PATHS.AUTO + 'generate',
    DISCORD: PATHS.AUTO + 'discord-status',
    LICENSE: PATHS.AUTO + 'license',
    WAIFU: PATHS.AUTO + 'waifu-insult',
    LOVE_SHIP: PATHS.AUTO + 'love-ship'
};
const KEY_TYPES = [
    "Bearer",
    "Wolke"
];
const FILE_TYPES = [
    "jpeg",
    "jpg",
    "png",
    "gif"
];
const DISCORD_STATUSES = [
    "online",
    "idle",
    "dnd",
    "offline",
    "streaming"
];
module.exports = {BASE_URL, ENDPOINTS, FILE_TYPES, KEY_TYPES, DISCORD_STATUSES};
