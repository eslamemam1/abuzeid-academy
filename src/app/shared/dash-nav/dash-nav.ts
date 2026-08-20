import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AcademyContentService } from '../../services/academy-content';

@Component({
  selector: 'app-dash-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dash-nav.html',
})
export class DashNav {
  private readonly content = inject(AcademyContentService);
  protected readonly items = this.content.teacherNav;
}
