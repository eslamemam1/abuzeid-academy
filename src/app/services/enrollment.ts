import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase-client';
import { Enrollment, DbCourse, YearLevel } from '../models/account';

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
    await this.assertSameYear(studentId, courseId);
    const { error } = await supabase.from('enrollments').upsert(
      {
        student_id: studentId,
        course_id: courseId,
        status: 'active',
      },
      { onConflict: 'student_id,course_id', ignoreDuplicates: true },
    );
    if (error) {
      throw error;
    }
  }

  async syncYearCourses(studentId: string, yearLevel: YearLevel, courses: DbCourse[]): Promise<void> {
    const rows = courses
      .filter((course) => course.year_level === yearLevel)
      .map((course) => ({
        student_id: studentId,
        course_id: course.id,
        status: 'active' as const,
      }));
    if (rows.length === 0) {
      return;
    }
    const { error } = await supabase
      .from('enrollments')
      .upsert(rows, { onConflict: 'student_id,course_id', ignoreDuplicates: true });
    if (error) {
      throw error;
    }
  }

  async enrollYearInCourse(courseId: string, yearLevel: YearLevel): Promise<void> {
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('year_level')
      .eq('id', courseId)
      .single();
    if (courseError) {
      throw courseError;
    }
    if (course?.year_level !== yearLevel) {
      throw new Error('YEAR_MISMATCH');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'student')
      .eq('year_level', yearLevel);
    if (error) {
      throw error;
    }
    const rows = (data ?? []).map((row) => ({
      student_id: row.id as string,
      course_id: courseId,
      status: 'active' as const,
    }));
    if (rows.length === 0) {
      return;
    }
    const { error: upsertError } = await supabase
      .from('enrollments')
      .upsert(rows, { onConflict: 'student_id,course_id', ignoreDuplicates: true });
    if (upsertError) {
      throw upsertError;
    }
  }

  private async assertSameYear(studentId: string, courseId: string): Promise<void> {
    const [{ data: profile, error: profileError }, { data: course, error: courseError }] =
      await Promise.all([
        supabase.from('profiles').select('role, year_level').eq('id', studentId).single(),
        supabase.from('courses').select('year_level').eq('id', courseId).single(),
      ]);
    if (profileError) {
      throw profileError;
    }
    if (courseError) {
      throw courseError;
    }
    if (profile?.role === 'student' && profile.year_level !== course?.year_level) {
      throw new Error('YEAR_MISMATCH');
    }
  }
}
