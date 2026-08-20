import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-hero',
  imports: [RouterLink],
  templateUrl: './page-hero.html',
})
export class PageHero {
  readonly eyebrow = input('');
  readonly eyebrowLink = input('');
  readonly title = input.required<string>();
  readonly subtitle = input('');
}
