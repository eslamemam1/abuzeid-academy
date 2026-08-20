import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CertificateService, CertificateStatus } from '../../services/certificate';
import { AlertBanner, PageHero, Panel } from '../../shared';

@Component({
  selector: 'app-certificate',
  imports: [ReactiveFormsModule, PageHero, Panel, AlertBanner],
  templateUrl: './certificate.html',
})
export class Certificate {
  private readonly certificates = inject(CertificateService);

  protected readonly code = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6)],
  });

  protected result: CertificateStatus = 'idle';

  protected verify(): void {
    if (this.code.invalid) {
      this.code.markAsTouched();
      return;
    }
    this.result = this.certificates.verify(this.code.value);
  }
}
