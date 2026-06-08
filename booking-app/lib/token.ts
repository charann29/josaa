import crypto from "crypto";
import { config } from "./config";

// A small signed token proving a payment was verified server-side.
// Format: base64url(payload).hmac  where payload = { paymentId, orderId, exp }
// This lets the booking step trust that payment really happened, without a DB.

const TTL_MS = 1000 * 60 * 60; // valid for 1 hour after payment

type Payload = {
  paymentId: string;
  orderId: string;
  exp: number;
};

function sign(data: string): string {
  return crypto
    .createHmac("sha256", config.bookingSecret)
    .update(data)
    .digest("base64url");
}

export function issueUnlockToken(paymentId: string, orderId: string): string {
  const payload: Payload = {
    paymentId,
    orderId,
    exp: Date.now() + TTL_MS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifyUnlockToken(token: string | undefined): Payload | null {
  if (!token) return null;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;

  const expected = sign(encoded);
  // Constant-time comparison.
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as Payload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const UNLOCK_COOKIE = "bw_booking_unlock";
