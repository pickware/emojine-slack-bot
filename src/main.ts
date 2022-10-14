const { App, LogLevel } = require("@slack/bolt");
const dotenv = require("dotenv")

// Load .env-file
dotenv.config()

const emojineApp = new App({
    token: process.env.EMOJINE_BOT_TOKEN,
    signingSecret: process.env.EMOJINE_SIGNING_SECRET,
    // LogLevel can be imported and used to make debugging simpler
    logLevel: LogLevel.DEBUG,
    socketMode: true, // add this
    appToken: process.env.EMOJINE_APP_TOKEN // add this
});

emojineApp.event("emoji_changed", async ({ event, client, context }) => {
    if (event.subtype != "add") {
        return
    }

    const conversations = await client.conversations.list({limit: 1000});
    let channelIds = conversations.channels.filter((channel) => {
        return channel.is_member
    }).map((channel) => channel.id);


    await Promise.all(
        channelIds.map((channelId) => {
            return client.chat.postMessage({
                channel: channelId,
                text: `New Emoji added: :${event.name}:`
            })
        })
    )
});

const main = async () => {
    // Start your app
    await emojineApp.start(process.env.PORT || 3000);

    console.log('⚡️ Emojine is running!');
}


main();
