const weeb = require("../");

const sh = new weeb("super secret token", "Weeb.js Example/v1.6.1");
                                            //User Agent (Optional)

sh.getRandom({type: "bite", nsfw: false, filetype: "gif"}).then(object => {
    console.log(object)
    // Example Object
    /*
     {
        "id": "BJZfMrXwb",
        "type": "awoo",
        "baseType": "awoo",
        "nsfw": false,
        "fileType": "gif",
        "mimeType": "image/gif",
        "tags": [],
        "url": "https://cdn.weeb.sh/images/BJZfMrXwb.gif",
        "hidden": false,
        "account": "HyxjFGfPb"
    }
    */
});
