import { cookies } from "next/headers";
import BookingFlow from "@/components/BookingFlow";
import { verifyUnlockToken, UNLOCK_COOKIE } from "@/lib/token";
import { publicConfig } from "@/lib/config";

export default async function Page() {
  // If the visitor already has a valid unlock token (paid within the last hour),
  // skip straight to the booking step on load.
  const store = await cookies();
  const token = store.get(UNLOCK_COOKIE)?.value;
  const alreadyPaid = verifyUnlockToken(token) !== null;

  return (
    <div className="page">
      <nav>
        <div className="wrap nav-in">
          <a href="/" className="brand">
            <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3l8 4v5c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V7l8-4z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            BeingWise
          </a>
          <span className="nav-secure">
            <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="11" width="16" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            Secure payment
          </span>
        </div>
      </nav>

      <main className="page-main">
        <div className="wrap">
          <BookingFlow
            alreadyPaid={alreadyPaid}
            amountLabel={publicConfig.amountLabel}
            calLink={publicConfig.calLink}
          />
        </div>
      </main>

      <footer>
        <div className="wrap">
          BeingWise · Payments secured by Razorpay · Scheduling by Cal.com
        </div>
      </footer>
    </div>
  );
}
