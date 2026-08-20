import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth';
import { AcademyApi } from '../../services/academy-api';
import { DbCourse, Enrollment, Grade } from '../../models/account';
import { categoryLabel, yearLabel } from '../../models/labels';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss',
})
export class StudentDashboard {
  private readonly auth = inject(AuthService);
  private readonly api = inject(AcademyApi);

  protected readonly profile = this.auth.profile;
  protected readonly yearLabel = yearLabel;
  protected readonly categoryLabel = categoryLabel;
  protected readonly courses = signal<DbCourse[]>([]);
  protected readonly enrollments = signal<Enrollment[]>([]);
  protected readonly grades = signal<Grade[]>([]);
  protected readonly message = signal('');
  protected readonly error = signal('');

  constructor() {
    void this.reload();
  }

  protected isEnrolled(courseId: string): boolean {
    return this.enrollments().some((item) => item.course_id === courseId);
  }

  protected async enroll(courseId: string): Promise<void> {
    const id = this.profile()?.id;
    if (!id) {
      return;
    }
    this.error.set('');
    try {
      await this.api.enroll(id, courseId);
      this.message.set('تم تسجيلك في المادة.');
      await this.reload();
    } catch {
      this.error.set('تعذر التسجيل في المادة. ربما أنت مسجّل بالفعل.');
    }
  }

  private async reload(): Promise<void> {
    const id = this.profile()?.id;
    if (!id) {
      return;
    }
    const [courses, enrollments, grades] = await Promise.all([
      this.api.listCourses(),
      this.api.myEnrollments(id),
      this.api.myGrades(id),
    ]);
    this.courses.set(courses);
    this.enrollments.set(enrollments);
    this.grades.set(grades);
  }
}
