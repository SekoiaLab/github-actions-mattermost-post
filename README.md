# Post Messages on Mattermost via WebHooks

This actions post messages to Mattermost through a WebHook URL.

## Inputs

### `webhook-url`

**Required** URL of the Mattermost WebHook to post message to.

### `text`

**Required** Text message that should be posted.

### `title` (optional)

Title of the posted message.

### `color` (optional)

Hexa value of the color to use. Fallback to `#47ba04` (green).

## Example usage


```yaml
- uses: ./.github/actions/mattermost-post-webhook
  with:
    webhook-url: 'https://mattermost/hooks/xxxx'
    text: 'GitHub Actions **failed to deploy** `${{ github.event.deployment.payload.microservices }}` (`${{ github.event.deployment.payload.release_id }}`) on production. [Click here to see the full log](https://github.com/SekoiaLab/platform/actions/runs/${{ github.run_id }}).'
    color: '#ea0b06'
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
