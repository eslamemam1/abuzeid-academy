import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AcademyApi } from '../../services/academy-api';
import { Profile } from '../../models/account';
import { yearLabel } from '../../models/labels';

@Component({
  selector: 'app-teacher-students',
  imports: [RouterLink],
  templateUrl: './teacher-students.html',
  styleUrl: './teacher-students.scss',
})
export class TeacherStudents {
  private readonly api = inject(AcademyApi);
  protected readonly yearLabel = yearLabel;
  protected readonly students = signal<Profile[]>([]);

  constructor() {
    void this.api.listStudents().then((rows) => this.students.set(rows));
  }
}
