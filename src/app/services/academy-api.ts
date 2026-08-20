import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase-client';
import { DbCourse, Enrollment, Exam, Grade, Profile, YearLevel } from '../models/account';

@Injectable({ providedIn: 'root' })
export class AcademyApi {
  async listCourses(): Promise<DbCourse[]> {
    const { data, error } = await supabase.from('courses').select('*').order('year_level');
    if (error) {
      throw error;
    }
    return (data ?? []) as DbCourse[];
  }

  async listStudents(): Promise<Profile[]> {
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

  async studentCount(): Promise<number> {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student');
    if (error) {
      throw error;
    }
    return count ?? 0;
  }

  async myEnrollments(studentId: string): Promise<Enrollment[]> {
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

  async updateYearLevel(studentId: string, yearLevel: YearLevel): Promise<void> {
    const { error } = await supabase.from('profiles').update({ year_level: yearLevel }).eq('id', studentId);
    if (error) {
      throw error;
    }
  }

  async listExams(): Promise<Exam[]> {
    const { data, error } = await supabase
      .from('exams')
      .select('*, courses(*)')
      .order('exam_date', { ascending: true, nullsFirst: false });
    if (error) {
      throw error;
    }
    return (data ?? []) as Exam[];
  }

  async createExam(input: { course_id: string; title: string; exam_date: string; total_marks: number }): Promise<void> {
    const { error } = await supabase.from('exams').insert(input);
    if (error) {
      throw error;
    }
  }

  async enrollmentsForCourse(courseId: string): Promise<Enrollment[]> {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*, profiles!student_id(*)')
      .eq('course_id', courseId);
    if (error) {
      throw error;
    }
    return (data ?? []) as Enrollment[];
  }

  async gradesForExam(examId: string): Promise<Grade[]> {
    const { data, error } = await supabase.from('grades').select('*').eq('exam_id', examId);
    if (error) {
      throw error;
    }
    return (data ?? []) as Grade[];
  }

  async myGrades(studentId: string): Promise<Grade[]> {
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

  async saveGrade(input: { exam_id: string; student_id: string; score: number; notes: string }): Promise<void> {
    const { error } = await supabase.from('grades').upsert(input, { onConflict: 'exam_id,student_id' });
    if (error) {
      throw error;
    }
  }
}
