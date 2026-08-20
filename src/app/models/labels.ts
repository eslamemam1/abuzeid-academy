export function yearLabel(level: string | null | undefined): string {
  if (level === 'year1') {
    return 'سنة أولى بكالوريا';
  }
  if (level === 'year2') {
    return 'سنة ثانية بكالوريا';
  }
  return 'غير محددة';
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
