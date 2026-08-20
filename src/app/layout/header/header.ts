import { Component, inject, signal } from '@angular/core';
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

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected async logout(): Promise<void> {
    this.closeMenu();
    await this.auth.signOut();
  }
}
