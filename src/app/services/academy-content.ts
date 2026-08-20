import { Injectable } from '@angular/core';
import { ACADEMY, INSTRUCTORS } from '../data/academy.data';

export interface NavItem {
  path: string;
  label: string;
  exact?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AcademyContentService {
  readonly academy = ACADEMY;
  readonly instructors = INSTRUCTORS;

  readonly publicNav: NavItem[] = [
    { path: '/', label: 'الرئيسية', exact: true },
    { path: '/courses', label: 'المواد' },
    { path: '/about', label: 'عن الأكاديمية' },
    { path: '/certificate', label: 'تحقق الشهادة' },
    { path: '/contact', label: 'اتصل بنا' },
  ];

  readonly teacherNav: NavItem[] = [
    { path: '/teacher', label: 'نظرة عامة', exact: true },
    { path: '/teacher/courses', label: 'المواد' },
    { path: '/teacher/students', label: 'الطلاب' },
    { path: '/teacher/grades', label: 'رصد الدرجات' },
  ];

  readonly teacherEyebrow = 'لوحة المهندس إسلام إمام';
  readonly studentEyebrow = 'حساب الطالب';
}
