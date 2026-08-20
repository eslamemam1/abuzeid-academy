import { Injectable, signal } from '@angular/core';
import { supabase } from '../core/supabase-client';
import { Profile, YearLevel } from '../models/account';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly studentRows = signal<Profile[]>([]);
  readonly students = this.studentRows.asReadonly();

  async refresh(): Promise<Profile[]> {
    const rows = await this.list();
    this.studentRows.set(rows);
    return rows;
  }

  async list(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('created_at', { ascending: false });
    if (error) {
      throw error;
    }
    return (data ?? []) as Profile[];
  }

  async count(): Promise<number> {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student');
    if (error) {
      throw error;
    }
    return count ?? 0;
  }

  async updateYearLevel(studentId: string, yearLevel: YearLevel): Promise<void> {
    const { error } = await supabase.from('profiles').update({ year_level: yearLevel }).eq('id', studentId);
    if (error) {
      throw error;
    }
  }
}
