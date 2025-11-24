const core = require('@actions/core');
const http = require('@actions/http-client');

async function run() {
    try {
        core.info("Starting Mattermost post GitHub Action...");

        const webHookUrl = core.getInput('webhook-url');
        const mattermostUrl = core.getInput('mattermost-url');
        const channelID = core.getInput('channel-id');
        const botToken = core.getInput('bot-token');
        const threadId = core.getInput('thread-id');
        const text = core.getInput("text");
        const color = core.getInput("color");
        const useAttachment = core.getInput("use-attachment") === "true";
        let title = core.getInput("title") ;
        let fallback = text;

        core.info(`Inputs received:
            webHookUrl: ${webHookUrl}
            mattermostUrl: ${mattermostUrl}
            channelID: ${channelID}
            botToken: ${botToken ? '[REDACTED]' : ''}
            threadId: ${threadId}
            text: ${text}
            color: ${color}
            useAttachment: ${useAttachment}
            title: ${title}
        `);

        if (title == '') {
            title = undefined;
        }
        else {
            fallback = title + "\n\n" + text;
        }

        const attachments = [
            {
                color: color,
                title: title,
                text: text,
                fallback: fallback
            }
        ];

        const httpClient = new http.HttpClient('mattermost-post');

        if (botToken && threadId) {
            // Send message as a reply in the thread using Mattermost API
            const apiUrl = `${mattermostUrl}/api/v4/posts`;
            const postPayload = {
                channel_id: channelID,
                root_id: threadId
            };
            if (useAttachment) {
                postPayload.props = { attachments };
            } else {
                postPayload.message = text;
            }
            core.info(`Sending POST request to Mattermost API with payload: ${JSON.stringify(postPayload)}`);
            const res = await httpClient.postJson(apiUrl, postPayload, {
                'Authorization': `Bearer ${botToken}`,
                'Content-Type': 'application/json'
            });
            core.info(`Message posted to Mattermost thread ${threadId} via API. Status code=${res.statusCode}.`);
        } else if (webHookUrl) {
            // Send message via webhook
            core.info("Preparing to send message via webhook...");
            const payload = useAttachment ? { attachments } : { text };
            core.info(`Sending POST request to webhook URL with payload: ${JSON.stringify(payload)}`);
            const res = await httpClient.postJson(webHookUrl, payload);
            core.info(`Message posted to Mattermost on URL: ${webHookUrl}. Status code=${res.statusCode}.`);
        } else {
            core.error("Neither (bot-token and thread-id) nor webhook-url has been defined, cannot continue");
            throw new Error("Neither (bot-tokend and thread-id) or webhook-url has been defined, cannot continue")
        }
      core.info("Mattermost post GitHub Action completed.");
    }
    catch (error) {
        core.error(`Action failed: ${error.message}`);
        core.setFailed(error.message);
    }
}

run();
