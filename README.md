# Post Messages on Mattermost via WebHooks

This actions post messages to Mattermost through a WebHook URL.

## Inputs

### `mattermost-url` (optional)

Mattermost URL to respond to messages

### `channel-id` (optional)

ID of the canal to send message to. Retrieve it in the info dropdown of the canal. By default it points to
`platform-changes` mattermost channel that has id `nma3kq5wwtfxpfac55mag397cr`.

### `bot-token` (optionnaly required)

Bot access token for authentication

### `thread-id` (optionnaly required)

Thread ID (post ID) to reply to

### `use-attachment` (optional)

If set to true it should send message as an attachement in mattermost

### `webhook-url`

**Required** URL of the Mattermost WebHook to post message to.

### `text`

**Required** Text message that should be posted.

### `title` (optional)

Title of the posted message.

### `color` (optional)

Hexa value of the color to use. Fallback to `#47ba04` (green).

## Detail

If `thread-id` and `bot-token` are defined it will send a response message in the thread as the user represented by the
bot-token.

Otherwise, if `webhook-url` is defined it will send the message to that channel with the webhook and the associated
user.

## Example usage


```yaml
- uses: SekoiaLab/github-actions-mattermost-post@v1
  with:
    webhook-url: 'https://mattermost/hooks/xxxx'
    text: 'GitHub Actions **failed to deploy** `${{ github.event.deployment.payload.microservices }}` (`${{ github.event.deployment.payload.release_id }}`) on production. [Click here to see the full log](https://github.com/SekoiaLab/platform/actions/runs/${{ github.run_id }}).'
    color: '#ea0b06'

- uses: SekoiaLab/github-actions-mattermost-post@v3
  with:
    webhook-url: 'https://mattermost/hooks/xxxx'
    text: message sent to mattermost
    color: '#ea0b06'

- uses: SekoiaLab/github-actions-mattermost-post@v3
  with:
    thread-id: <id of thread to respond to>
    bot-token: ${secrets.MATTERMOST_PIERRE_BOT_TOKEN}
    text: message sent to mattermost
```

## Package for distribution

GitHub Actions will run the entry point from the `action.yml`. Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in `node_modules`.

Actions are run from GitHub repos.  Packaging the action will create a packaged action in the `dist` folder.

Run prepare

```bash
export NODE_OPTIONS=--openssl-legacy-provider
npm run prepare
```

Since the packaged `index.js` is run from the `dist` folder.

```bash
git add -f dist
```
