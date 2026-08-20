import { Injectable, NgZone, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { supabase } from '../core/supabase-client';
import { Profile, UserRole, YearLevel } from '../models/account';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly zone = inject(NgZone);
  private readonly router = inject(Router);

  private readonly ready = signal(false);
  private readonly currentUser = signal<User | null>(null);
  private readonly currentProfile = signal<Profile | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly profile = this.currentProfile.asReadonly();
  readonly isReady = this.ready.asReadonly();
  readonly role = computed(() => this.currentProfile()?.role ?? null);
  readonly isTeacher = computed(() => this.role() === 'teacher');
  readonly isStudent = computed(() => this.role() === 'student');
  readonly displayName = computed(
    () => this.currentProfile()?.full_name || this.currentUser()?.email || 'حسابي',
  );

  constructor() {
    void this.restoreSession();
    supabase.auth.onAuthStateChange((_event, session) => {
      this.zone.run(() => {
        this.currentUser.set(session?.user ?? null);
        void this.loadProfile(session?.user?.id);
      });
    });
  }

  async ensureReady(): Promise<void> {
    if (this.ready()) {
      return;
    }
    await this.restoreSession();
  }

  async signUp(input: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    yearLevel: YearLevel | '';
  }): Promise<{ error?: string; needsConfirm?: boolean }> {
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim().toLowerCase(),
      password: input.password,
      options: {
        data: {
          full_name: input.fullName.trim().slice(0, 80),
          phone: input.phone.trim().slice(0, 20),
          year_level: input.yearLevel || null,
        },
      },
    });

    if (error) {
      const code = (error.code || '').toLowerCase();
      const text = (error.message || '').toLowerCase();
      if (code === 'email_address_invalid' || text.includes('email address') && text.includes('invalid')) {
        return { error: 'email_invalid' };
      }
      if (code === 'user_already_exists' || text.includes('already registered')) {
        return { error: 'email_exists' };
      }
      if (code === 'weak_password' || text.includes('leaked') || text.includes('weak')) {
        return { error: 'weak_password' };
      }
      if (code === 'over_email_send_rate_limit' || text.includes('rate limit')) {
        return { error: 'email_rate_limit' };
      }
      return { error: 'signup_failed' };
    }

    if (!data.session) {
      return { needsConfirm: true };
    }

    await this.loadProfile(data.user?.id);
    return {};
  }

  async signIn(email: string, password: string): Promise<{ error?: string }> {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) {
      return { error: 'invalid_credentials' };
    }
    await this.loadProfile(this.currentUser()?.id);
    if (this.currentUser() && !this.currentProfile()) {
      await this.signOut();
      return { error: 'invalid_credentials' };
    }
    return {};
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    this.currentUser.set(null);
    this.currentProfile.set(null);
    await this.router.navigateByUrl('/');
  }

  dashboardLink(): string {
    return this.isTeacher() ? '/teacher' : '/student';
  }

  async refreshProfile(): Promise<void> {
    await this.loadProfile(this.currentUser()?.id);
  }

  private async restoreSession(): Promise<void> {
    const { data } = await supabase.auth.getSession();
    this.currentUser.set(data.session?.user ?? null);
    await this.loadProfile(data.session?.user?.id);
    this.ready.set(true);
  }

  private async loadProfile(userId?: string): Promise<void> {
    if (!userId) {
      this.currentProfile.set(null);
      return;
    }

    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    this.currentProfile.set((data as Profile | null) ?? null);
  }
}

export function homeByRole(role: UserRole | null): string {
  if (role === 'teacher') {
    return '/teacher';
  }
  if (role === 'student') {
    return '/student';
  }
  return '/login';
}
