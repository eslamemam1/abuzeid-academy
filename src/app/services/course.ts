import { Injectable } from '@angular/core';
import { COURSES } from '../data/academy.data';
import { Course, CourseFilter } from '../models/course';

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

  search(term: string, filter: CourseFilter = 'all'): Course[] {
    const query = term.trim();
    return COURSES.filter((course) => {
      const matchesFilter =
        filter === 'all' || course.category === filter || course.level === filter;
      const matchesQuery =
        !query ||
        course.title.includes(query) ||
        course.instructor.includes(query) ||
        course.categoryLabel.includes(query) ||
        course.levelLabel.includes(query);
      return matchesFilter && matchesQuery;
    });
  }
}
