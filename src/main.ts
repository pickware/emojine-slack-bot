import emojiAddNotification from "./modules/emojiAddNotification";

const { App, LogLevel } = require("@slack/bolt");
const dotenv = require("dotenv")
const express = require('express')

const modules = [
    emojiAddNotification
]

function launchWebserver() {
    // We need a webserver for Heroku, because it only accepts the app as launched successfully when a webserver is running
    // on port $PORT
    const webserver = express()
    webserver.get('/', (req, res) => {
        res.send('Emojine. An emoji Slack bot. Come and contribute: https://github.com/pickware/emojine-slack-bot')
    })
    webserver.listen(process.env.PORT || 3000)
}

async function launchEmojine() {
    const emojineApp = new App({
        token: process.env.EMOJINE_BOT_TOKEN,
        signingSecret: process.env.EMOJINE_SIGNING_SECRET,
        logLevel: LogLevel.DEBUG,
        socketMode: true,
        appToken: process.env.EMOJINE_APP_TOKEN
    });

    modules.forEach(module => module(emojineApp));

    await emojineApp.start();

    console.log('👧️Emojine is running!');
}


function main() {
    // Load .env-file
    dotenv.config()

    launchWebserver();
    launchEmojine();
}


main();
