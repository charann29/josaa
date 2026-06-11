// Central site config. Edit these before launch.

export const SITE = {
  url: 'https://www.beingwise.in',          // EDIT: real production domain
  name: 'BeingWise',
  legalName: 'BeingWise',
  tagline: 'From your rank to the right seat.',
  description:
    'BeingWise builds the exact ordered web-options list you should freeze for TS EAMCET, AP EAPCET and JoSAA — a free rank check plus a Decision Copilot that flags every mistake before you lock. Paid by you, never by colleges; no spam, no guaranteed-seat lies.',
  defaultOgImage: '/og-default.png',
  twitter: '@beingwise',
  locale: 'en_IN',
};

// Conversion + contact links. playbook/call/whatsapp point at /contact until
// real Razorpay/WhatsApp links exist, so the site never ships a dead CTA.
export const LINKS = {
  playbook: '/contact',   // TODO: ₹249 Razorpay payment link
  call: '/contact',       // TODO: ₹2,999 calendar → Razorpay
  whatsapp: '/contact',   // TODO: https://wa.me/<real number>
  email: 'mailto:hello@beingwise.in',
};

// Displayed CTA prices (new self-serve product model).
export const PRICES = {
  plan: '₹799',          // Your plan + Copilot (do-it-yourself, guided)
  doneForYou: '₹3,999',  // We enter the options for you; you review & freeze
};

// Entity- and tool-first (like Careers360/Shiksha) — NOT a content-type dump.
// Content (articles/Q&A) lives under Guides + topic hubs + search, not in the navbar.
// Grouped nav. Flat items render as links; items with `children` render as a dropdown.
export const NAV = [
  {
    label: 'Free Tools',
    href: '/tools',
    children: [
      { label: 'JoSAA College Predictor', href: '/predictor', tag: 'Predictor' },
      { label: 'TG EAPCET Predictor', href: '/tools/tg-eapcet-predictor', tag: 'Predictor' },
      { label: 'TG ECET Predictor', href: '/tools/tg-ecet-predictor', tag: 'Predictor' },
      { label: 'TG EAPCET Allotments', href: '/tools/tg-eapcet-allotments', tag: 'Allotments' },
      { label: 'TG ECET Allotments', href: '/tools/tg-ecet-allotments', tag: 'Allotments' },
      { label: 'TG College Directory', href: '/tools/tg-college-directory', tag: 'Directory' },
      { label: 'TG Top Engineering Colleges', href: '/tools/tg-engineering-colleges', tag: 'Rankings' },
      { label: 'Reservation Policy Guide', href: '/tools/reservation-policy', tag: 'Reference' },
    ],
  },
  {
    label: 'AP Tools',
    href: '/tools/ap',
    children: [
      { label: 'AP EAPCET Predictor', href: '/tools/ap-eapcet-predictor', tag: 'Predictor' },
      { label: 'AP EAPCET Allotments', href: '/tools/ap-eapcet-allotments', tag: 'Allotments' },
      { label: 'AP Top B.Tech Colleges', href: '/tools/ap-engineering-colleges', tag: 'Rankings' },
    ],
  },
  { label: 'Colleges', href: '/colleges' },
  { label: 'Exams', href: '/exams' },
  { label: 'Guides', href: '/blog' },
];
