import { Component, inject } from '@angular/core';
import { ContactService, DbContactMessage } from '../../services/contact';
import { Panel, TeacherShell } from '../../shared';

@Component({
  selector: 'app-teacher-messages',
  imports: [TeacherShell, Panel],
  templateUrl: './teacher-messages.html',
})
export class TeacherMessages {
  private readonly contacts = inject(ContactService);

  protected readonly messages = this.contacts.messages;
  protected readonly unreadCount = this.contacts.unreadCount;

  constructor() {
    void this.contacts.refresh();
    void this.contacts.enableBrowserAlerts();
  }

  protected formatDate(value: string): string {
    return new Date(value).toLocaleString('ar-EG', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  protected async markRead(row: DbContactMessage): Promise<void> {
    if (row.read_at) {
      return;
    }
    await this.contacts.markRead(row.id);
  }

  protected async remove(row: DbContactMessage): Promise<void> {
    const ok = window.confirm(`حذف رسالة ${row.name}؟`);
    if (!ok) {
      return;
    }
    await this.contacts.remove(row.id);
  }
}
