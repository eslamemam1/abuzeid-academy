import { Component, inject, input } from '@angular/core';
import { AcademyContentService } from '../../services/academy-content';
import { AlertBanner } from '../alert-banner/alert-banner';
import { DashNav } from '../dash-nav/dash-nav';
import { PageHero } from '../page-hero/page-hero';

@Component({
  selector: 'app-teacher-shell',
  imports: [PageHero, DashNav, AlertBanner],
  templateUrl: './teacher-shell.html',
})
export class TeacherShell {
  private readonly content = inject(AcademyContentService);

  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly message = input('');
  readonly error = input('');
  protected readonly eyebrow = this.content.teacherEyebrow;
}
