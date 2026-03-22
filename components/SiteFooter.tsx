'use client';

import { useLanguage } from './LanguageProvider';

export default function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-slate-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <span>{t.rights(new Date().getFullYear())}</span>
        <span>{t.updated}</span>
      </div>
    </footer>
  );
}
