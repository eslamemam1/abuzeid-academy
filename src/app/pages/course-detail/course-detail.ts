import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CourseService } from '../../services/course';
import { PageHero, Panel } from '../../shared';

@Component({
  selector: 'app-course-detail',
  imports: [RouterLink, PageHero, Panel],
  templateUrl: './course-detail.html',
})
export class CourseDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly coursesApi = inject(CourseService);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly loaded = this.coursesApi.loaded;
  private readonly courseId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('id') ?? '' },
  );
  protected readonly course = computed(() => this.coursesApi.getById(this.courseId()));
  protected readonly title = computed(() => this.course()?.title || 'الدورة غير موجودة');
  protected readonly subtitle = computed(() => {
    const item = this.course();
    return item ? `${item.instructor} • ${item.typeLabel}` : '';
  });
  protected readonly videoSrc = computed<SafeResourceUrl | null>(() => {
    const embed = youtubeEmbedUrl(this.course()?.videoUrl);
    return embed ? this.sanitizer.bypassSecurityTrustResourceUrl(embed) : null;
  });
}

function youtubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0] ?? '';
      return isYoutubeId(id) ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host !== 'youtube.com' && host !== 'youtube-nocookie.com') {
      return null;
    }
    const fromQuery = parsed.searchParams.get('v');
    if (fromQuery && isYoutubeId(fromQuery)) {
      return `https://www.youtube.com/embed/${fromQuery}`;
    }
    const fromPath = parsed.pathname.match(/\/embed\/([A-Za-z0-9_-]{11})/);
    return fromPath ? `https://www.youtube.com/embed/${fromPath[1]}` : null;
  } catch {
    return null;
  }
}

function isYoutubeId(value: string): boolean {
  return /^[A-Za-z0-9_-]{11}$/.test(value);
}
