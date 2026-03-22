'use client';

import { usePathname } from 'next/navigation';
import { translations, type Lang, type Translations } from '@/lib/translations';

export function useLanguage(): { lang: Lang; t: Translations } {
  const pathname = usePathname();
  const lang: Lang = pathname.startsWith('/vi') ? 'vi' : 'en';
  return { lang, t: translations[lang] };
}
