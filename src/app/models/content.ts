export interface AcademyInfo {
  name: string;
  founder: string;
  founderFull: string;
  location: string;
  system: string;
  tagline: string;
  heroKicker: string;
  heroTitle: string;
  heroLead: string;
  heroCode: string;
  whyTitle: string;
  whyLead: string;
  tracksEyebrow: string;
  tracksTitle: string;
  tracksLead: string;
  labEyebrow: string;
  labTitle: string;
  labLead: string;
  aboutTitle: string;
  faqTitle: string;
  playgroundCode: string;
}

export interface SiteStat {
  value: string;
  label: string;
}

export interface WhyFeature {
  title: string;
  text: string;
}

export interface ClassTrack {
  id: string;
  kicker: string;
  title: string;
  code: string;
  text: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface AboutPill {
  title: string;
  text: string;
}

export function asAbuzeidName(value: string | null | undefined): string {
  return (value ?? '')
    .replaceAll('المهندس إسلام إمام (إسلام أبو زيد)', 'المهندس إسلام أبو زيد')
    .replaceAll('إسلام إمام', 'إسلام أبو زيد');
}

export const EMPTY_ACADEMY: AcademyInfo = {
  name: 'أكاديمية أبو زيد',
  founder: 'م. إسلام أبو زيد',
  founderFull: 'المهندس إسلام أبو زيد',
  location: 'جمهورية مصر العربية',
  system: 'سنوي (بكالوريا)',
  tagline: 'برمجة وذكاء اصطناعي لطلاب السنة الأولى والثانية بكالوريا',
  heroKicker: '',
  heroTitle: '',
  heroLead: '',
  heroCode: '',
  whyTitle: '',
  whyLead: '',
  tracksEyebrow: '',
  tracksTitle: '',
  tracksLead: '',
  labEyebrow: '',
  labTitle: '',
  labLead: '',
  aboutTitle: '',
  faqTitle: '',
  playgroundCode: `console.log('أهلاً بيك في مختبر أكاديمية أبو زيد');
const goal = 'بكالوريا';
console.log('هدفك:', goal);
`,
};
