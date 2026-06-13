# COOci Dev Academy

Static GitHub Pages contact and course request page.

The form uses a pure client-side `mailto:` workflow. There is no backend, no API endpoint, no Telegram bot, no Gmail password, no `.env`, and no Node.js requirement for deployment.

## How The Form Works

1. The user fills the form.
2. JavaScript validates required fields.
3. JavaScript creates a formatted email subject and body.
4. The browser opens the user's default email client with `mailto:`.
5. The user reviews or edits the email.
6. The user manually clicks Send.

If the email client does not open, the fallback modal lets the user copy:

- destination email address
- prepared email message

## Configure Destination Email

Edit `index.html`:

```html
<meta name="cooci-contact-email" content="YOUR_EMAIL_ADDRESS" />
```

Replace `YOUR_EMAIL_ADDRESS` with the real destination address, for example:

```html
<meta name="cooci-contact-email" content="academy@example.com" />
```

This address is public because it is part of the static website. Do not put passwords, tokens, private chat IDs, or API keys in this project.

## Project Structure

```text
index.html                  Main GitHub Pages entry point
assets/css/                 Styles
assets/js/app.js            Main frontend app
assets/js/form-mailto.js    Client-side mailto form workflow
assets/i18n/                Persian and English translations
public/                     Images, icons, fonts, and 3D model
.github/workflows/static.yml GitHub Pages deployment workflow
.nojekyll                   Keeps GitHub Pages from processing assets with Jekyll
```

## Local Preview

Use any static file server. Examples:

```powershell
python -m http.server 8080
```

Then open:

```text
http://localhost:8080/
```

You can also use VS Code Live Server.

## Deploy To GitHub Pages

1. Commit the static project:

```powershell
git add .
git commit -m "Use client-side mailto contact form"
git push
```

2. In GitHub, open the repository settings.
3. Go to `Pages`.
4. Set `Build and deployment` to `GitHub Actions`.
5. Run the `Deploy static content to Pages` workflow.

Production URL:

```text
https://coocidev.github.io/Learn_Web/
```

## Security Notes

This project must not contain:

```text
.env
Telegram bot token
Telegram private chat ID
Gmail app password
SMTP credentials
API keys
node_modules/
```

The contact email is public by design. If you need private notifications, use a backend in a separate private service, but this version intentionally does not use one.
