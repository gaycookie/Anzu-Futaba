const weeb = require("../");

const sh = new weeb("super secret token", "Weeb.js Example/v1.6.1");
                                            //User Agent (Optional)
sh.getTags().then(array => {
    console.log(array)
});
