"use client";

import { useCallback, useEffect, useState } from "react";
import CalEmbed from "./CalEmbed";

type Props = {
  alreadyPaid: boolean;
  amountLabel: string;
  calLink: string;
};

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

// Minimal typing for the Razorpay checkout global injected by their script.
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: (e: unknown) => void) => void;
    };
  }
}

const RZP_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function BookingFlow({
  alreadyPaid,
  amountLabel,
  calLink,
}: Props) {
  const [paid, setPaid] = useState(alreadyPaid);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-load the Razorpay checkout script so the button responds instantly.
  useEffect(() => {
    if (!paid) loadScript(RZP_SCRIPT);
  }, [paid]);

  const startPayment = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const ok = await loadScript(RZP_SCRIPT);
      if (!ok || !window.Razorpay) {
        throw new Error("Could not load the payment window. Check your connection.");
      }

      // 1. Create an order on the server (amount is fixed server-side).
      const orderRes = await fetch("/api/razorpay/order", { method: "POST" });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.error || "Could not start payment.");

      // 2. Open Razorpay checkout.
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "BeingWise",
        description: "1-hour expert call",
        order_id: order.orderId,
        theme: { color: "#e0972f" },
        handler: async (response: RazorpayResponse) => {
          try {
            // 3. Verify the signature on the server.
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const result = await verifyRes.json();
            if (!verifyRes.ok || !result.ok) {
              throw new Error(result.error || "Payment could not be verified.");
            }
            // 4. Unlock the booking step.
            setPaid(true);
            setError(null);
          } catch (e) {
            setError(
              e instanceof Error
                ? e.message
                : "Payment verification failed. If money was deducted, contact us."
            );
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.on("payment.failed", (e: unknown) => {
        const desc =
          (e as { error?: { description?: string } })?.error?.description ??
          "Payment failed. Please try again.";
        setError(desc);
        setLoading(false);
      });

      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  }, []);

  // ---------- BOOKING STEP (after payment) ----------
  if (paid) {
    return (
      <div className="card">
        <div className="steps">
          <div className="step done">
            <span className="num">✓</span> Payment
          </div>
          <div className="step active">
            <span className="num">2</span> Pick a slot
          </div>
        </div>

        <div className="banner banner-ok">
          <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Payment received. Choose a time below — your call is confirmed once you book.
        </div>

        <h1 className="serif">Pick your slot</h1>
        <p className="sub">
          Select a time that works for you. You&apos;ll get a calendar invite with
          the meeting link by email.
        </p>

        <div style={{ marginTop: 22 }}>
          <CalEmbed calLink={calLink} />
        </div>
      </div>
    );
  }

  // ---------- PAYMENT STEP ----------
  return (
    <div className="card">
      <div className="steps">
        <div className="step active">
          <span className="num">1</span> Payment
        </div>
        <div className="step">
          <span className="num">2</span> Pick a slot
        </div>
      </div>

      <span className="eyebrow">
        <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M3 9h18M8 2v4M16 2v4" />
        </svg>
        1-hour expert call
      </span>

      <h1 className="serif">
        Book your <em>1-hour call</em> with a JoSAA expert
      </h1>
      <p className="sub">
        We build your choice list with you, review it before you lock, and answer
        your specific questions — live, on a call.
      </p>

      <div className="price">
        <span className="rs serif">{amountLabel}</span>
        <span className="per">for the full hour</span>
      </div>

      <ul className="features">
        <li>
          <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          A real human expert, one-on-one for a full hour
        </li>
        <li>
          <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Your choice list built and ordered using official 2023–2026 closing ranks
        </li>
        <li>
          <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          A final review before you lock your choices
        </li>
        <li>
          <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Pick any slot that suits you — right after payment
        </li>
      </ul>

      {error && (
        <div className="banner banner-err">
          <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5M12 16h.01" />
          </svg>
          {error}
        </div>
      )}

      <button
        className="btn btn-amber btn-block"
        onClick={startPayment}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner" /> Opening secure payment…
          </>
        ) : (
          <>Pay {amountLabel} &amp; choose a slot</>
        )}
      </button>

      <p className="note">
        Payments are processed securely by Razorpay. You&apos;ll choose your call
        slot immediately after payment.
      </p>
    </div>
  );
}
