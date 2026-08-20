import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../../services/enrollment';
import { ExamService } from '../../services/exam';
import { GradeService } from '../../services/grade';
import { Enrollment, Exam } from '../../models/account';
import { yearLabel } from '../../models/labels';
import { Panel, TeacherShell } from '../../shared';

@Component({
  selector: 'app-teacher-grades',
  imports: [FormsModule, TeacherShell, Panel],
  templateUrl: './teacher-grades.html',
})
export class TeacherGrades {
  private readonly examsApi = inject(ExamService);
  private readonly enrollmentsApi = inject(EnrollmentService);
  private readonly gradesApi = inject(GradeService);
  protected readonly yearLabel = yearLabel;

  protected readonly exams = this.examsApi.exams;
  protected readonly students = signal<Enrollment[]>([]);
  protected readonly selectedExamId = signal('');
  protected readonly scores: Record<string, number | null> = {};
  protected readonly notes: Record<string, string> = {};
  protected readonly message = signal('');
  protected readonly error = signal('');

  constructor() {
    void this.examsApi.refresh();
  }

  protected selectedExam(): Exam | undefined {
    return this.exams().find((exam) => exam.id === this.selectedExamId());
  }

  protected async onExamChange(examId: string): Promise<void> {
    this.selectedExamId.set(examId);
    this.message.set('');
    const exam = this.exams().find((item) => item.id === examId);
    if (!exam) {
      this.students.set([]);
      return;
    }
    const year = exam.courses?.year_level;
    if (year) {
      await this.enrollmentsApi.enrollYearInCourse(exam.course_id, year);
    }

    const [enrollments, grades] = await Promise.all([
      this.enrollmentsApi.forCourse(exam.course_id),
      this.gradesApi.forExam(exam.id),
    ]);

    for (const key of Object.keys(this.scores)) {
      delete this.scores[key];
    }
    for (const key of Object.keys(this.notes)) {
      delete this.notes[key];
    }

    for (const enrollment of enrollments) {
      const existing = grades.find((grade) => grade.student_id === enrollment.student_id);
      this.scores[enrollment.student_id] = existing?.score ?? null;
      this.notes[enrollment.student_id] = existing?.notes ?? '';
    }
    this.students.set(enrollments);
  }

  protected async save(studentId: string): Promise<void> {
    const examId = this.selectedExamId();
    const score = this.scores[studentId];
    if (!examId || score === null || score === undefined) {
      this.error.set('أدخل درجة قبل الحفظ.');
      return;
    }
    this.error.set('');
    try {
      await this.gradesApi.save({
        exam_id: examId,
        student_id: studentId,
        score: Number(score),
        notes: this.notes[studentId] || '',
      });
      this.message.set('تم حفظ الدرجة.');
    } catch {
      this.error.set('تعذر حفظ الدرجة.');
    }
  }
}
