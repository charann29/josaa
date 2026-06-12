// Centralised, server-side config. Values come from environment variables.
// See .env.example for the full list.

export const config = {
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID ?? "",
    keySecret: process.env.RAZORPAY_KEY_SECRET ?? "",
  },
  // Amount is in the smallest currency unit (paise). ₹2,999 = 299900 paise.
  amountPaise: Number(process.env.BOOKING_AMOUNT_PAISE ?? "299900"),
  currency: process.env.BOOKING_CURRENCY ?? "INR",
  // Secret used to sign the short-lived "payment unlocked" token (HMAC).
  // Falls back to the Razorpay secret if not separately provided.
  bookingSecret:
    process.env.BOOKING_TOKEN_SECRET ??
    process.env.RAZORPAY_KEY_SECRET ??
    "dev-insecure-secret",
};

export function assertRazorpayConfigured() {
  if (!config.razorpay.keyId || !config.razorpay.keySecret) {
    throw new Error(
      "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
    );
  }
}

// Public (client-exposed) config.
export const publicConfig = {
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
  // Cal.com link, e.g. "beingwise/1-hour-call"
  calLink: process.env.NEXT_PUBLIC_CAL_LINK ?? "",
  amountLabel: process.env.NEXT_PUBLIC_AMOUNT_LABEL ?? "₹2,999",
};
