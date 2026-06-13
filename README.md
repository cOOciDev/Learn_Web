# COOci Dev Academy

Static GitHub Pages frontend with a separate secure backend API for course signup/contact messages.

## Architecture

- `index.html` is the only frontend entry point for GitHub Pages.
- `assets/` contains public CSS, JavaScript, i18n JSON, and course data.
- `public/` contains public images, icons, fonts, and the 3D model.
- `api/register.js`, `api/apply.js`, and `api/health.js` are backend/serverless files for Vercel or a small Node host.
- `server.js` is only for local development.

GitHub Pages cannot run Node.js, Nodemailer, or Telegram Bot API secrets. The frontend must call a deployed backend URL.

## Security Rules

Never commit real values for:

```text
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
GMAIL_USER
GMAIL_APP_PASSWORD
ADMIN_NOTIFICATION_EMAIL
```

Keep secrets only in local `.env` or backend host environment variables. `.env`, `.env.local`, `node_modules`, logs, and common key/secret files are ignored by git.

If secrets were committed before, rotate them immediately:

1. Revoke the Telegram bot token with BotFather and create a new token.
2. Generate a new Google App Password and delete the old one.
3. Change private chat IDs or destination groups if needed.
4. Remove secrets from git tracking and commit the cleanup.

Cleanup commands:

```powershell
git rm -r --cached node_modules
git rm --cached .env
git add .gitignore .env.example
git commit -m "Secure repo: remove secrets and node_modules"
```

## Local Development

Install dependencies:

```powershell
npm install
```

Create local secrets:

```powershell
copy .env.example .env
```

Edit `.env` with private values:

```text
TELEGRAM_BOT_TOKEN=your_private_bot_token
TELEGRAM_CHAT_ID=your_private_chat_id
GMAIL_USER=your_gmail_address
GMAIL_APP_PASSWORD=your_google_app_password
ADMIN_NOTIFICATION_EMAIL=admin_destination_email
ALLOWED_ORIGIN=http://localhost:8080
```

Run locally:

```powershell
npm run dev
```

Open:

```text
http://localhost:8080/
```

If port `8080` is already in use, the local server automatically tries the next ports.

Run syntax checks:

```powershell
npm run check
```

## Frontend Deployment: GitHub Pages

The workflow at `.github/workflows/static.yml` deploys only:

```text
index.html
assets/
public/
.nojekyll
```

Expected production URL:

```text
https://coocidev.github.io/Learn_Web/
```

Configure the public backend endpoint in `index.html`:

```html
<meta name="cooci-api-endpoint" content="https://your-backend.example.com/api/register" />
```

This URL is public and is not a secret. Do not put Telegram tokens, Gmail passwords, or chat IDs in frontend files.

## Backend Deployment

The current backend is compatible with Vercel Functions or a small Node host such as Railway/Render. Set these environment variables in the backend host:

```text
TELEGRAM_BOT_TOKEN=your_private_bot_token
TELEGRAM_CHAT_ID=your_private_chat_id
GMAIL_USER=your_gmail_address
GMAIL_APP_PASSWORD=your_google_app_password
ADMIN_NOTIFICATION_EMAIL=admin_destination_email
ALLOWED_ORIGIN=https://coocidev.github.io
```

Endpoints:

```text
GET  /api/health
POST /api/register
POST /api/apply
```

The API validates and sanitizes request fields, rate-limits by IP in-memory, rejects honeypot spam, sends a formatted Telegram message, and optionally sends a Gmail notification.

## Telegram Helpers

If you do not know the Telegram chat ID, send `/start` to the bot from the receiving Telegram account, then run:

```powershell
npm run list:telegram
```

To test Telegram and the full API flow after `.env` is configured:

```powershell
npm run check:telegram
```

## Media

Course covers live in:

```text
public/images/courses/
```

The intro video block expects:

```text
public/videos/academy-intro.mp4
```

The poster already exists at:

```text
public/images/video-poster.svg
```
