import { afterNextRender, Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { ScrollRevealService } from './core/scroll-reveal';
import { MotionService } from './core/motion';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    const router = inject(Router);
    const reveal = inject(ScrollRevealService);
    const motion = inject(MotionService);

    afterNextRender(() => {
      reveal.start();
      motion.start();
      const scan = () => reveal.scan();
      router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
        queueMicrotask(scan);
        setTimeout(scan, 280);
        setTimeout(scan, 900);
      });
    });
  }
}
