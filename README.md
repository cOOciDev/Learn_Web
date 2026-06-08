# COOci Dev Academy Landing

Static landing page for COOci Dev Academy course registration. The frontend stays deployable on GitHub Pages and sends applications to a separate serverless `/api/apply` endpoint for Telegram delivery.

## Local preview

From this directory:

```powershell
node server.js
```

Open `http://localhost:8080/public/index.html`.

Use this Node server when testing the registration form. A plain static server such as `python -m http.server` cannot execute `api/apply.js`, so form submission to `/api/apply` will fail with `405 Method Not Allowed`.

## Media

Course covers live in `public/images/courses/`. The intro video block expects this file:

```text
public/videos/academy-intro.mp4
```

The page already has a poster at `public/images/video-poster.svg`; add the MP4 file with the same path when the final intro video is ready.

## Telegram setup

Create a bot with BotFather, add it to the target chat, then create a local `.env` file from `.env.example`:

```text
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

`node server.js` reads `.env` automatically. On Vercel or another serverless host, set the same names in the project environment variables. Do not put either value in `public/index.html` or any frontend JavaScript file.

To verify Telegram delivery after `.env` is ready:

```powershell
node scripts/check-telegram.js
```

That command sends one test application message to the configured Telegram chat through the same `api/apply.js` handler used by the form.

If the check says the bot cannot send messages to the bot, your `TELEGRAM_CHAT_ID` is the bot's own id. Send `/start` to your bot from the real Telegram account that should receive leads, then run:

```powershell
node scripts/list-telegram-chats.js
```

Copy the printed `chat_id=...` value into `.env` as `TELEGRAM_CHAT_ID`.

## Deployment

The static frontend can be published with GitHub Pages from `public/index.html`.

Deploy `api/apply.js` to a Node serverless host such as Vercel. If the API is not served from the same origin as the site, set this before `assets/js/app.js` in `public/index.html`:

```html
<script>
  window.COOci_APPLY_ENDPOINT = 'https://your-api-domain.example/api/apply';
</script>
```

The form posts the student application to that endpoint, and the endpoint sends one formatted Telegram message using `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.
