# UsageClaw - AI API Usage Dashboard

## Project Overview
A web app that lets users monitor all their AI API subscriptions in one dashboard.
See usage percentages, costs, and whether they're getting value from subscriptions.

## Tech Stack
- React + Vite + TypeScript
- Tailwind CSS for styling
- All API keys stored in localStorage (never sent to any server)
- Pure frontend, zero backend
- Deploy on Vercel (free tier)

## MVP Scope (v1)
Support 3 providers:
1. **OpenAI** - Usage via `/dashboard/billing/usage` API
2. **Anthropic** - Usage via Admin API `/usage`
3. **Google AI** - Usage via Gemini API quota endpoints

## Features
- Add/remove API keys (stored locally in browser)
- Dashboard showing per-provider: usage %, cost, remaining quota
- Visual progress bars and charts
- Dark theme (clean, modern)
- Responsive design

## Design Principles
- Privacy first: nothing leaves the browser
- Clean, minimal UI (no clutter)
- Show actionable info: "You've used 73% of your OpenAI quota"
