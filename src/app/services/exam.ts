import { Injectable, signal } from '@angular/core';
import { supabase } from '../core/supabase-client';
import { Exam } from '../models/account';

export interface ExamInput {
  course_id: string;
  title: string;
  exam_date: string;
  total_marks: number;
}

@Injectable({ providedIn: 'root' })
export class ExamService {
  private readonly examRows = signal<Exam[]>([]);
  readonly exams = this.examRows.asReadonly();

  async refresh(): Promise<Exam[]> {
    const rows = await this.list();
    this.examRows.set(rows);
    return rows;
  }

  async list(): Promise<Exam[]> {
    const { data, error } = await supabase
      .from('exams')
      .select('*, courses(*)')
      .order('exam_date', { ascending: true, nullsFirst: false });
    if (error) {
      throw error;
    }
    return (data ?? []) as Exam[];
  }

  async create(input: ExamInput): Promise<void> {
    const { error } = await supabase.from('exams').insert(input);
    if (error) {
      throw error;
    }
    await this.refresh();
  }
}
