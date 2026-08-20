import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-stat-card',
  imports: [RouterLink],
  templateUrl: './stat-card.html',
})
export class StatCard {
  readonly value = input.required<string | number>();
  readonly label = input.required<string>();
  readonly link = input('');
}
