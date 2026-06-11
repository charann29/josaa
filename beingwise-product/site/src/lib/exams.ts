export interface Exam {
  slug: string;
  name: string;
  full: string;
  body: string;        // conducting authority
  level: string;       // UG / PG
  stream: string;      // maps to a topic
  for: string;         // what it gets you
  blurb: string;
  predictor: boolean;  // does our JoSAA predictor apply?
  official: string;
  guides?: { label: string; href: string }[];
}

export const EXAMS: Exam[] = [
  {
    slug: 'jee-main', name: 'JEE Main', full: 'Joint Entrance Examination (Main)', body: 'National Testing Agency (NTA)', level: 'UG', stream: 'engineering',
    for: 'B.Tech/B.E. seats at NITs, IIITs, GFTIs (via JoSAA) and the gateway to JEE Advanced',
    blurb: 'India’s biggest engineering entrance. Your JEE Main rank decides your NIT/IIIT/GFTI seat through JoSAA counselling.',
    predictor: true, official: 'https://jeemain.nta.nic.in/',
    guides: [
      { label: 'JoSAA Complete Guide', href: '/blog/josaa-counselling-2026-complete-guide' },
      { label: 'Choice Filling Order', href: '/blog/josaa-choice-filling-order-2026' },
      { label: 'Percentile vs Rank', href: '/blog/percentile-vs-rank-jee-main' },
    ],
  },
  {
    slug: 'jee-advanced', name: 'JEE Advanced', full: 'Joint Entrance Examination (Advanced)', body: 'IITs (rotating)', level: 'UG', stream: 'engineering',
    for: 'B.Tech seats at the 23 IITs',
    blurb: 'Taken by top JEE Main qualifiers; your JEE Advanced rank decides your IIT seat through JoSAA.',
    predictor: false, official: 'https://jeeadv.ac.in/',
    guides: [{ label: 'JoSAA Complete Guide', href: '/blog/josaa-counselling-2026-complete-guide' }, { label: 'Branch vs College', href: '/blog/branch-vs-college-jee' }],
  },
  {
    slug: 'neet-ug', name: 'NEET UG', full: 'National Eligibility cum Entrance Test (UG)', body: 'National Testing Agency (NTA)', level: 'UG', stream: 'medical',
    for: 'MBBS, BDS, AYUSH and other medical seats across India',
    blurb: 'The single entrance for medical UG admissions in India; counselling runs through MCC (All-India) and state authorities.',
    predictor: false, official: 'https://neet.nta.nic.in/',
  },
  {
    slug: 'ts-eamcet', name: 'TS EAMCET', full: 'Telangana State Engineering, Agriculture & Medical Common Entrance Test', body: 'JNTU Hyderabad', level: 'UG', stream: 'engineering',
    for: 'Engineering, agriculture and pharmacy seats in Telangana',
    blurb: 'Telangana’s state engineering entrance; rank decides seats in Telangana colleges via state counselling.',
    predictor: false, official: 'https://eapcet.tsche.ac.in/',
  },
  {
    slug: 'ap-eapcet', name: 'AP EAPCET', full: 'Andhra Pradesh Engineering, Agriculture & Pharmacy Common Entrance Test', body: 'JNTU Kakinada', level: 'UG', stream: 'engineering',
    for: 'Engineering, agriculture and pharmacy seats in Andhra Pradesh',
    blurb: 'Andhra Pradesh’s state engineering entrance; rank decides seats in AP colleges via state counselling.',
    predictor: false, official: 'https://cets.apsche.ap.gov.in/',
  },
  {
    slug: 'cat', name: 'CAT', full: 'Common Admission Test', body: 'IIMs', level: 'PG', stream: 'management',
    for: 'MBA/PGP seats at the IIMs and top B-schools',
    blurb: 'The premier MBA entrance; your CAT percentile drives shortlisting at IIMs and leading business schools.',
    predictor: false, official: 'https://iimcat.ac.in/',
  },
  {
    slug: 'clat', name: 'CLAT', full: 'Common Law Admission Test', body: 'Consortium of National Law Universities', level: 'UG', stream: 'law',
    for: 'BA LLB and other law seats at the National Law Universities',
    blurb: 'The entrance for the NLUs; your CLAT rank decides your law-school seat.',
    predictor: false, official: 'https://consortiumofnlus.ac.in/',
  },
  {
    slug: 'gate', name: 'GATE', full: 'Graduate Aptitude Test in Engineering', body: 'IISc & IITs', level: 'PG', stream: 'engineering',
    for: 'M.Tech admissions and PSU recruitment',
    blurb: 'The gateway to M.Tech at IITs/NITs and to many PSU jobs.',
    predictor: false, official: 'https://gate.iitb.ac.in/',
  },
  {
    slug: 'bitsat', name: 'BITSAT', full: 'BITS Admission Test', body: 'BITS Pilani', level: 'UG', stream: 'engineering',
    for: 'B.E. seats at BITS Pilani, Goa and Hyderabad',
    blurb: 'The entrance for BITS campuses; admission is purely on your BITSAT score.',
    predictor: false, official: 'https://www.bitsadmission.com/',
  },
  {
    slug: 'mht-cet', name: 'MHT CET', full: 'Maharashtra Common Entrance Test', body: 'State CET Cell, Maharashtra', level: 'UG', stream: 'engineering',
    for: 'Engineering and pharmacy seats in Maharashtra',
    blurb: 'Maharashtra’s state engineering entrance; rank decides seats via state counselling.',
    predictor: false, official: 'https://cetcell.mahacet.org/',
  },
];

export const examBySlug = (s: string) => EXAMS.find((e) => e.slug === s);
