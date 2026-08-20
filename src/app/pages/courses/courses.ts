import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { CourseCard } from '../../shared/course-card/course-card';
import { CourseService } from '../../services/course';
import { CATEGORIES, CourseCategory } from '../../models/course';

@Component({
  selector: 'app-courses',
  imports: [ReactiveFormsModule, CourseCard],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses {
  private readonly coursesApi = inject(CourseService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly categories = CATEGORIES;
  protected readonly search = new FormControl('', { nonNullable: true });
  protected readonly selectedCategory = signal<CourseCategory | 'all'>('all');

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

  protected setCategory(id: CourseCategory | 'all'): void {
    this.selectedCategory.set(id);
  }
}
