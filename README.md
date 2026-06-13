# COOci Dev Academy Signup System

Static GitHub Pages frontend plus secure serverless API for receiving course signup/contact messages and forwarding them to Telegram and Gmail.

## Structure

```text
public/index.html          Static landing page for GitHub Pages
assets/                    Public CSS, JS, i18n, and course data
api/register.js            Vercel serverless signup endpoint
api/apply.js               Backward-compatible alias to register.js
api/health.js              Small health endpoint
server.js                  Local static/API dev server
.env.example               Placeholder environment variables only
```

## Security Rules

Never commit real secrets. Keep these values only in local `.env` or the backend host environment variables:

```text
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
GMAIL_USER
GMAIL_APP_PASSWORD
ALLOWED_ORIGIN
```

`.gitignore` excludes `.env`, `.env.local`, `node_modules`, logs, and common secret files.

## Local Development

Install dependencies:

```powershell
npm install
```

Create local environment variables:

```powershell
copy .env.example .env
```

Edit `.env`:

```text
TELEGRAM_BOT_TOKEN=your_private_bot_token
TELEGRAM_CHAT_ID=your_private_chat_id
GMAIL_USER=cooci.ebrahimi@gmail.com
GMAIL_APP_PASSWORD=your_google_app_password
ALLOWED_ORIGIN=http://localhost:8080
```

Run locally:

```powershell
npm run dev
```

Open:

```text
http://localhost:8080/public/index.html
```

## Frontend Deployment: GitHub Pages

Publish the static files from this repository to GitHub Pages. The frontend contains no Telegram token, Gmail password, chat ID, or private API secret.

If your Vercel API is on a different domain, set the public API URL before `assets/js/app.js` in `public/index.html`:

```html
<script>
  window.COOci_API_ENDPOINT = 'https://your-vercel-project.vercel.app/api/register';
</script>
```

If the API is served from the same origin in local dev, no config is needed.

## Backend Deployment: Vercel

Deploy the repository to Vercel and set these Project Settings -> Environment Variables:

```text
TELEGRAM_BOT_TOKEN=your_private_bot_token
TELEGRAM_CHAT_ID=your_private_chat_id
GMAIL_USER=cooci.ebrahimi@gmail.com
GMAIL_APP_PASSWORD=your_google_app_password
ALLOWED_ORIGIN=https://coocidev.github.io
```

Use a Google App Password for `GMAIL_APP_PASSWORD`, not the normal Gmail password.

Endpoints:

```text
POST /api/register
GET  /api/health
```

The API validates and sanitizes the form fields, rate-limits requests, formats one Persian message, sends it to Telegram, and sends the same message to Gmail through Nodemailer.

## Telegram Helpers

If you do not know the Telegram chat ID, send `/start` to your bot from the receiving Telegram account, then run:

```powershell
npm run list:telegram
```

To test Telegram and the full API flow after `.env` is configured:

```powershell
npm run check:telegram
```

## Media

Course covers live in `public/images/courses/`. The intro video block expects:

```text
public/videos/academy-intro.mp4
```

The page already has a poster at `public/images/video-poster.svg`; add the MP4 file with the same path when the final intro video is ready.
