const core = require('@actions/core');
const http = require('@actions/http-client');

async function run() {
    try {
        const webHookUrl = core.getInput('webhook-url');
        const text = core.getInput("text");
        const color = core.getInput("color");
        let title = core.getInput("title");
        let fallback = text;

        if (title == '') {
            title = undefined;
        }
        else {
            fallback = title + "\n\n" + text;
        }


        const payload = {
            attachments: [
                {
                    fallback: text,
                    color: color,
                    text: text,
                    title: title,
                    fallback: fallback
                }
            ]
        }

        const httpClient = new http.HttpClient('mattermost-post-webhook')
        const res = await httpClient.postJson(webHookUrl, payload);

        console.log(`Message posted to Mattermost on URL: ${webHookUrl}. Status code=${res.statusCode}. Payload=${payload}`);
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run();
