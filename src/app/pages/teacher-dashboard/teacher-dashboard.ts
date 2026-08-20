import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CourseService } from '../../services/course';
import { ExamService } from '../../services/exam';
import { StudentService } from '../../services/student';
import { yearLabel } from '../../models/labels';
import { Panel, StatCard, TeacherShell } from '../../shared';

@Component({
  selector: 'app-teacher-dashboard',
  imports: [ReactiveFormsModule, RouterLink, TeacherShell, StatCard, Panel],
  templateUrl: './teacher-dashboard.html',
})
export class TeacherDashboard {
  private readonly coursesApi = inject(CourseService);
  private readonly studentsApi = inject(StudentService);
  private readonly examsApi = inject(ExamService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  protected readonly profile = this.auth.profile;
  protected readonly yearLabel = yearLabel;
  protected readonly students = this.studentsApi.students;
  protected readonly courses = this.coursesApi.courses;
  protected readonly exams = this.examsApi.exams;
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
      await this.examsApi.create({
        course_id: value.course_id,
        title: value.title,
        exam_date: value.exam_date || new Date().toISOString().slice(0, 10),
        total_marks: Number(value.total_marks),
      });
      this.message.set('تم إنشاء الامتحان.');
      this.examForm.patchValue({ title: '' });
    } catch {
      this.error.set('تعذر إنشاء الامتحان.');
    }
  }

  private async reload(): Promise<void> {
    await Promise.all([this.studentsApi.refresh(), this.coursesApi.refresh(), this.examsApi.refresh()]);
  }
}
