import { Component, input } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.html',
})
export class Panel {
  readonly title = input('');
  readonly spaced = input(false);
}
