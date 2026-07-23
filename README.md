# SSGPT6 Universal Quantum AI Automation Platform MVP

This repository now presents a static MVP for transforming `earthquake.ssgpt6.com` into a broader SSGPT6 platform experience.

## What the MVP includes

- Unified homepage dashboard for the Trading Hub Module, Secure Gateway, and SSGPT6 Quantum AI Workstation™
- Operating-system overview for Financial OS™, Creator OS™, Learning OS™, and Research OS™
- Browser-based accessibility demo using:
  - Web Speech API (voice recognition + speech synthesis)
  - Geolocation API for GPS context
  - `navigator.vibrate()` for haptic alerts on supported devices
- Chicago navigation pilot messaging with landmark-based route announcements
- Improved accessibility with skip links, focus-visible states, ARIA live regions, and labeled form controls

## Project pages

- **Home** – platform dashboard and live browser demo
- **Architecture** – Secure Gateway, workstation, and production stack overview
- **Resources** – implementation priorities, suggested backend objects, and pilot integrations
- **Contact** – rollout intake form for platform onboarding requests

## Local preview

Open `index.html` directly in a browser, or serve the repository with a simple static server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Production direction

The requested long-term architecture is represented in the content and UI, with these future implementation layers called out explicitly:

- Next.js + TypeScript frontend
- Express or Next.js API backend
- PostgreSQL persistence for users, sessions, modules, transactions, and navigation logs
- Redis for caching and real-time signals
- GitHub Actions and containerized deployment workflows

## Live website

https://earthquake.ssgpt6.com/
