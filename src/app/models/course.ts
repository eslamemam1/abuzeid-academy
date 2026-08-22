export type CourseType = 'recorded' | 'online' | 'in-person';
export type CourseCategory = 'programming' | 'ai';
export type CourseLevel = 'year1' | 'year2';
export type CourseFilter = 'all' | CourseCategory | CourseLevel | 'basics';

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  categoryLabel: string;
  level: CourseLevel;
  levelLabel: string;
  track: CourseFilter;
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
  videoUrl?: string | null;
  isFree: boolean;
}

export interface Instructor {
  name: string;
  role: string;
  bio: string;
}

export const FILTERS: { id: CourseFilter; label: string }[] = [
  { id: 'all', label: 'كل المواد' },
  { id: 'basics', label: 'مفاهيم أساسية' },
  { id: 'year1', label: 'الصف الأول الثانوي' },
  { id: 'year2', label: 'الصف الثاني الثانوي' },
  { id: 'programming', label: 'البرمجة' },
  { id: 'ai', label: 'الذكاء الاصطناعي' },
];
