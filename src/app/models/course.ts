export type CourseType = 'recorded' | 'online' | 'in-person';
export type CourseCategory = 'math' | 'stats' | 'mental' | 'vedic' | 'thinking';

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  categoryLabel: string;
  type: CourseType;
  typeLabel: string;
  instructor: string;
  price: number;
  duration: string;
  date: string;
  students: number;
  rating: number;
  lessons: number;
  description: string;
  outcomes: string[];
  featured?: boolean;
}

export interface Instructor {
  name: string;
  role: string;
  bio: string;
}

export const CATEGORIES: { id: CourseCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'كل الدورات' },
  { id: 'math', label: 'الرياضيات' },
  { id: 'stats', label: 'الإحصاء' },
  { id: 'mental', label: 'الحساب الذهني' },
  { id: 'vedic', label: 'الرياضيات الفيدية' },
  { id: 'thinking', label: 'مهارات التفكير' },
];
