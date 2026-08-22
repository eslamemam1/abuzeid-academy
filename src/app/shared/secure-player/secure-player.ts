import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import shaka from 'shaka-player';
import { environment } from '../../../environments/environment';

type PlaybackKind = 'youtube' | 'stream' | 'none';

@Component({
  selector: 'app-secure-player',
  templateUrl: './secure-player.html',
})
export class SecurePlayer implements OnDestroy {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly videoRef = viewChild<ElementRef<HTMLVideoElement>>('secureVideo');
  private readonly shellRef = viewChild<ElementRef<HTMLElement>>('playerShell');
  private player: shaka.Player | null = null;
  private streamUrl = '';
  protected readonly isFullscreen = signal(false);

  readonly src = input('');
  readonly title = input('محاضرة محمية');
  readonly watermark = input('أكاديمية أبو زيد • محتوى محمي');

  protected readonly kind = computed<PlaybackKind>(() => playbackKind(this.src()));
  protected readonly youtubeSrc = computed<SafeResourceUrl | null>(() => {
    const embed = youtubePlayerUrl(this.src());
    return embed ? this.sanitizer.bypassSecurityTrustResourceUrl(embed) : null;
  });

  constructor() {
    afterNextRender(() => {
      effect(() => {
        this.src();
        this.kind();
        void this.attachStream();
      });
    });
  }

  ngOnDestroy(): void {
    void this.player?.destroy();
    this.player = null;
  }

  protected blockCapture(event: Event): void {
    event.preventDefault();
  }

  @HostListener('document:fullscreenchange')
  @HostListener('document:webkitfullscreenchange')
  protected syncFullscreen(): void {
    const shell = this.shellRef()?.nativeElement;
    this.isFullscreen.set(Boolean(shell && activeFullscreenElement() === shell));
  }

  protected toggleFullscreen(): void {
    const shell = this.shellRef()?.nativeElement;
    if (!shell) {
      return;
    }
    if (activeFullscreenElement()) {
      void exitFullscreen();
      return;
    }
    void enterFullscreen(shell);
  }

  private async attachStream(): Promise<void> {
    if (this.kind() !== 'stream') {
      return;
    }
    const video = this.videoRef()?.nativeElement;
    const url = this.src().trim();
    if (!video || !url || this.streamUrl === url) {
      return;
    }
    this.streamUrl = url;
    shaka.polyfill.installAll();
    if (!shaka.Player.isBrowserSupported()) {
      return;
    }
    this.player = new shaka.Player(video);
    const license = environment.drmLicenseUrl;
    if (license) {
      this.player.configure({
        drm: {
          servers: {
            'com.widevine.alpha': license,
            'com.microsoft.playready': license,
          },
        },
      });
    }
    try {
      await this.player.load(url);
    } catch {
      this.streamUrl = '';
    }
  }
}

function activeFullscreenElement(): Element | null {
  const doc = document as Document & { webkitFullscreenElement?: Element | null };
  return document.fullscreenElement || doc.webkitFullscreenElement || null;
}

function enterFullscreen(el: HTMLElement): Promise<void> | void {
  if (el.requestFullscreen) {
    return el.requestFullscreen();
  }
  const legacy = el as HTMLElement & { webkitRequestFullscreen?: () => void };
  legacy.webkitRequestFullscreen?.();
}

function exitFullscreen(): Promise<void> | void {
  if (document.exitFullscreen) {
    return document.exitFullscreen();
  }
  const legacy = document as Document & { webkitExitFullscreen?: () => void };
  legacy.webkitExitFullscreen?.();
}

function playbackKind(url: string): PlaybackKind {
  const value = url.trim();
  if (!value) {
    return 'none';
  }
  if (youtubePlayerUrl(value)) {
    return 'youtube';
  }
  return 'stream';
}

function youtubePlayerUrl(url: string): string | null {
  if (!url) {
    return null;
  }
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    let id = '';
    if (host === 'youtu.be') {
      id = parsed.pathname.split('/').filter(Boolean)[0] ?? '';
    } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      id = parsed.searchParams.get('v') || parsed.pathname.match(/\/embed\/([A-Za-z0-9_-]{11})/)?.[1] || '';
    } else {
      return null;
    }
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) {
      return null;
    }
    const params = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      iv_load_policy: '3',
      playsinline: '1',
      disablekb: '1',
      fs: '0',
      controls: '1',
    });
    return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
  } catch {
    return null;
  }
}
