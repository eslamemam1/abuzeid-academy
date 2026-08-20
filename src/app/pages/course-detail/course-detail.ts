import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CourseService } from '../../services/course';

@Component({
  selector: 'app-course-detail',
  imports: [RouterLink],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.scss',
})
export class CourseDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly coursesApi = inject(CourseService);

  protected readonly course = toSignal(
    this.route.paramMap.pipe(map((params) => this.coursesApi.getById(params.get('id') ?? ''))),
    { initialValue: this.coursesApi.getById(this.route.snapshot.paramMap.get('id') ?? '') },
  );
}
