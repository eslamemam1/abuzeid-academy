import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AcademyContentService } from '../../services/academy-content';
import { ContactService } from '../../services/contact';
import { AlertBanner, PageHero, Panel } from '../../shared';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, PageHero, Panel, AlertBanner],
  templateUrl: './contact.html',
})
export class Contact {
  private readonly fb = inject(FormBuilder);
  private readonly content = inject(AcademyContentService);
  private readonly contactApi = inject(ContactService);

  protected readonly academy = this.content.academy;
  protected readonly sent = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal('');

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    subject: ['استفسار عن مادة البرمجة'],
    message: ['', Validators.required],
  });

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.error.set('');
    this.sent.set(false);
    try {
      await this.contactApi.send(this.form.getRawValue());
      this.sent.set(true);
      this.form.reset({ subject: 'استفسار عن مادة البرمجة' });
    } catch {
      this.error.set('تعذر إرسال الرسالة. حاول مرة أخرى.');
    } finally {
      this.saving.set(false);
    }
  }
}
