// Authoritative official sources per topic. Used to add real citations
// (E-E-A-T) to pages — fixed list, never model-generated (no hallucinated URLs).
export interface Source { name: string; url: string }

const ENGINEERING: Source[] = [
  { name: 'JoSAA (official seat allocation)', url: 'https://josaa.nic.in/' },
  { name: 'CSAB special rounds', url: 'https://csab.nic.in/' },
  { name: 'JEE Main — NTA', url: 'https://jeemain.nta.nic.in/' },
  { name: 'NIRF rankings (Govt. of India)', url: 'https://www.nirfindia.org/' },
];
const MEDICAL: Source[] = [
  { name: 'NEET — NTA', url: 'https://neet.nta.nic.in/' },
  { name: 'MCC (medical counselling)', url: 'https://mcc.nic.in/' },
  { name: 'National Medical Commission', url: 'https://www.nmc.org.in/' },
  { name: 'NIRF rankings', url: 'https://www.nirfindia.org/' },
];
const MANAGEMENT: Source[] = [
  { name: 'CAT — IIMs', url: 'https://iimcat.ac.in/' },
  { name: 'AICTE', url: 'https://www.aicte-india.org/' },
  { name: 'NIRF rankings', url: 'https://www.nirfindia.org/' },
];
const LAW: Source[] = [
  { name: 'CLAT — Consortium of NLUs', url: 'https://consortiumofnlus.ac.in/' },
  { name: 'Bar Council of India', url: 'https://www.barcouncilofindia.org/' },
  { name: 'NIRF rankings', url: 'https://www.nirfindia.org/' },
];
const EXAMS: Source[] = [
  { name: 'National Testing Agency (NTA)', url: 'https://www.nta.ac.in/' },
  { name: 'NIRF rankings', url: 'https://www.nirfindia.org/' },
];
const GENERIC: Source[] = [
  { name: 'NIRF rankings (Govt. of India)', url: 'https://www.nirfindia.org/' },
  { name: 'University Grants Commission (UGC)', url: 'https://www.ugc.gov.in/' },
  { name: 'AICTE', url: 'https://www.aicte-india.org/' },
];

const MAP: Record<string, Source[]> = {
  engineering: ENGINEERING,
  medical: MEDICAL,
  management: MANAGEMENT,
  law: LAW,
  exams: EXAMS,
  'design-architecture': GENERIC,
  'commerce-finance': GENERIC,
  science: GENERIC,
  careers: GENERIC,
  'study-abroad': GENERIC,
  'study-guides': GENERIC,
};

export function sourcesFor(topic?: string, website?: string): Source[] {
  const base = (topic && MAP[topic]) || GENERIC;
  const out = [...base];
  if (website && /^https?:\/\//i.test(website) && !/shiksha|careers ?360/i.test(website)) {
    out.unshift({ name: 'Official college website', url: website });
  }
  return out.slice(0, 5);
}
