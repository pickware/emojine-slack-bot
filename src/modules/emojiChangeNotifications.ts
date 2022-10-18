import {App, EmojiChangedEvent} from "@slack/bolt";
import {WebClient} from "@slack/web-api";

export default (app: App) => {
    app.event("emoji_changed", async ({ event, client }) => {
        if (event.subtype == "add") {
            await sendEmojiAddedMessage(client, event)
        } else if (event.subtype == "remove") {
            await sendEmojiDeletedMessage(client, event.names)
        }
    });
}

async function sendEmojiAddedMessage(client: WebClient, event: EmojiChangedEvent) {
    const channelIds = await getEmojineChannelIds(client)

    let text: string
    if (event.value.startsWith("alias")) {
        text = `:spiderman-pointing-left: :spiderman-pointing-right: New alias added :${event.name}:`
    } else {
        text = `:party_hat: New Emoji was added: :${event.name}:`
    }

    return Promise.all(
        channelIds.map((channelId) => {
            return client.chat.postMessage({
                channel: channelId,
                text,
            })
        })
    )
}

async function sendEmojiDeletedMessage(client: WebClient, emojiNames: string[]) {
    const channelIds = await getEmojineChannelIds(client)

    return Promise.all(
        channelIds.map((channelId) => {
            let text: string
            if (emojiNames.length == 1) {
                text = `:tired_face: Emoji was deleted: ${emojiNames[0]}`;
            } else {
                text = `:tired_face: Emojis were deleted: ${emojiNames.join(", ")}`;
            }

            return client.chat.postMessage({
                channel: channelId,
                text
            })
        })
    )
}

async function getEmojineChannelIds(client: WebClient): Promise<string[]> {
    const conversations = await client.conversations.list({limit: 1000});

    return conversations.channels.filter((channel) => {
        return channel.is_member
    }).map((channel) => channel.id);
}

