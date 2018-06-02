const weeb = require("../");

const sh = new weeb("super secret token", "Weeb.js Example/v1.6.1");
                                            //User Agent (Optional)
//Requires you to have the Simple Image Gen Scope
//Status (first argument) can be "online", "dnd", "idle", "offline" or "streaming"

sh.generateDiscordMock("online", "https://cdn.discordapp.com/avatars/132584525296435200/8c7423df35ef1258db65451a011d63ca.png").then(buffer => {
    console.log(buffer)
});
