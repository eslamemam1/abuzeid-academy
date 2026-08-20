import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { supabase } from '../core/supabase-client';
import { AuthService } from './auth';

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface DbContactMessage extends ContactMessage {
  id: string;
  read_at: string | null;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly auth = inject(AuthService);
  private readonly inboxRows = signal<DbContactMessage[]>([]);
  private watching = false;

  readonly messages = this.inboxRows.asReadonly();
  readonly unreadCount = computed(() => this.inboxRows().filter((row) => !row.read_at).length);

  constructor() {
    effect(() => {
      if (this.auth.isTeacher()) {
        void this.refresh();
        this.watch();
      }
    });
  }

  async send(input: ContactMessage): Promise<void> {
    const { error } = await supabase.from('contact_messages').insert({
      name: input.name.trim().slice(0, 80),
      email: input.email.trim().toLowerCase().slice(0, 120),
      phone: input.phone.trim().slice(0, 20),
      subject: input.subject.trim().slice(0, 120),
      message: input.message.trim().slice(0, 2000),
    });
    if (error) {
      throw error;
    }
  }

  async refresh(): Promise<DbContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      throw error;
    }
    const rows = (data ?? []) as DbContactMessage[];
    this.inboxRows.set(rows);
    return rows;
  }

  async markRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      throw error;
    }
    this.inboxRows.update((rows) =>
      rows.map((row) => (row.id === id ? { ...row, read_at: new Date().toISOString() } : row)),
    );
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) {
      throw error;
    }
    this.inboxRows.update((rows) => rows.filter((row) => row.id !== id));
  }

  private watch(): void {
    if (this.watching) {
      return;
    }
    this.watching = true;
    supabase
      .channel('contact-messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, () => {
        void this.refresh().then((rows) => {
          const latest = rows[0];
          if (latest && !latest.read_at) {
            this.notify(latest);
          }
        });
      })
      .subscribe();
  }

  async enableBrowserAlerts(): Promise<void> {
    if (typeof Notification === 'undefined' || Notification.permission !== 'default') {
      return;
    }
    await Notification.requestPermission();
  }

  private notify(row: DbContactMessage): void {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
      return;
    }
    new Notification('رسالة جديدة — أكاديمية أبو زيد', {
      body: `${row.name}: ${row.subject || row.message}`,
    });
  }
}
