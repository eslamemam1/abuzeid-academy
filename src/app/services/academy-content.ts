import { Injectable, signal } from '@angular/core';
import { supabase } from '../core/supabase-client';
import {
  AboutPill,
  AcademyInfo,
  ClassTrack,
  EMPTY_ACADEMY,
  FaqItem,
  SiteStat,
  WhyFeature,
  asAbuzeidName,
} from '../models/content';
import { Instructor } from '../models/course';

export interface NavItem {
  path: string;
  label: string;
  exact?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AcademyContentService {
  readonly academy = signal<AcademyInfo>(EMPTY_ACADEMY);
  readonly instructors = signal<Instructor[]>([]);
  readonly whyFeatures = signal<WhyFeature[]>([]);
  readonly classTracks = signal<ClassTrack[]>([]);
  readonly faqs = signal<FaqItem[]>([]);
  readonly stats = signal<SiteStat[]>([]);
  readonly aboutPills = signal<AboutPill[]>([]);
  readonly loaded = signal(false);

  readonly publicNav: NavItem[] = [
    { path: '/', label: 'الرئيسية', exact: true },
    { path: '/courses', label: 'المواد' },
    { path: '/about', label: 'عن الأكاديمية' },
    { path: '/certificate', label: 'تحقق الشهادة' },
    { path: '/contact', label: 'اتصل بنا' },
  ];

  readonly teacherNav: NavItem[] = [
    { path: '/teacher', label: 'نظرة عامة', exact: true },
    { path: '/teacher/courses', label: 'المواد' },
    { path: '/teacher/students', label: 'الطلاب' },
    { path: '/teacher/grades', label: 'رصد الدرجات' },
    { path: '/teacher/messages', label: 'الرسائل' },
  ];

  readonly teacherEyebrow = 'لوحة المهندس إسلام أبو زيد';
  readonly studentEyebrow = 'حساب الطالب';

  constructor() {
    void this.refresh();
  }

  async refresh(): Promise<void> {
    const [settings, instructorRows, featureRows, trackRows, faqRows, statRows, pillRows] = await Promise.all([
      supabase.from('academy_settings').select('*').eq('id', 'main').maybeSingle(),
      supabase.from('instructors').select('*').order('sort_order'),
      supabase.from('why_features').select('*').order('sort_order'),
      supabase.from('class_tracks').select('*').order('sort_order'),
      supabase.from('faqs').select('*').order('sort_order'),
      supabase.from('site_stats').select('*').order('sort_order'),
      supabase.from('about_pills').select('*').order('sort_order'),
    ]);

    if (settings.data) {
      const row = settings.data as Record<string, string>;
      this.academy.set({
        name: row['name'],
        founder: asAbuzeidName(row['founder']),
        founderFull: asAbuzeidName(row['founder_full']),
        location: row['location'],
        system: row['system'],
        tagline: row['tagline'],
        heroKicker: row['hero_kicker'],
        heroTitle: row['hero_title'],
        heroLead: row['hero_lead'],
        heroCode: row['hero_code'],
        whyTitle: asAbuzeidName(row['why_title']),
        whyLead: row['why_lead'],
        tracksEyebrow: row['tracks_eyebrow'],
        tracksTitle: row['tracks_title'],
        tracksLead: row['tracks_lead'],
        labEyebrow: row['lab_eyebrow'],
        labTitle: row['lab_title'],
        labLead: row['lab_lead'],
        aboutTitle: asAbuzeidName(row['about_title']),
        faqTitle: row['faq_title'],
        playgroundCode: row['playground_code'],
      });
    }

    this.instructors.set(
      ((instructorRows.data ?? []) as Array<{ name: string; role: string; bio: string }>).map((row) => ({
        name: asAbuzeidName(row.name),
        role: asAbuzeidName(row.role).replace(' • إسلام أبو زيد', '') || 'مؤسس أكاديمية أبو زيد',
        bio: asAbuzeidName(row.bio),
      })),
    );
    this.whyFeatures.set(
      ((featureRows.data ?? []) as Array<{ title: string; body: string }>).map((row) => ({
        title: row.title,
        text: row.body,
      })),
    );
    this.classTracks.set(
      ((trackRows.data ?? []) as Array<{ slug: string; kicker: string; title: string; code: string; body: string }>).map(
        (row) => ({
          id: row.slug,
          kicker: row.kicker,
          title: row.title,
          code: row.code,
          text: row.body,
        }),
      ),
    );
    this.faqs.set(
      ((faqRows.data ?? []) as Array<{ question: string; answer: string }>).map((row) => ({
        q: row.question,
        a: row.answer,
      })),
    );
    this.stats.set(
      ((statRows.data ?? []) as Array<{ value: string; label: string }>).map((row) => ({
        value: row.value,
        label: row.label,
      })),
    );
    this.aboutPills.set(
      ((pillRows.data ?? []) as Array<{ title: string; body: string }>).map((row) => ({
        title: row.title,
        text: row.body,
      })),
    );
    this.loaded.set(true);
  }
}
