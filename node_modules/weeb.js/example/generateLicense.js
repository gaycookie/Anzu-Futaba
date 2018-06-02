const weeb = require("../");

const sh = new weeb("super secret token", "Weeb.js Example/v1.6.1");
                                            //User Agent (Optional)

const url = "https://cdn.discordapp.com/avatars/132584525296435200/3a0631c5d4df2a5e8795547964bd1027.webp";
//Requires you to have the Waifu Image Gen Scope
sh.generateInsult(url).then(buffer => {
    console.log(buffer)
});
