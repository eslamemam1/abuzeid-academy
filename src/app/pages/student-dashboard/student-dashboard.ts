import { Component, computed, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth';
import { AcademyContentService } from '../../services/academy-content';
import { CourseService } from '../../services/course';
import { EnrollmentService } from '../../services/enrollment';
import { ExamService } from '../../services/exam';
import { GradeService } from '../../services/grade';
import { StudentService } from '../../services/student';
import { Exam, Grade, YearLevel } from '../../models/account';
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
  private readonly examsApi = inject(ExamService);
  private readonly gradesApi = inject(GradeService);
  private readonly studentsApi = inject(StudentService);

  protected readonly profile = this.auth.profile;
  protected readonly eyebrow = this.content.studentEyebrow;
  protected readonly yearLabel = yearLabel;
  protected readonly categoryLabel = categoryLabel;
  protected readonly grades = signal<Grade[]>([]);
  protected readonly exams = signal<Exam[]>([]);
  protected readonly message = signal('');
  protected readonly error = signal('');
  protected readonly savingYear = signal(false);

  protected readonly myCourses = computed(() => {
    const year = this.profile()?.year_level;
    if (!year) {
      return [];
    }
    return this.coursesApi.courses().filter((course) => course.year_level === year);
  });

  protected readonly upcomingExams = computed(() => {
    const today = this.todayStamp();
    return this.exams().filter((exam) => !exam.exam_date || exam.exam_date >= today);
  });

  protected readonly pastExams = computed(() => {
    const today = this.todayStamp();
    return this.exams().filter((exam) => exam.exam_date && exam.exam_date < today);
  });

  constructor() {
    effect(() => {
      const id = this.profile()?.id;
      if (id) {
        void this.reload();
      }
    });
  }

  protected gradeForExam(examId: string): Grade | undefined {
    return this.grades().find((grade) => grade.exam_id === examId);
  }

  protected async setYear(yearLevel: YearLevel): Promise<void> {
    const id = this.profile()?.id;
    if (!id) {
      return;
    }
    this.savingYear.set(true);
    this.error.set('');
    try {
      await this.studentsApi.updateYearLevel(id, yearLevel);
      await this.auth.refreshProfile();
      await this.reload();
      this.message.set('تم حفظ سنتك الدراسية. المواد دي بس اللي هتظهر لك.');
    } catch {
      this.error.set('تعذر حفظ السنة الدراسية.');
    } finally {
      this.savingYear.set(false);
    }
  }

  private todayStamp(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private async reload(): Promise<void> {
    const profile = this.profile();
    if (!profile?.id) {
      return;
    }
    const courses = await this.coursesApi.refresh();
    if (profile.year_level) {
      await this.enrollmentsApi.syncYearCourses(profile.id, profile.year_level, courses);
    }
    const [exams, grades] = await Promise.all([
      this.examsApi.list(),
      this.gradesApi.forStudent(profile.id),
    ]);
    const year = profile.year_level;
    this.exams.set(year ? exams.filter((exam) => exam.courses?.year_level === year) : []);
    this.grades.set(year ? grades.filter((grade) => grade.exams?.courses?.year_level === year) : []);
  }
}
