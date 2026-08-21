import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AcademyContentService } from '../../services/academy-content';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly content = inject(AcademyContentService);
  protected readonly academy = this.content.academy;
  protected readonly nav = this.content.publicNav;
}
