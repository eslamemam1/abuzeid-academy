import { Injectable } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Injectable({ providedIn: 'root' })
export class MotionService {
  start(): void {
    ScrollTrigger.refresh();
  }

  enterHome(): void {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    this.kill();
    this.playHero();
    this.playScroll();
    this.playFloat();
    ScrollTrigger.refresh();
  }

  leaveHome(): void {
    this.kill();
    gsap.killTweensOf('.hero-bg, .code-float, .code-float span');
  }

  moveHero(event: MouseEvent): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const x = (event.clientX / window.innerWidth - 0.5) * 36;
    const y = (event.clientY / window.innerHeight - 0.5) * 28;
    gsap.to('.hero-bg', { x, y, duration: 0.9, ease: 'power3.out', overwrite: 'auto' });
    gsap.to('.code-float', {
      x: x * -0.4,
      y: y * -0.35,
      duration: 1.1,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  resetHero(): void {
    gsap.to('.hero-bg', { x: 0, y: 0, duration: 1, ease: 'power3.out' });
    gsap.to('.code-float', { x: 0, y: 0, duration: 1, ease: 'power3.out' });
  }

  private kill(): void {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }

  private playHero(): void {
    const copy = document.querySelectorAll('.hero-copy > *');
    if (!copy.length) {
      return;
    }
    gsap.fromTo(
      copy,
      { y: 42, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, stagger: 0.12, ease: 'power3.out' },
    );
  }

  private playScroll(): void {
    gsap.utils
      .toArray<HTMLElement>('.why-card, .track-card, .course-card, .lab, .faq-box')
      .forEach((el, index) => {
        gsap.fromTo(
          el,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: (index % 4) * 0.06,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          },
        );
      });

    gsap.utils.toArray<HTMLElement>('.section-head, .section-row, .faq-title').forEach((el) => {
      gsap.fromTo(
        el,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        },
      );
    });
  }

  private playFloat(): void {
    document.querySelectorAll('.code-float span').forEach((node, index) => {
      gsap.to(node, {
        y: index % 2 === 0 ? -18 : 16,
        rotation: index % 2 === 0 ? -8 : 8,
        duration: 3.4 + index * 0.35,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    });
  }
}
