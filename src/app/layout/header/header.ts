import { afterNextRender, Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AcademyContentService } from '../../services/academy-content';
import { ContactService } from '../../services/contact';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
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

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 12);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
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
