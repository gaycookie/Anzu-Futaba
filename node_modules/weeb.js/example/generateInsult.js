const weeb = require("../");

const sh = new weeb("super secret token", "Weeb.js Example/v1.6.1");
                                            //User Agent (Optional)
const options = {
    title: "test",
    avatar: "https://cdn.discordapp.com/avatars/132584525296435200/a9f823c7a39a53f562fe8dcb6edf4607.webp",
    badges: ["https://cdn.discordapp.com/avatars/267207628965281792/e13af85a8abbd8fd2a5ec76d3ca2fbd6.webp"],
    widgets: ["Hi", "bye", "kek"]
};

//Requires you to have the License Scope
sh.generateLicense(options).then(buffer => {
    console.log(buffer)
});
