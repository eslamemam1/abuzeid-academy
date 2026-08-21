import { Injectable } from '@angular/core';

const SELECTOR = [
  '.page-hero',
  '.panel',
  '.cta-band',
  '.instructor-card',
  '.footer-grid > *',
].join(', ');

@Injectable({ providedIn: 'root' })
export class ScrollRevealService {
  private observer: IntersectionObserver | null = null;

  start(): void {
    if (this.observer || typeof IntersectionObserver === 'undefined') {
      this.scan();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          entry.target.classList.add('is-in');
          this.observer?.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    this.scan();
  }

  scan(): void {
    document.querySelectorAll(SELECTOR).forEach((node) => {
      const el = node as HTMLElement;
      if (el.classList.contains('is-in')) {
        return;
      }
      el.classList.add('reveal');
      this.observer?.observe(el);
    });
  }
}
