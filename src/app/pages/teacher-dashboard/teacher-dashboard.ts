import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../services/course';
import { ExamService } from '../../services/exam';
import { StudentService } from '../../services/student';
import { ContactService } from '../../services/contact';
import { EnrollmentService } from '../../services/enrollment';
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
  private readonly contacts = inject(ContactService);
  private readonly enrollmentsApi = inject(EnrollmentService);
  private readonly fb = inject(FormBuilder);

  protected readonly yearLabel = yearLabel;
  protected readonly students = this.studentsApi.students;
  protected readonly courses = this.coursesApi.courses;
  protected readonly exams = this.examsApi.exams;
  protected readonly unreadCount = this.contacts.unreadCount;
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
      const course = this.courses().find((item) => item.id === value.course_id);
      if (course) {
        await this.enrollmentsApi.enrollYearInCourse(course.id, course.year_level);
      }
      this.message.set('تم إنشاء الامتحان. هيظهر لطلاب نفس السنة.');
      this.examForm.patchValue({ title: '' });
    } catch {
      this.error.set('تعذر إنشاء الامتحان.');
    }
  }

  private async reload(): Promise<void> {
    await Promise.all([this.studentsApi.refresh(), this.coursesApi.refresh(), this.examsApi.refresh()]);
  }
}
