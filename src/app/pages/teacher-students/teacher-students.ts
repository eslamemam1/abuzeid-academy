import { Component, inject } from '@angular/core';
import { StudentService } from '../../services/student';
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
  protected readonly students = this.studentsApi.students;

  constructor() {
    void this.studentsApi.refresh();
  }
}
