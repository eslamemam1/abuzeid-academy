import { Component, computed, inject, signal } from '@angular/core';
import { StudentService } from '../../services/student';
import { YearLevel } from '../../models/account';
import { yearLabel } from '../../models/labels';
import { Panel, TeacherShell } from '../../shared';

@Component({
  selector: 'app-teacher-students',
  imports: [TeacherShell, Panel],
  templateUrl: './teacher-students.html',
})
export class TeacherStudents {
  private readonly studentsApi = inject(StudentService);
  protected readonly yearLabel = yearLabel;
  protected readonly yearFilter = signal<'all' | YearLevel>('all');
  protected readonly students = this.studentsApi.students;
  protected readonly visible = computed(() => {
    const filter = this.yearFilter();
    if (filter === 'all') {
      return this.students();
    }
    return this.students().filter((student) => student.year_level === filter);
  });

  constructor() {
    void this.studentsApi.refresh();
  }

  protected setFilter(filter: 'all' | YearLevel): void {
    this.yearFilter.set(filter);
  }

  protected countFor(year: YearLevel): number {
    return this.students().filter((student) => student.year_level === year).length;
  }
}
