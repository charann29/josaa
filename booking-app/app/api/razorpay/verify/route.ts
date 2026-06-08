import { NextResponse } from "next/server";
import crypto from "crypto";
import { config, assertRazorpayConfigured } from "@/lib/config";
import { issueUnlockToken, UNLOCK_COOKIE } from "@/lib/token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Verifies the Razorpay payment signature. Only on a valid signature do we
// issue the unlock token (set as an httpOnly cookie) that gates the Cal.com step.
export async function POST(request: Request) {
  try {
    assertRazorpayConfigured();

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body ?? {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment fields." },
        { status: 400 }
      );
    }

    // Razorpay signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret)
    const expected = crypto
      .createHmac("sha256", config.razorpay.keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const valid =
      expected.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expected),
        Buffer.from(razorpay_signature)
      );

    if (!valid) {
      return NextResponse.json(
        { error: "Payment verification failed." },
        { status: 400 }
      );
    }

    const token = issueUnlockToken(razorpay_payment_id, razorpay_order_id);

    const res = NextResponse.json({ ok: true });
    res.cookies.set(UNLOCK_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });
    return res;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Verification error.";
    console.error("[razorpay/verify]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
