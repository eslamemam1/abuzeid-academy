import { Component, computed, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CourseService } from '../../services/course';
import { AcademyContentService } from '../../services/academy-content';
import { CourseCard } from '../../shared';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, RouterLink, CourseCard],
  templateUrl: './home.html',
})
export class Home {
  private readonly coursesApi = inject(CourseService);
  private readonly content = inject(AcademyContentService);
  private readonly router = inject(Router);

  protected readonly search = new FormControl('', { nonNullable: true });
  protected readonly featured = computed(() => this.coursesApi.getFeatured());
  protected readonly instructors = this.content.instructors;

  protected goToCourses(): void {
    const q = this.search.value.trim();
    void this.router.navigate(['/courses'], { queryParams: q ? { q } : {} });
  }
}
