import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AcademyApi } from '../../services/academy-api';
import { AuthService } from '../../services/auth';
import { DbCourse, Exam, Profile } from '../../models/account';
import { yearLabel } from '../../models/labels';

@Component({
  selector: 'app-teacher-dashboard',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './teacher-dashboard.html',
  styleUrl: './teacher-dashboard.scss',
})
export class TeacherDashboard {
  private readonly api = inject(AcademyApi);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  protected readonly profile = this.auth.profile;
  protected readonly yearLabel = yearLabel;
  protected readonly students = signal<Profile[]>([]);
  protected readonly courses = signal<DbCourse[]>([]);
  protected readonly exams = signal<Exam[]>([]);
  protected readonly message = signal('');
  protected readonly error = signal('');

  protected readonly examForm = this.fb.nonNullable.group({
    course_id: ['', Validators.required],
    title: ['', Validators.required],
    exam_date: [''],
    total_marks: [100, Validators.required],
  });

  constructor() {
    void this.reload();
  }

  protected async createExam(): Promise<void> {
    if (this.examForm.invalid) {
      this.examForm.markAllAsTouched();
      return;
    }
    const value = this.examForm.getRawValue();
    this.error.set('');
    try {
      await this.api.createExam({
        course_id: value.course_id,
        title: value.title,
        exam_date: value.exam_date || new Date().toISOString().slice(0, 10),
        total_marks: Number(value.total_marks),
      });
      this.message.set('تم إنشاء الامتحان.');
      this.examForm.patchValue({ title: '' });
      await this.reload();
    } catch {
      this.error.set('تعذر إنشاء الامتحان.');
    }
  }

  private async reload(): Promise<void> {
    const [students, courses, exams] = await Promise.all([
      this.api.listStudents(),
      this.api.listCourses(),
      this.api.listExams(),
    ]);
    this.students.set(students);
    this.courses.set(courses);
    this.exams.set(exams);
  }
}
