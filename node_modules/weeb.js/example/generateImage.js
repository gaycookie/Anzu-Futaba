const weeb = require("../");

const sh = new weeb("super secret token", "Weeb.js Example/v1.6.1");
                                            //User Agent (Optional)
//Requires you to have the Simple Image Gen Scope
//Type can be won, awooo or eyes (Awooo supports hair and face as options which needs to be a hex code)

sh.generateImage("won").then(buffer => {
    console.log(buffer)
});
