import { Injectable } from '@angular/core';

export type CertificateStatus = 'idle' | 'valid' | 'invalid';

@Injectable({ providedIn: 'root' })
export class CertificateService {
  verify(code: string): Exclude<CertificateStatus, 'idle'> {
    const value = code.trim().toUpperCase();
    return /^AZ-[A-Z0-9]{4,}$/.test(value) ? 'valid' : 'invalid';
  }
}
