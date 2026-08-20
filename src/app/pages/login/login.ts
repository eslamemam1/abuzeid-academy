import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, homeByRole } from '../../services/auth';
import { AlertBanner, PageHero, Panel } from '../../shared';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, PageHero, Panel, AlertBanner],
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected loading = false;
  protected error = '';

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    password: ['', Validators.required],
  });

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    const { email, password } = this.form.getRawValue();
    const result = await this.auth.signIn(email, password);
    this.loading = false;
    if (result.error) {
      this.error = 'البريد أو كلمة المرور غير صحيحة.';
      return;
    }
    await this.router.navigateByUrl(homeByRole(this.auth.role()));
  }
}
