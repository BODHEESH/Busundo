# Staging setup runbook

Staging is a copy of production set up for testing before launch. It uses its own database and test data, never the production database.

## 1. Database (MongoDB Atlas)

1. Create a cluster named `busundo-staging`. The free tier is enough for testing.
2. Create a database user with read and write access to the `Busundo` database only. Save the password in a password manager.
3. Network access: allow Vercel's servers. Atlas can't limit this to fixed IPs on the free tier, so use `0.0.0.0/0` and protect the database with the user password.
4. Copy the connection string and put it in `MONGODB_URI`, replacing the password placeholder.

## 2. Hosting (Vercel)

1. Import the GitHub repository and set the production branch to `main`.
2. Add these environment variables for the **Preview** and **Production** environments (see `.env.example`):

| Variable | Staging value | Notes |
|---|---|---|
| `MONGODB_URI` | staging connection string | Never the production database |
| `NEXTAUTH_SECRET` | new random value | `openssl rand -base64 32`. Don't reuse it across environments |
| `NEXTAUTH_URL` | the staging URL | Must match the domain exactly |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | from your mail account | Use an app password, not your normal password |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | optional | Only if Google sign-in is wanted |

`ENABLE_MOCK_LOGIN` should not be set on any hosted environment. Test accounts are already off in production builds.

## 3. Test data

Seed the staging database once, from your own machine, with the staging `MONGODB_URI` in `.env.local`:

```
npm run seed:all
```

Do not run the seed scripts against the production database.

## 4. Smoke test

After every deploy to staging:

```
BASE_URL=https://your-staging-url npm run smoke
```

The script is read-only. It checks that:
- the health endpoint reports the database as reachable,
- search returns results in the expected shape,
- admin and submission endpoints refuse anonymous requests,
- the diagnostic database endpoint is hidden.

All checks should pass before anything is shared with testers.

## 5. Monitoring

Point an uptime monitor (for example, UptimeRobot) at `/api/health`. It returns 200 when the database is reachable and 503 when it isn't.
