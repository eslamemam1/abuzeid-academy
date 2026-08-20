import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, homeByRole } from '../services/auth';
import { UserRole } from '../models/account';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ensureReady();
  if (!auth.user() || !auth.profile()) {
    return router.createUrlTree(['/login']);
  }
  return true;
};

export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ensureReady();
  if (!auth.user() || !auth.profile()) {
    return true;
  }
  return router.createUrlTree([homeByRole(auth.role())]);
};

export const roleGuard = (role: UserRole): CanActivateFn => async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ensureReady();
  if (!auth.user() || !auth.profile()) {
    return router.createUrlTree(['/login']);
  }
  if (auth.role() !== role) {
    return router.createUrlTree([homeByRole(auth.role())]);
  }
  return true;
};
