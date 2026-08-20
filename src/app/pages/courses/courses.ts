import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { CourseService } from '../../services/course';
import { FILTERS, CourseFilter } from '../../models/course';
import { CourseCard, PageHero } from '../../shared';

@Component({
  selector: 'app-courses',
  imports: [ReactiveFormsModule, CourseCard, PageHero],
  templateUrl: './courses.html',
})
export class Courses {
  private readonly coursesApi = inject(CourseService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly categories = FILTERS;
  protected readonly search = new FormControl('', { nonNullable: true });
  protected readonly selectedCategory = signal<CourseFilter>('all');

  private readonly query = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('q') ?? '')),
    { initialValue: '' },
  );

  protected readonly results = computed(() =>
    this.coursesApi.search(this.query(), this.selectedCategory()),
  );

  constructor() {
    const initial = this.route.snapshot.queryParamMap.get('q') ?? '';
    this.search.setValue(initial);
  }

  protected applySearch(): void {
    void this.router.navigate([], {
      queryParams: { q: this.search.value.trim() || null },
      queryParamsHandling: 'merge',
    });
  }

  protected setCategory(id: CourseFilter): void {
    this.selectedCategory.set(id);
  }
}
