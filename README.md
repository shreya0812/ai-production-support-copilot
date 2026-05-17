# AI Production Support Copilot

Live Demo: https://ai-production-support-copilot.vercel.app/

GitHub Repository: https://github.com/shreya0812/ai-production-support-copilot


A production-support focused AI engineering project that helps analyze application logs, detect repeated failures, identify affected services/endpoints, and generate debugging insights.

## 1: Log Error Analyzer

Implemented a rule-based log analyzer using Next.js, TypeScript, and API routes.

### Features
- Paste application logs
- Detect ERROR and WARN logs
- Count timeouts, failures, and exceptions
- Extract affected services
- Extract failed API endpoints
- Extract IDs such as order_id, userId, and payment_id
- Detect repeated log messages
- Generate suggested debugging actions

## Tech Stack
- Next.js
- TypeScript
- Tailwind CSS
- Vercel

## Planned Features
- RAG-based similar incident search
- Supabase PostgreSQL and pgvector
- Gemini API-powered RCA summary
- Agent-style root cause analysis workflow

----
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
