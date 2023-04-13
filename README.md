This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `*.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Netlify

We use [Netlify](https://www.netlify.com/) to deploy our app. It is free for all open-source projects.

## Database backup

We have scheduled monthly backups of our database using AWS Lambda.

1. Use [pgdump-aws-lambda](https://github.com/jameshy/pgdump-aws-lambda) to generate Lambda .zip
2. Create necessary secrets in Secrets Manager
3. Create s3 bucket for backups
4. Create Lambda using the generated .zip
5. Create a trigger with EventBridge
6. Make sure the resources have permissions to access each other

## Edge function deploy
1. Install supabase with brew install `supabase/tap/supabase`
2. Init supabase within repo with `supabase init`
3. `supabase login`
4. `supabase link --project-ref ***` (za ovo treba podesiti config.toml file da ima iste vrednosti kao supabase, ports, etc…)
5. `deploy edge function(supabase functions deploy hello-world --project-ref ***)`
Reference: https://supabase.com/docs/reference/cli/supabase-init
