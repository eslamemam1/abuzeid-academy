export type UserRole = 'teacher' | 'student';
export type YearLevel = 'year1' | 'year2';
export type CourseCategory = 'programming' | 'ai';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  phone: string | null;
  year_level: YearLevel | null;
  email: string | null;
  created_at: string;
}

export interface DbCourse {
  id: string;
  slug: string;
  title: string;
  category: CourseCategory;
  year_level: YearLevel;
  description: string | null;
  instructor: string;
  price: number;
  duration: string;
  course_date: string;
  students: number;
  rating: number;
  lessons: number;
  featured: boolean;
  outcomes: string[];
  course_type: 'recorded' | 'online' | 'in-person';
  track?: string | null;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  status: 'pending' | 'active' | 'completed';
  created_at: string;
  courses?: DbCourse;
  profiles?: Profile;
}

export interface Exam {
  id: string;
  course_id: string;
  title: string;
  exam_date: string | null;
  total_marks: number;
  courses?: DbCourse;
}

export interface Grade {
  id: string;
  exam_id: string;
  student_id: string;
  score: number | null;
  notes: string | null;
  exams?: Exam;
  profiles?: Profile;
}
