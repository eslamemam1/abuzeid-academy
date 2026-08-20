import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Courses } from './pages/courses/courses';
import { CourseDetail } from './pages/course-detail/course-detail';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';
import { Certificate } from './pages/certificate/certificate';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', component: Home, title: 'أكاديمية أبو زيد | الرئيسية' },
  { path: 'courses', component: Courses, title: 'الدورات | أكاديمية أبو زيد' },
  { path: 'courses/:id', component: CourseDetail, title: 'تفاصيل الدورة | أكاديمية أبو زيد' },
  { path: 'about', component: About, title: 'عن الأكاديمية | أكاديمية أبو زيد' },
  { path: 'contact', component: Contact, title: 'اتصل بنا | أكاديمية أبو زيد' },
  { path: 'certificate', component: Certificate, title: 'صلاحية الشهادة | أكاديمية أبو زيد' },
  { path: '**', component: NotFound, title: 'الصفحة غير موجودة' },
];
