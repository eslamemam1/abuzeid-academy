import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase-client';
import { Enrollment } from '../models/account';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  async forStudent(studentId: string): Promise<Enrollment[]> {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*, courses(*)')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    if (error) {
      throw error;
    }
    return (data ?? []) as Enrollment[];
  }

  async forCourse(courseId: string): Promise<Enrollment[]> {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*, profiles!student_id(*)')
      .eq('course_id', courseId);
    if (error) {
      throw error;
    }
    return (data ?? []) as Enrollment[];
  }

  async enroll(studentId: string, courseId: string): Promise<void> {
    const { error } = await supabase.from('enrollments').insert({
      student_id: studentId,
      course_id: courseId,
      status: 'active',
    });
    if (error) {
      throw error;
    }
  }
}
