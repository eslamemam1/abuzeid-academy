import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CourseCard } from '../../shared/course-card/course-card';
import { CourseService } from '../../services/course';
import { INSTRUCTORS } from '../../data/academy.data';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, RouterLink, CourseCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly coursesApi = inject(CourseService);
  private readonly router = inject(Router);

  protected readonly search = new FormControl('', { nonNullable: true });
  protected readonly featured = this.coursesApi.getFeatured();
  protected readonly instructors = INSTRUCTORS;

  protected goToCourses(): void {
    const q = this.search.value.trim();
    void this.router.navigate(['/courses'], { queryParams: q ? { q } : {} });
  }
}
