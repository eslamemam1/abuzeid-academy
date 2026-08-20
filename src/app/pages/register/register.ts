import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { YearLevel } from '../../models/account';
import { AuthService, homeByRole } from '../../services/auth';
import { passwordsMatch, sanitizeAuthError, strongPasswordPattern } from '../../core/security';
import { AlertBanner, PageHero, Panel } from '../../shared';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, PageHero, Panel, AlertBanner],
  templateUrl: './register.html',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected loading = false;
  protected error = '';
  protected message = '';

  protected readonly form = this.fb.nonNullable.group(
    {
      fullName: ['', [Validators.required, Validators.maxLength(80)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
      phone: ['', [Validators.maxLength(20)]],
      yearLevel: ['' as YearLevel | ''],
      password: ['', [Validators.required, Validators.pattern(strongPasswordPattern)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch() },
  );

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    this.message = '';
    const value = this.form.getRawValue();
    const result = await this.auth.signUp({
      email: value.email,
      password: value.password,
      fullName: value.fullName,
      phone: value.phone,
      yearLevel: value.yearLevel,
    });
    this.loading = false;

    if (result.error) {
      this.error = sanitizeAuthError();
      return;
    }

    if (result.needsConfirm) {
      this.message = 'تم إنشاء الحساب. راجع بريدك لتأكيد الإيميل ثم سجّل الدخول.';
      return;
    }

    await this.router.navigateByUrl(homeByRole(this.auth.role()));
  }
}
