import { Injectable } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Injectable({ providedIn: 'root' })
export class MotionService {
  private ctx: gsap.Context | null = null;

  start(): void {
    if (this.reduced()) {
      return;
    }
    gsap.from('.site-header', {
      y: -28,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
    });
  }

  enterHome(): void {
    this.kill();
    if (this.reduced()) {
      return;
    }

    this.ctx = gsap.context(() => {
      this.playHero();
      this.reveal('.hero-stat', { y: 28, stagger: 0.1 }, '.stats-bar');
      this.reveal('.why-intro > *', { y: 26, stagger: 0.1 }, '.why-section');
      this.reveal('.why-cards .why-card', { y: 56, stagger: 0.07 }, '.why-section');
      this.reveal('.section-head, .section-row, .faq-title', { y: 30, stagger: 0.08 });
      this.reveal('.track-card', { y: 48, stagger: 0.12 }, '.tracks-section');
      this.reveal('.course-row .course-card', { y: 48, stagger: 0.08 });
      this.reveal('.lab', { y: 40 }, '.lab-section');
      this.reveal('.about-pills .why-card', { y: 32, stagger: 0.1 });
      this.reveal('.faq-box', { y: 36 }, '.faq-section');
      this.playFloat();
      this.bindHover('.why-cards .why-card, .track-card, .course-card');
    });

    ScrollTrigger.refresh();
  }

  enterPage(): void {
    this.kill();
    if (this.reduced()) {
      return;
    }

    this.ctx = gsap.context(() => {
      this.reveal('.page-hero, .panel, .course-card, .cta-band, .footer-grid > *', {
        y: 34,
        stagger: 0.07,
      });
      this.bindHover('.course-card');
    });

    ScrollTrigger.refresh();
  }

  leaveHome(): void {
    this.kill();
  }

  moveHero(event: MouseEvent): void {
    if (this.reduced()) {
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

  private reveal(
    selector: string,
    options: { y?: number; stagger?: number },
    trigger?: string,
  ): void {
    const nodes = gsap.utils.toArray<HTMLElement>(selector);
    if (!nodes.length) {
      return;
    }
    gsap.fromTo(
      nodes,
      { y: options.y ?? 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.75,
        stagger: options.stagger ?? 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: trigger ? document.querySelector(trigger) ?? nodes[0] : nodes[0],
          start: 'top 88%',
          once: true,
        },
      },
    );
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

  private bindHover(selector: string): void {
    gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
      const enter = () =>
        gsap.to(el, {
          y: -10,
          scale: 1.03,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      const leave = () =>
        gsap.to(el, {
          y: 0,
          scale: 1,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    });
  }

  private kill(): void {
    this.ctx?.revert();
    this.ctx = null;
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.killTweensOf('.hero-bg, .code-float, .code-float span');
  }

  private reduced(): boolean {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
