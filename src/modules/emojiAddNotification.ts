import {App} from "@slack/bolt";

export default (app: App) => {
    app.event("emoji_changed", async ({ event, client, context }) => {
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
}
