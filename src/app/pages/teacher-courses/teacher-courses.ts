import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService } from '../../services/course';
import { DbCourse } from '../../models/account';
import { categoryLabel, yearLabel } from '../../models/labels';
import { Panel, TeacherShell } from '../../shared';

@Component({
  selector: 'app-teacher-courses',
  imports: [ReactiveFormsModule, TeacherShell, Panel],
  templateUrl: './teacher-courses.html',
})
export class TeacherCourses {
  private readonly coursesApi = inject(CourseService);
  private readonly fb = inject(FormBuilder);

  protected readonly yearLabel = yearLabel;
  protected readonly categoryLabel = categoryLabel;
  protected readonly courses = this.coursesApi.courses;
  protected readonly saving = signal(false);
  protected readonly message = signal('');
  protected readonly error = signal('');

  protected readonly courseForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    category: ['programming' as DbCourse['category'], Validators.required],
    year_level: ['year1' as DbCourse['year_level'], Validators.required],
    description: [''],
    is_free: [false],
  });

  constructor() {
    void this.coursesApi.refresh();
  }

  protected async createCourse(): Promise<void> {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }
    const value = this.courseForm.getRawValue();
    this.error.set('');
    this.saving.set(true);
    try {
      await this.coursesApi.create(value);
      this.message.set('تم إضافة المادة.');
      this.courseForm.reset({
        title: '',
        category: 'programming',
        year_level: 'year1',
        description: '',
        is_free: false,
      });
    } catch {
      this.error.set('تعذر إضافة المادة.');
    } finally {
      this.saving.set(false);
    }
  }

  protected async deleteCourse(course: DbCourse): Promise<void> {
    const ok = window.confirm(
      `هل أنت متأكد من حذف المادة «${course.title}»؟ سيتم حذف التسجيلات والامتحانات المرتبطة بها.`,
    );
    if (!ok) {
      return;
    }
    this.error.set('');
    try {
      await this.coursesApi.delete(course.id);
      this.message.set(`تم حذف المادة «${course.title}».`);
    } catch {
      this.error.set('تعذر حذف المادة.');
    }
  }
}
