import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBanknote,
  lucideBookOpen,
  lucideChevronDown,
  lucideClock,
  lucideUser,
} from '@ng-icons/lucide';
import { Course } from '../../models/course';

@Component({
  selector: 'app-course-card',
  imports: [RouterLink, NgIcon],
  providers: [
    provideIcons({
      lucideBanknote,
      lucideBookOpen,
      lucideClock,
      lucideUser,
      lucideChevronDown,
    }),
  ],
  templateUrl: './course-card.html',
  host: { class: 'course-card-host' },
})
export class CourseCard {
  readonly course = input.required<Course>();
  protected readonly open = signal(false);

  protected toggleDetails(): void {
    this.open.update((value) => !value);
  }

  protected priceLabel(price: number): string {
    return price > 0 ? `${price} L.E` : 'مجاني';
  }

  protected priceText(price: number): string {
    return price > 0 ? `${price} جنيه` : 'مجاني';
  }
}
