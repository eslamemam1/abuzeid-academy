import { Injectable } from '@angular/core';
import { COURSES } from '../data/academy.data';
import { Course, CourseCategory } from '../models/course';

@Injectable({ providedIn: 'root' })
export class CourseService {
  getAll(): Course[] {
    return COURSES;
  }

  getFeatured(): Course[] {
    return COURSES.filter((course) => course.featured);
  }

  getById(id: string): Course | undefined {
    return COURSES.find((course) => course.id === id);
  }

  search(term: string, category: CourseCategory | 'all' = 'all'): Course[] {
    const query = term.trim();
    return COURSES.filter((course) => {
      const matchesCategory = category === 'all' || course.category === category;
      const matchesQuery =
        !query ||
        course.title.includes(query) ||
        course.instructor.includes(query) ||
        course.categoryLabel.includes(query);
      return matchesCategory && matchesQuery;
    });
  }
}
