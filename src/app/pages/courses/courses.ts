import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { CourseService } from '../../services/course';
import { AcademyContentService } from '../../services/academy-content';
import { FILTERS, CourseFilter } from '../../models/course';
import { yearLabel } from '../../models/labels';
import { CourseCard, PageHero } from '../../shared';

@Component({
  selector: 'app-courses',
  imports: [ReactiveFormsModule, CourseCard, PageHero],
  templateUrl: './courses.html',
})
export class Courses {
  private readonly coursesApi = inject(CourseService);
  private readonly content = inject(AcademyContentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly academy = this.content.academy;
  protected readonly classTracks = this.content.classTracks;
  protected readonly search = new FormControl('', { nonNullable: true });
  protected readonly selectedCategory = signal<CourseFilter>('all');
  protected readonly studentYear = computed(() => this.coursesApi.studentYear());
  protected readonly categories = computed(() => {
    const year = this.studentYear();
    if (!year) {
      return FILTERS;
    }
    return [
      { id: 'all' as const, label: year === 'year1' ? 'مواد الصف الأول الثانوي' : 'مواد الصف الثاني الثانوي' },
      { id: 'basics' as const, label: 'مفاهيم أساسية' },
      { id: 'programming' as const, label: 'البرمجة' },
      { id: 'ai' as const, label: 'الذكاء الاصطناعي' },
    ];
  });
  protected readonly heroEyebrow = computed(() => {
    const year = this.studentYear();
    return year ? `مواد ${yearLabel(year)} فقط` : 'مواد السنة الأولى والثانية';
  });
  protected readonly heroSubtitle = computed(() => {
    const year = this.studentYear();
    return year
      ? `أنت مسجّل في ${yearLabel(year)}، فهتظهر لك مواد السنة دي بس.`
      : 'بكالوريا مصرية • نظام سنوي • شرح المهندس إسلام أبو زيد';
  });

  private readonly query = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('q') ?? '')),
    { initialValue: '' },
  );

  protected readonly results = computed(() => {
    return this.coursesApi.search(this.query(), this.selectedCategory());
  });

  constructor() {
    const initial = this.route.snapshot.queryParamMap.get('q') ?? '';
    this.search.setValue(initial);
    const track = this.route.snapshot.queryParamMap.get('track');
    if (this.isFilter(track)) {
      this.setCategory(track);
    }
  }

  protected startTrack(id: string): void {
    if (this.isFilter(id)) {
      this.setCategory(id);
      void this.router.navigate([], {
        queryParams: { track: id },
        queryParamsHandling: 'merge',
      });
    }
    document.getElementById('course-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected applySearch(): void {
    void this.router.navigate([], {
      queryParams: { q: this.search.value.trim() || null },
      queryParamsHandling: 'merge',
    });
  }

  protected setCategory(id: CourseFilter): void {
    if (this.studentYear() && (id === 'year1' || id === 'year2') && id !== this.studentYear()) {
      this.selectedCategory.set('all');
      return;
    }
    this.selectedCategory.set(id);
  }

  private isFilter(value: string | null): value is CourseFilter {
    return (
      value === 'all' ||
      value === 'programming' ||
      value === 'ai' ||
      value === 'year1' ||
      value === 'year2' ||
      value === 'basics'
    );
  }
}
