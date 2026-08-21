import { Injectable, inject, signal } from '@angular/core';
import { supabase } from '../core/supabase-client';
import { DbCourse, YearLevel } from '../models/account';
import { Course, CourseFilter, CourseType } from '../models/course';
import { categoryLabel, typeLabel, yearLabel } from '../models/labels';
import { AuthService } from './auth';

export interface CourseInput {
  title: string;
  category: DbCourse['category'];
  year_level: YearLevel;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly auth = inject(AuthService);
  private readonly courseRows = signal<DbCourse[]>([]);
  private readonly catalogRows = signal<Course[]>([]);

  readonly courses = this.courseRows.asReadonly();
  readonly catalog = this.catalogRows.asReadonly();
  readonly loaded = signal(false);

  constructor() {
    void this.refresh();
  }

  async refresh(): Promise<DbCourse[]> {
    const rows = await this.list();
    this.courseRows.set(rows);
    this.catalogRows.set(rows.map((row) => this.mapCourse(row)));
    this.loaded.set(true);
    return rows;
  }

  async list(): Promise<DbCourse[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('featured', { ascending: false })
      .order('year_level');
    if (error) {
      throw error;
    }
    return (data ?? []) as DbCourse[];
  }

  async create(input: CourseInput): Promise<DbCourse> {
    const { data, error } = await supabase
      .from('courses')
      .insert({
        slug: this.slugFromTitle(input.title),
        title: input.title.trim(),
        category: input.category,
        year_level: input.year_level,
        description: input.description.trim() || null,
      })
      .select('*')
      .single();
    if (error) {
      throw error;
    }
    await this.refresh();
    return data as DbCourse;
  }

  async delete(courseId: string): Promise<void> {
    const { error } = await supabase.from('courses').delete().eq('id', courseId);
    if (error) {
      throw error;
    }
    await this.refresh();
  }

  getAll(): Course[] {
    return this.visibleCatalog();
  }

  getFeatured(): Course[] {
    const all = this.visibleCatalog();
    const featured = all.filter((course) => course.featured);
    return (featured.length ? featured : all).slice(0, 4);
  }

  getById(id: string): Course | undefined {
    return this.visibleCatalog().find((course) => course.id === id);
  }

  search(term: string, filter: CourseFilter = 'all'): Course[] {
    const query = term.trim();
    const lockedYear = this.studentYear();
    return this.visibleCatalog().filter((course) => {
      const matchesYear = !lockedYear || course.level === lockedYear;
      const matchesFilter =
        filter === 'all' ||
        course.category === filter ||
        (!lockedYear && course.level === filter);
      const matchesQuery =
        !query ||
        course.title.includes(query) ||
        course.instructor.includes(query) ||
        course.categoryLabel.includes(query) ||
        course.levelLabel.includes(query);
      return matchesYear && matchesFilter && matchesQuery;
    });
  }

  studentYear(): YearLevel | null {
    return this.auth.isStudent() ? this.auth.profile()?.year_level ?? null : null;
  }

  private visibleCatalog(): Course[] {
    const year = this.studentYear();
    if (!this.auth.isStudent()) {
      return this.catalog();
    }
    if (!year) {
      return [];
    }
    return this.catalog().filter((course) => course.level === year);
  }

  private slugFromTitle(title: string): string {
    const ascii = title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const suffix = crypto.randomUUID().slice(0, 8);
    return ascii ? `${ascii}-${suffix}` : `course-${suffix}`;
  }

  private mapCourse(row: DbCourse): Course {
    const type = (row.course_type || 'online') as CourseType;
    return {
      id: row.slug || row.id,
      title: row.title,
      category: row.category,
      categoryLabel: categoryLabel(row.category),
      level: row.year_level,
      levelLabel: yearLabel(row.year_level),
      type,
      typeLabel: typeLabel(type),
      instructor: row.instructor || 'م. إسلام إمام',
      price: Number(row.price ?? 0),
      duration: row.duration || 'نظام سنوي',
      date: row.course_date || 'العام الدراسي الحالي',
      students: Number(row.students ?? 0),
      rating: Number(row.rating ?? 5),
      lessons: Number(row.lessons ?? 0),
      featured: Boolean(row.featured),
      description: row.description || 'دورة برمجة وذكاء اصطناعي لطلاب البكالوريا.',
      outcomes: row.outcomes ?? [],
    };
  }
}
