import { afterNextRender, Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoon, lucideSun } from '@ng-icons/lucide';
import { AuthService } from '../../services/auth';
import { AcademyContentService } from '../../services/academy-content';
import { ContactService } from '../../services/contact';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, NgIcon],
  providers: [provideIcons({ lucideSun, lucideMoon })],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly auth = inject(AuthService);
  protected readonly content = inject(AcademyContentService);
  protected readonly contacts = inject(ContactService);
  protected readonly academy = this.content.academy;
  protected readonly nav = this.content.publicNav;
  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly theme = signal<'dark' | 'light'>(this.readTheme());

  constructor() {
    afterNextRender(() => this.onWindowScroll());
  }

  protected initials(): string {
    const name = this.auth.displayName().trim();
    const parts = name.split(/\s+/).filter(Boolean);
    if (!parts.length) {
      return 'أ';
    }
    return parts.slice(0, 2).map((part) => part[0]).join('');
  }

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }

  @HostListener('window:keydown.escape')
  protected onEscape(): void {
    this.closeMenu();
  }

  @HostListener('window:resize')
  protected onResize(): void {
    if (window.innerWidth > 980) {
      this.closeMenu();
    }
  }

  protected toggleMenu(): void {
    const next = !this.menuOpen();
    this.menuOpen.set(next);
    this.lockScroll(next);
  }

  protected closeMenu(): void {
    if (!this.menuOpen()) {
      return;
    }
    this.menuOpen.set(false);
    this.lockScroll(false);
  }

  protected toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    document.documentElement.dataset['theme'] = next;
    localStorage.setItem('academy-theme', next);
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      next === 'dark' ? '#0b0714' : '#562989',
    );
  }

  protected async logout(): Promise<void> {
    this.closeMenu();
    await this.auth.signOut();
  }

  private lockScroll(locked: boolean): void {
    document.body.style.overflow = locked ? 'hidden' : '';
  }

  private readTheme(): 'dark' | 'light' {
    if (typeof localStorage === 'undefined') {
      return 'light';
    }
    const saved = localStorage.getItem('academy-theme');
    const theme = saved === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset['theme'] = theme;
    return theme;
  }
}
