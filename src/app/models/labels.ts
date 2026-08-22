export function yearLabel(level: string | null | undefined): string {
  if (level === 'year1') {
    return 'الصف الأول الثانوي';
  }
  if (level === 'year2') {
    return 'الصف الثاني الثانوي';
  }
  if (level === 'basics') {
    return 'مفاهيم أساسية';
  }
  return 'غير محددة';
}

export function typeLabel(type: string | null | undefined): string {
  if (type === 'recorded') {
    return 'دورة مسجلة';
  }
  if (type === 'in-person') {
    return 'حضور';
  }
  return 'دورة أونلاين';
}

export function categoryLabel(category: string | null | undefined): string {
  if (category === 'programming') {
    return 'برمجة';
  }
  if (category === 'ai') {
    return 'ذكاء اصطناعي';
  }
  return category || '';
}
