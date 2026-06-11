export const TOPIC_LABELS: Record<string, string> = {
  engineering: 'Engineering & JEE',
  medical: 'Medical & NEET',
  management: 'MBA & Management',
  'study-abroad': 'Study Abroad',
  law: 'Law',
  'design-architecture': 'Design & Architecture',
  'commerce-finance': 'Commerce & Finance',
  science: 'Science',
  exams: 'Entrance Exams',
  careers: 'Careers & Jobs',
  'study-guides': 'Study Guides',
};

export function topicLabel(slug: string): string {
  return TOPIC_LABELS[slug] ?? slug.replace(/-/g, ' ');
}
