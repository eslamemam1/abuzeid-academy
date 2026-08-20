import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AcademyApi } from '../../services/academy-api';
import { Enrollment, Exam } from '../../models/account';

@Component({
  selector: 'app-teacher-grades',
  imports: [FormsModule, RouterLink],
  templateUrl: './teacher-grades.html',
  styleUrl: './teacher-grades.scss',
})
export class TeacherGrades {
  private readonly api = inject(AcademyApi);

  protected readonly exams = signal<Exam[]>([]);
  protected readonly students = signal<Enrollment[]>([]);
  protected readonly selectedExamId = signal('');
  protected readonly scores: Record<string, number | null> = {};
  protected readonly notes: Record<string, string> = {};
  protected readonly message = signal('');
  protected readonly error = signal('');

  constructor() {
    void this.api.listExams().then((rows) => this.exams.set(rows));
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

    const [enrollments, grades] = await Promise.all([
      this.api.enrollmentsForCourse(exam.course_id),
      this.api.gradesForExam(exam.id),
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
      await this.api.saveGrade({
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
