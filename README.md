# Portify — Personal Portfolio Builder

A responsive React + Vite project inspired by modern Dribbble portfolio layouts. It includes a user module, admin module, local-storage authentication, three portfolio templates, a portfolio editor, and a preview page.

## Requirements
- Node.js 20.19+ or 22.12+
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

## Modules and demo flow

### User module
1. Open **Sign up** and create an account.
2. Log in with that account.
3. Open Dashboard → Edit portfolio.
4. Update personal details, skills, education, projects, links, and choose one of the three templates.
5. Save changes and open Preview.

### Admin module
- Demo email: `admin@portify.com`
- Demo password: `admin123`
- Admin can see registered users, add templates, and delete templates.

## Local Storage keys
- `portify_users` — registered demo accounts
- `portify_session` — current demo session
- `portify_portfolio` — portfolio profile and selected template
- `portify_templates` — template library

**Important security note:** Local Storage authentication is suitable only for a classroom demonstration. Passwords are stored in the browser and this is not production-grade authentication. A real public service should use a backend and securely hashed passwords.

## Deploy to Vercel
1. Create a GitHub repository and push this project.
2. In Vercel, choose **Add New → Project** and import the GitHub repository.
3. Framework preset: **Vite** (usually auto-detected).
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**.
7. Test signup, login, template selection, editor, preview, and admin features on the deployed URL.

For a frontend-only Vite app, client-side routes may need a rewrite. If a deployed route such as `/dashboard` returns 404 on refresh, add `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```
