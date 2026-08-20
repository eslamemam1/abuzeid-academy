import { Injectable, signal } from '@angular/core';
import { supabase } from '../core/supabase-client';
import { ACADEMY } from '../data/academy.data';
import { DbCourse, YearLevel } from '../models/account';
import { Course, CourseFilter } from '../models/course';
import { categoryLabel, yearLabel } from '../models/labels';

export interface CourseInput {
  title: string;
  category: DbCourse['category'];
  year_level: YearLevel;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class CourseService {
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
    const { data, error } = await supabase.from('courses').select('*').order('year_level');
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
    return this.catalog();
  }

  getFeatured(): Course[] {
    return this.catalog().slice(0, 6);
  }

  getById(id: string): Course | undefined {
    return this.catalog().find((course) => course.id === id);
  }

  search(term: string, filter: CourseFilter = 'all'): Course[] {
    const query = term.trim();
    return this.catalog().filter((course) => {
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
    return {
      id: row.slug || row.id,
      title: row.title,
      category: row.category,
      categoryLabel: categoryLabel(row.category),
      level: row.year_level,
      levelLabel: yearLabel(row.year_level),
      type: 'online',
      typeLabel: 'دورة أونلاين',
      instructor: ACADEMY.founder,
      price: 0,
      duration: 'نظام سنوي',
      date: 'العام الدراسي الحالي',
      students: 0,
      rating: 5,
      lessons: 0,
      description: row.description || 'دورة برمجة وذكاء اصطناعي لطلاب البكالوريا.',
      outcomes: [],
    };
  }
}
