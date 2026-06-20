# Knowlix Deployment Setup Notes

## 1. Create `.env.local`
Copy `.env.example` to `.env.local` and fill in values:

```env
DATABASE_URL=postgresql://<user>:<pass>@<host>/<db>?sslmode=require&channel_binding=require
BETTER_AUTH_SECRET=<strong-random-secret>
APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 2. Neon steps
1. Create a Neon Postgres project.
2. Copy the generated connection URL.
3. Use that value for `DATABASE_URL` in `.env.local`.
4. In Neon SQL editor, run `neon-schema.sql`.

## 3. Local development
Run:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## 4. Production notes
- Do not commit `.env.local`.
- Set the same env vars in your deployment platform.
- Keep `BETTER_AUTH_SECRET` secret.
