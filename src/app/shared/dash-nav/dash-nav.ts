import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AcademyContentService } from '../../services/academy-content';
import { ContactService } from '../../services/contact';

@Component({
  selector: 'app-dash-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dash-nav.html',
})
export class DashNav {
  private readonly content = inject(AcademyContentService);
  private readonly contacts = inject(ContactService);
  protected readonly items = this.content.teacherNav;
  protected readonly unreadCount = this.contacts.unreadCount;
}
