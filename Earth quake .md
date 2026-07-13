# SSGPT6 Global Resilience Simulator & Livestream Platform — MVP

A deployable FastAPI MVP with:

- Live observed earthquake map using the official USGS 24-hour GeoJSON feed
- Clearly separated illustrative scenario simulator
- Stripe Checkout annual subscription scaffold for a USD 25,000/year Price
- Verified, idempotent Stripe webhook handling
- License-entitlement store interface and restricted portal
- Renewal/payment-failure workflow hooks
- 140-language registry and translation-provider interface disclosure
- Browser voice-command support
- WCAG-oriented keyboard, focus, contrast, screen-reader, and reduced-motion features
- WebAuthn/passkey biometric architecture guidance (no facial image storage)
- Draft legal, NDA, privacy, safety, and security templates

## Important boundaries

This is functional MVP source code, not a finished certified government system. It does not implement an actual FNO/PINO model, satellite link, emergency command authority, production identity provider, certified translations, or production database. The simulator is intentionally labeled illustrative.

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Open `http://localhost:8000`.

## Configure Stripe

1. In Stripe, create a Product and a recurring annual Price for **USD 25,000**.
2. Put the test secret key, publishable key, and Price ID in `.env`.
3. Register `POST /api/stripe/webhook` as the webhook endpoint.
4. Subscribe at minimum to:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `invoice.payment_action_required`
5. Put the signing secret in `STRIPE_WEBHOOK_SECRET`.
6. Test with Stripe CLI before any live transaction.
7. Configure Stripe Billing revenue recovery/Smart Retries and customer communications only after counsel and procurement review.

## Production replacements required

- Replace in-memory license/event storage with PostgreSQL plus migrations and encrypted backups.
- Add a queue for webhook/email processing.
- Add government SSO (OIDC/SAML), WebAuthn/FIDO2, device posture, and administrator approval.
- Add RBAC/ABAC policy enforcement and immutable audit logs.
- Add a reviewed localization pipeline with professional translations.
- Add invoice/wire/ACH procurement flows and manual contracting workflow; do not assume all governments can use card checkout or auto-renewal.
- Add sovereign hosting, data residency, key ownership, and tenant isolation.
- Conduct legal review, security assessment, accessibility audit, model validation, and emergency-management review.
- Use official alerting authorities for life-safety notifications.

## Suggested production architecture

CDN/WAF → API Gateway → FastAPI services → PostgreSQL/Redis/Queue → Identity Provider → Stripe Billing → Notification Provider → Audit/SIEM

Hazard data adapters should be isolated from model outputs. Every UI element must visibly identify its provenance: **Observed**, **Official Alert**, **Model Estimate**, or **Simulation**.
