import { Injectable } from '@angular/core';

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  async send(_input: ContactMessage): Promise<void> {
    await Promise.resolve();
  }
}
