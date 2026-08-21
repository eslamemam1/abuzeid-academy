import { afterNextRender, Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../services/course';
import { AcademyContentService } from '../../services/academy-content';
import { MotionService } from '../../core/motion';
import { yearLabel } from '../../models/labels';
import { CourseCard } from '../../shared';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CourseCard],
  templateUrl: './home.html',
})
export class Home implements OnDestroy {
  private readonly coursesApi = inject(CourseService);
  private readonly content = inject(AcademyContentService);
  private readonly motion = inject(MotionService);

  protected readonly academy = this.content.academy;
  protected readonly featured = computed(() => this.coursesApi.getFeatured());
  protected readonly instructor = computed(() => this.content.instructors()[0] ?? null);
  protected readonly whyFeatures = this.content.whyFeatures;
  protected readonly classTracks = this.content.classTracks;
  protected readonly faqs = this.content.faqs;
  protected readonly stats = this.content.stats;
  protected readonly aboutPills = this.content.aboutPills;
  protected readonly featuredTitle = computed(() => {
    const year = this.coursesApi.studentYear();
    return year ? `كورسات ${yearLabel(year)} المميزة` : 'كورساتنا المميزة';
  });
  protected readonly featuredSubtitle = computed(() => {
    const year = this.coursesApi.studentYear();
    return year
      ? `مواد سنتك فقط. السنة التانية مش هتظهر هنا.`
      : this.academy().tagline;
  });

  protected readonly openFaq = signal(0);
  protected readonly code = signal(this.content.academy().playgroundCode);
  protected readonly output = signal('شغّل الكود عشان تشوف النتيجة هنا.');
  protected readonly running = signal(false);
  private readonly onMessage = (event: MessageEvent) => {
    const data = event.data as { type?: string; logs?: string[] };
    if (data?.type === 'abuzeid-playground') {
      this.output.set((data.logs ?? []).join('\n') || 'لا يوجد خرج.');
      this.running.set(false);
    }
  };

  constructor() {
    effect(() => {
      if (this.content.loaded()) {
        this.code.set(this.content.academy().playgroundCode);
        queueMicrotask(() => this.motion.enterHome());
      }
    });
    afterNextRender(() => {
      window.addEventListener('message', this.onMessage);
      this.motion.enterHome();
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.onMessage);
    this.motion.leaveHome();
  }

  protected moveHero(event: MouseEvent): void {
    this.motion.moveHero(event);
  }

  protected resetHero(): void {
    this.motion.resetHero();
  }

  protected toggleFaq(index: number): void {
    this.openFaq.update((current) => (current === index ? -1 : index));
  }

  protected updateCode(event: Event): void {
    this.code.set((event.target as HTMLTextAreaElement).value);
  }

  protected copyCode(): void {
    void navigator.clipboard.writeText(this.code());
  }

  protected clearOutput(): void {
    this.output.set('');
  }

  protected resetExample(): void {
    this.code.set(this.academy().playgroundCode);
    this.output.set('شغّل الكود عشان تشوف النتيجة هنا.');
  }

  protected runCode(): void {
    this.running.set(true);
    const source = JSON.stringify(this.code());
    const html = `<!doctype html><html><body><script>
      const logs = [];
      const write = (...args) => logs.push(args.map((item) => String(item)).join(' '));
      console.log = write;
      console.error = write;
      console.warn = write;
      try {
        eval(${source});
      } catch (error) {
        logs.push('خطأ: ' + (error && error.message ? error.message : error));
      }
      parent.postMessage({ type: 'abuzeid-playground', logs }, '*');
    </script></body></html>`;
    const frame = document.getElementById('playground-frame') as HTMLIFrameElement | null;
    if (frame) {
      frame.srcdoc = html;
    }
  }
}
