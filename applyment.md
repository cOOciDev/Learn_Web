# Applyment / GitHub Pages Deployment

Use this guide to publish the mailto-only COOci Dev Academy page.

## 1. Set The Destination Email

Open `index.html` and edit:

```html
<meta name="cooci-contact-email" content="YOUR_EMAIL_ADDRESS" />
```

Example:

```html
<meta name="cooci-contact-email" content="academy@example.com" />
```

## 2. Check There Is No Backend Requirement

This project should not require:

```text
Node.js
Vercel
Cloudflare
Railway
Render
.env
Telegram token
Gmail password
API key
```

The form is handled by:

```text
assets/js/form-mailto.js
```

## 3. Preview Locally

Run any static server:

```powershell
python -m http.server 8080
```

Open:

```text
http://localhost:8080/
```

Test the form:

1. Fill required fields.
2. Click the submit button.
3. Confirm your email app opens.
4. Confirm the generated email body is readable.
5. If the email app does not open, confirm the fallback modal copy buttons work.

## 4. Commit And Push

```powershell
git add .
git commit -m "Deploy static mailto contact form"
git branch -M main
git push -u origin main
```

If the remote is missing:

```powershell
git remote add origin https://github.com/cOOciDev/Learn_Web.git
git push -u origin main
```

## 5. Enable GitHub Pages

In GitHub:

1. Open `https://github.com/cOOciDev/Learn_Web`.
2. Go to `Settings`.
3. Go to `Pages`.
4. Choose `GitHub Actions` as the source.
5. Open the `Actions` tab.
6. Run `Deploy static content to Pages`.

Expected URL:

```text
https://coocidev.github.io/Learn_Web/
```

## 6. Final Production Test

On the GitHub Pages URL:

1. Test the Persian form.
2. Switch language and test the English form.
3. Submit a test request.
4. Confirm the default email client opens.
5. Confirm the destination email is correct.
6. Confirm copy fallback works on mobile and desktop.

## 7. Important Limitations

With `mailto:`, the website cannot send email by itself. The user's email app must open, and the user must manually click Send.

This is intentional for a backend-free GitHub Pages deployment.
