import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;

export function passwordsMatch(passwordKey = 'password', confirmKey = 'confirmPassword'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordKey)?.value;
    const confirm = control.get(confirmKey)?.value;
    if (!password || !confirm || password === confirm) {
      return null;
    }
    return { passwordsMismatch: true };
  };
}

export function sanitizeAuthError(): string {
  return 'تعذر إتمام العملية. تأكد من البيانات وحاول مرة أخرى.';
}
