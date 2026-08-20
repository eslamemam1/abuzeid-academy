import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-certificate',
  imports: [ReactiveFormsModule],
  templateUrl: './certificate.html',
  styleUrl: './certificate.scss',
})
export class Certificate {
  protected readonly code = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6)],
  });

  protected result: 'idle' | 'valid' | 'invalid' = 'idle';

  protected verify(): void {
    if (this.code.invalid) {
      this.code.markAsTouched();
      return;
    }

    const value = this.code.value.trim().toUpperCase();
    this.result = /^AZ-[A-Z0-9]{4,}$/.test(value) ? 'valid' : 'invalid';
  }
}
