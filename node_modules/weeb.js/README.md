<a href="https://nodei.co/npm/weeb.js/"><img src="https://nodei.co/npm/weeb.js.png?downloads=true&stars=true" alt="NPM info" /></a>

A wrapper for https://weeb.sh/<br>
Replace all instances of "super secret token" with your actual token if you are using a WolkeToken place it as `Wolke <token>` and if a BearerToken place it as `Brearer <token>` everything else will throw an error.<br><br>
##### Note:
If you have never spoken with a Weeb.sh Developer and they told you, you have access to an Image-generation then you **cannot** use any of the Generation methods (they will error with missing Scope). If you have access to one that does not mean you have access to all. The scopes needed are in the comments and brackets on the example.
# Official Documentation
[Base Documentation](https://gist.github.com/DasWolke/f9f8eb7bb9c4faeb10d33ab5bcc95898)<br>
[Image Generation Documentation](https://gist.github.com/DasWolke/3b1f884ac7779faab7e1026feed78b6c)

# Get Random Images
```js
const weeb = require("weeb.js");

const sh = new weeb("super secret token", "Weeb.js Example/v1.6.1");
                                            //User Agent (Optional)

sh.getRandom({type: "bite", nsfw: false, filetype: "gif"}).then(array => {
    console.log(array[0]); //The url to the image
    console.log(array[1]); //The ID of the image
    console.log(array[2]); //The File type of the image
});
```

# Get all available Types

```js
const weeb = require("weeb.js");

const sh = new weeb("super secret token", "Weeb.js Example/v1.6.1");
                                            //User Agent (Optional)
sh.getTypes().then(array => {
    console.log(array)
});
```

# Get all available Tags

```js
const weeb = require("weeb.js");

const sh = new weeb("super secret token", "Weeb.js Example/v1.6.1");
                                            //User Agent (Optional)
sh.getTags().then(array => {
    console.log(array)
});
```
# Generate an Image (Requires Simple Image Gen Scope)

```js
const weeb = require("weeb.js");

const sh = new weeb("super secret token", "Weeb.js Example/v1.6.1");
                                            //User Agent (Optional)
//Requires you to have the Simple Image Gen Scope
//Type can be won, awooo or eyes (Awooo supports hair and face as options which needs to be a hex code)

sh.generateImage("won").then(buffer => {
    console.log(buffer)
});
```

# Generate a Discord Status Mock (Requires Simple Image Gen Scope)

```js
const weeb = require("weeb.js");

const sh = new weeb("super secret token", "Weeb.js Example/v1.6.1");
                                            //User Agent (Optional)
//Requires you to have the Simple Image Gen Scope
//Status (first argument) can be "online", "dnd", "idle", "offline" or "streaming"

sh.generateDiscordMock("online", "https://cdn.discordapp.com/avatars/132584525296435200/8c7423df35ef1258db65451a011d63ca.png").then(buffer => {
    console.log(buffer)
});

```

# Generate a License (Requires License Scope)

```js
const weeb = require("weeb.js");

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
```

# Generate a Waifu Insult Image (Requires Waifu Image Gen Scope)

```js
const weeb = require("weeb.js");
const sh = new weeb("super secret token", "Weeb.js Example/v1.6.1");
                                            //User Agent (Optional)

const url = "https://cdn.discordapp.com/avatars/132584525296435200/3a0631c5d4df2a5e8795547964bd1027.webp";
//Requires you to have the Waifu Image Gen Scope
sh.generateInsult(url).then(buffer => {
    console.log(buffer)
});
```

# Generate a Love-Ship Image (Requires Love-Ship Scope)

```js
const weeb = require("weeb.js");

const sh = new weeb("super secret token", "Weeb.js Example/v1.6.1");
                                            //User Agent (Optional)

const targetOne = "https://cdn.discordapp.com/avatars/185476724627210241/615ee9f0e97aab7fa0725165531df3a7.webp?size=256";
const targetTwo = "https://cdn.discordapp.com/avatars/388799526103941121/b5acd5dd89aa8ff7c3600f2b7edaff57.webp?size=256";
//Requires you to have the Waifu Image Gen Scope
sh.generateLoveShip(targetOne, targetTwo).then(buffer => {
    console.log(buffer)
});
```

# DO NOT COPY PASTE THESE AND EXPECT THEM TO WORK
Sometimes I used images in these examples that no longer exist, causing these examples to not always work. Please test it with working URL's and double check that you have said scopes before opening an issue or contacting me. Thanks.
