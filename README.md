# AI Production Support Copilot

A deployed AI-powered production support tool that analyzes application logs, detects repeated failures, retrieves similar historical incidents using RAG, and generates evidence-backed root cause analysis reports.

## Live Links

Live Demo: https://ai-production-support-copilot.vercel.app/

GitHub Repository: https://github.com/shreya0812/ai-production-support-copilot

## Project Overview

AI Production Support Copilot is a practical AI engineering project built to simulate how software teams can debug production issues faster.

The app allows a user to paste raw application logs and perform three actions:

1. Analyze logs using rule-based parsing
2. Find similar historical incidents using RAG
3. Generate a structured root cause analysis report using an AI workflow

The goal of this project is to show how AI can support real software engineering workflows beyond a basic chatbot.

## Why I Built This

I wanted to build a project that connects AI with backend and production debugging work.

Instead of creating a generic chatbot, this project focuses on a real engineering use case:

- Production log analysis
- Incident pattern detection
- Similar incident retrieval
- Root cause analysis
- Evidence-backed recommendations

This helped me learn how modern AI applications combine deterministic backend logic, vector search, and LLM-powered generation.

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React

### Backend

- Next.js API Routes
- TypeScript
- Server-side request handling

### Database and Vector Search

- Supabase
- PostgreSQL
- pgvector

### AI

- Gemini API
- Gemini embeddings
- Gemini text generation

### Deployment

- Vercel

## Core Features

### 1. Log Error Analyzer

The app accepts raw application logs and extracts useful debugging signals.

It detects:

- Total log lines
- Error count
- Warning count
- Timeout count
- Failure count
- Exception count
- Affected services
- Failed API endpoints
- IDs such as order_id, userId, payment_id
- Repeated log messages
- Suggested debugging actions

Example log:

```txt
2026-05-16 10:12:44 ERROR PaymentService timeout while calling /api/payments
2026-05-16 10:13:01 ERROR PaymentService timeout while calling /api/payments
2026-05-16 10:14:10 WARN Retry attempt failed for order_id=1021
```
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
