import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase-client';
import { Grade } from '../models/account';

export interface GradeInput {
  exam_id: string;
  student_id: string;
  score: number;
  notes: string;
}

@Injectable({ providedIn: 'root' })
export class GradeService {
  async forExam(examId: string): Promise<Grade[]> {
    const { data, error } = await supabase.from('grades').select('*').eq('exam_id', examId);
    if (error) {
      throw error;
    }
    return (data ?? []) as Grade[];
  }

  async forStudent(studentId: string): Promise<Grade[]> {
    const { data, error } = await supabase
      .from('grades')
      .select('*, exams(*, courses(*))')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    if (error) {
      throw error;
    }
    return (data ?? []) as Grade[];
  }

  async save(input: GradeInput): Promise<void> {
    const { error } = await supabase.from('grades').upsert(input, { onConflict: 'exam_id,student_id' });
    if (error) {
      throw error;
    }
  }
}
