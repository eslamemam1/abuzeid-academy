import { Component, input } from '@angular/core';

@Component({
  selector: 'app-alert-banner',
  templateUrl: './alert-banner.html',
})
export class AlertBanner {
  readonly message = input('');
  readonly error = input('');
}
