# BeingWise — Booking App

A standalone Next.js webapp for the **₹2,999 1-hour call**. The flow is:

1. Visitor lands on the page and sees the offer.
2. They pay **₹2,999 via Razorpay**.
3. The payment signature is **verified server-side**.
4. Only then is the **Cal.com** slot picker revealed so they can book a time.

Designed to match the BeingWise landing page (EB Garamond + Poppins, cream/amber/ink palette).
The existing `Book a 1-hour call — ₹2,999` button on the landing page can later be
pointed at this app's URL.

## How the gating works

- `POST /api/razorpay/order` creates an order with the amount fixed **server-side**
  (the client can't tamper with the price).
- Razorpay Checkout opens in the browser.
- On success, the client sends the payment id/order id/signature to
  `POST /api/razorpay/verify`, which validates the HMAC signature.
- On a valid signature the server sets a short-lived, signed, **httpOnly cookie**
  (`bw_booking_unlock`, valid 1 hour). The Cal.com embed only renders after this.
- On reload within the hour, the server reads the cookie and shows the booking step
  directly (so a refresh doesn't force re-payment).

> Note: the cookie unlocks the *UI*. For hard server-side enforcement of "paid before
> booked", also wire a Cal.com webhook or use Cal.com's paid-event types. This app
> gates the embed, which is the standard pattern for this use case.

## Setup

```bash
cd booking-app
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000.

### Required environment variables

See `.env.example`. You need:

- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — from the Razorpay dashboard.
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` — same key id, for the browser widget.
- `NEXT_PUBLIC_CAL_LINK` — your Cal.com event link, e.g. `beingwise/1-hour-call`.
- `BOOKING_TOKEN_SECRET` — random string for signing the unlock token.

Use Razorpay **test** keys (`rzp_test_…`) while developing. Test card:
`4111 1111 1111 1111`, any future expiry, any CVV.

## Deploy

Deploy to Vercel (or any Node host). Set the same environment variables in the
project settings. Then update the landing page's
`Book a 1-hour call — ₹2,999` link (`CALL_LINK` token in `landing/index.html`)
to this deployment's URL.
