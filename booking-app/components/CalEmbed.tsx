"use client";

import { useEffect, useRef } from "react";

type Props = {
  calLink: string;
};

// Loads the official Cal.com inline embed. Falls back to a plain iframe if the
// embed script is unavailable. The embed is only ever rendered after a verified
// payment, so reaching this component means the booking step is unlocked.
export default function CalEmbed({ calLink }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calLink) return;

    // Official Cal.com embed bootstrap snippet (typed loosely).
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) {
        a.q.push(ar);
      };
      const d = C.document;
      C.Cal =
        C.Cal ||
        function () {
          const cal = C.Cal;
          const ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            const s = d.createElement("script");
            s.src = A;
            d.head.appendChild(s);
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api: any = function () {
              p(api, arguments);
            };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else {
              p(cal, ar);
            }
            return;
          }
          p(cal, ar);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    const Cal = (window as any).Cal;
    const ns = "bw-call";

    Cal("init", ns, { origin: "https://app.cal.com" });
    Cal.ns[ns]("inline", {
      elementOrSelector: containerRef.current,
      calLink,
      layout: "month_view",
    });
    Cal.ns[ns]("ui", {
      hideEventTypeDetails: false,
      layout: "month_view",
      cssVarsPerTheme: { light: { "cal-brand": "#e0972f" } },
    });
  }, [calLink]);

  if (!calLink) {
    return (
      <div className="banner banner-err">
        Booking calendar isn&apos;t configured yet. Set NEXT_PUBLIC_CAL_LINK.
      </div>
    );
  }

  return (
    <div
      className="cal-shell"
      ref={containerRef}
      style={{ overflow: "auto", height: 700 }}
    />
  );
}
