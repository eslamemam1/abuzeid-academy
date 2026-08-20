import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
}
