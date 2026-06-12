import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { config, assertRazorpayConfigured } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Creates a Razorpay order for the fixed ₹2,999 call fee.
// The amount is decided server-side so the client can't tamper with it.
export async function POST() {
  try {
    assertRazorpayConfigured();

    const razorpay = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });

    const receipt = `call_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: config.amountPaise,
      currency: config.currency,
      receipt,
      notes: { product: "1-hour expert call" },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: config.razorpay.keyId,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not create order.";
    console.error("[razorpay/order]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
