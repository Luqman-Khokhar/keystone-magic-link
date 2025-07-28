# 🔐 Keystone 6 Magic Auth Login / (Use - AuthRemoved - Branch)

This project implements **passwordless login** using **Magic Link Authentication** with [Keystone 6](https://keystonejs.com/).  
Users enter their email and receive a secure link to log in — no passwords required! ✨

---

## 📦 Tech Stack & Libraries

This repo uses the following key libraries:

```json
{
  "@apollo/client": "^3.13.8",
  "@keystone-6/auth": "^8.0.0",
  "@keystone-6/core": "^6.5.1",
  "@keystone-6/fields-document": "^9.0.0",
  "@prisma/client": "^5.22.0",
  "@types/nodemailer": "^6.4.17",
  "dotenv": "^17.2.1",
  "nodemailer": "^7.0.5",
  "prisma": "^5.22.0",
  "typescript": "^5.5.0"
}

🧪 Magic Link Login Flow
📧 User enters email on the /login page

🔗 Keystone sends a magic login link to the email

🌐 User clicks the link (e.g. /magicLogin?token=...&email=...)

🔓 The app redeems the token via GraphQL

✅ Session is created, and user is logged in!

✨ Core GraphQL Mutations
🔐 sendUserMagicAuthLink
Sends a login email if the user exists.
🔑 redeemUserMagicAuthToken
Redeems the magic link token.


⚙️ Scripts
npm run dev      # Start Keystone dev server
npm run build    # Build the app

🔧 Environment Variables
Create a .env file with:
SESSION_SECRET=your-session-secret
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password-or-app-password
