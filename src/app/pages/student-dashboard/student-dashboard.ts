import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth';
import { AcademyContentService } from '../../services/academy-content';
import { CourseService } from '../../services/course';
import { EnrollmentService } from '../../services/enrollment';
import { GradeService } from '../../services/grade';
import { Enrollment, Grade } from '../../models/account';
import { categoryLabel, yearLabel } from '../../models/labels';
import { AlertBanner, PageHero, Panel, StatCard } from '../../shared';

@Component({
  selector: 'app-student-dashboard',
  imports: [PageHero, AlertBanner, StatCard, Panel],
  templateUrl: './student-dashboard.html',
})
export class StudentDashboard {
  private readonly auth = inject(AuthService);
  private readonly content = inject(AcademyContentService);
  private readonly coursesApi = inject(CourseService);
  private readonly enrollmentsApi = inject(EnrollmentService);
  private readonly gradesApi = inject(GradeService);

  protected readonly profile = this.auth.profile;
  protected readonly eyebrow = this.content.studentEyebrow;
  protected readonly yearLabel = yearLabel;
  protected readonly categoryLabel = categoryLabel;
  protected readonly courses = this.coursesApi.courses;
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
      await this.enrollmentsApi.enroll(id, courseId);
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
    const [, enrollments, grades] = await Promise.all([
      this.coursesApi.refresh(),
      this.enrollmentsApi.forStudent(id),
      this.gradesApi.forStudent(id),
    ]);
    this.enrollments.set(enrollments);
    this.grades.set(grades);
  }
}
