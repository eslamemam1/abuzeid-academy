import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AcademyContentService } from '../../services/academy-content';
import { PageHero, Panel } from '../../shared';

@Component({
  selector: 'app-about',
  imports: [RouterLink, PageHero, Panel],
  templateUrl: './about.html',
})
export class About {
  private readonly content = inject(AcademyContentService);
  protected readonly academy = this.content.academy;
}
