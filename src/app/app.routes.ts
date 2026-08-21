import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Courses } from './pages/courses/courses';
import { CourseDetail } from './pages/course-detail/course-detail';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';
import { Certificate } from './pages/certificate/certificate';
import { NotFound } from './pages/not-found/not-found';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { StudentDashboard } from './pages/student-dashboard/student-dashboard';
import { TeacherDashboard } from './pages/teacher-dashboard/teacher-dashboard';
import { TeacherStudents } from './pages/teacher-students/teacher-students';
import { TeacherGrades } from './pages/teacher-grades/teacher-grades';
import { TeacherCourses } from './pages/teacher-courses/teacher-courses';
import { TeacherMessages } from './pages/teacher-messages/teacher-messages';
import { authGuard, guestGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home, title: 'أكاديمية أبو زيد | الرئيسية' },
  { path: 'courses', component: Courses, title: 'المواد | أكاديمية أبو زيد' },
  { path: 'courses/:id', component: CourseDetail, title: 'تفاصيل الدورة | أكاديمية أبو زيد' },
  { path: 'about', component: About, title: 'عن الأكاديمية | أكاديمية أبو زيد' },
  { path: 'contact', component: Contact, title: 'اتصل بنا | أكاديمية أبو زيد' },
  { path: 'certificate', component: Certificate, title: 'صلاحية الشهادة | أكاديمية أبو زيد' },
  { path: 'login', component: Login, canActivate: [guestGuard], title: 'تسجيل الدخول | أكاديمية أبو زيد' },
  { path: 'register', component: Register, canActivate: [guestGuard], title: 'إنشاء حساب | أكاديمية أبو زيد' },
  {
    path: 'student',
    component: StudentDashboard,
    canActivate: [authGuard, roleGuard('student')],
    title: 'لوحة الطالب | أكاديمية أبو زيد',
  },
  {
    path: 'teacher',
    component: TeacherDashboard,
    canActivate: [authGuard, roleGuard('teacher')],
    title: 'لوحة المهندس إسلام أبو زيد | أكاديمية أبو زيد',
  },
  {
    path: 'teacher/courses',
    component: TeacherCourses,
    canActivate: [authGuard, roleGuard('teacher')],
    title: 'المواد | أكاديمية أبو زيد',
  },
  {
    path: 'teacher/messages',
    component: TeacherMessages,
    canActivate: [authGuard, roleGuard('teacher')],
    title: 'الرسائل | أكاديمية أبو زيد',
  },
  {
    path: 'teacher/students',
    component: TeacherStudents,
    canActivate: [authGuard, roleGuard('teacher')],
    title: 'الطلاب | أكاديمية أبو زيد',
  },
  {
    path: 'teacher/grades',
    component: TeacherGrades,
    canActivate: [authGuard, roleGuard('teacher')],
    title: 'الدرجات | أكاديمية أبو زيد',
  },
  { path: '**', component: NotFound, title: 'الصفحة غير موجودة' },
];
