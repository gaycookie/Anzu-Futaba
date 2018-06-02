exports.run = (client) => {

    const { status } = require('../constants.js');

    function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms));}
    async function activity() {
        let current = 0;
        while (true) {
            if (current === status.length) {current = 0}
            client.user.setActivity(`${status[current]}`, { url: 'https://www.twitch.tv/noella_kawaii', type: 'STREAMING' })
            await sleep(20000);
            current++;
        }
    }

    console.log("|-------------------")
    console.log("| Anzu Discord Bot  ")
    console.log("|-------------------")
    console.log(`| ${client.user.username}`)
    console.log("| ")
    console.log(`| Guilds: ${client.guilds.size}`)
    console.log(`| Users: ${client.users.size}`)
    console.log(`|-------------------`)
    activity();

}
