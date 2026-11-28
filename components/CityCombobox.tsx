'use client';

import { useId, useMemo, useRef, useState } from 'react';
import { foldName } from '@/lib/cities';
import { useLanguage } from './LanguageProvider';

const UI = {
  en: { none: 'No matching city', clear: 'Clear city' },
  vi: { none: 'Không tìm thấy thành phố', clear: 'Xóa thành phố' },
  ko: { none: '일치하는 도시가 없습니다', clear: '도시 지우기' },
  ru: { none: 'Город не найден', clear: 'Очистить город' },
} as const;

// City autocomplete (Blake, 2026-10-01): a plain dropdown stops working once there are
// 25+ cities, so this is a type-to-narrow box. Matching ignores accents ("da" finds
// Đà Nẵng and Đà Lạt) and checks every name a city goes by (English, Vietnamese,
// old spellings). Focusing the empty box shows the busiest cities, so a phone user
// can pick without typing. The search grids pass only cities that HAVE listings
// (no searching for what doesn't exist); the agent form passes every city in Vietnam.

export interface CityOption {
  slug: string;
  label: string;          // shown, in the page language
  hint?: string;          // second line: a count ("128 listings") or a province
  names?: string[];       // every other name to match on
  rank?: number;          // higher = shown first when nothing is typed
}

interface Props {
  options: CityOption[];
  value: string;                      // selected slug, '' = none
  onChange: (slug: string) => void;
  label: string;                      // accessible name, also the placeholder
  allLabel?: string;                  // when set, a first row that clears the choice ("All cities")
  id?: string;
  className?: string;
  required?: boolean;
  max?: number;                       // rows shown at once
}

export default function CityCombobox({ options, value, onChange, label, allLabel, id, className = '', required, max = 8 }: Props) {
  const { lang } = useLanguage();
  const ui = UI[lang as keyof typeof UI] ?? UI.en;
  const autoId = useId();
  const inputId = id ?? `city-${autoId}`;
  const listId = `${inputId}-list`;
  const selected = options.find(o => o.slug === value);
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo(() => options.map(o => ({ o, keys: [o.label, ...(o.names ?? [])].map(foldName) })), [options]);

  const matches = useMemo(() => {
    const q = foldName(text);
    if (!q) return [...options].sort((a, b) => (b.rank ?? 0) - (a.rank ?? 0)).slice(0, max);
    const starts: CityOption[] = [], word: CityOption[] = [], inside: CityOption[] = [];
    for (const { o, keys } of index) {
      if (keys.some(k => k.startsWith(q))) starts.push(o);
      else if (keys.some(k => k.split(/[\s–-]+/).some(w => w.startsWith(q)))) word.push(o);
      else if (q.length >= 3 && keys.some(k => k.includes(q))) inside.push(o);
    }
    const byRank = (a: CityOption, b: CityOption) => (b.rank ?? 0) - (a.rank ?? 0) || a.label.localeCompare(b.label);
    return [...starts.sort(byRank), ...word.sort(byRank), ...inside.sort(byRank)].slice(0, max);
  }, [text, index, options, max]);

  const rows: (CityOption | null)[] = allLabel ? [null, ...matches] : matches;   // null = "All cities"

  const choose = (o: CityOption | null) => {
    onChange(o ? o.slug : '');
    setText('');
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive(a => Math.min(a + 1, rows.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { if (open && rows[active] !== undefined) { e.preventDefault(); choose(rows[active]); } }
    else if (e.key === 'Escape') { setOpen(false); setText(''); }
  };

  const shown = open ? text : (selected?.label ?? '');

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={inputId} className="sr-only">{label}</label>
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && rows.length ? `${listId}-${active}` : undefined}
        autoComplete="off"
        required={required && !value}
        placeholder={selected ? selected.label : label}
        value={shown}
        onFocus={() => { setOpen(true); setActive(0); }}
        onBlur={() => setTimeout(() => { setOpen(false); setText(''); }, 120)}
        onChange={e => { setText(e.target.value); setOpen(true); setActive(allLabel && e.target.value ? 1 : 0); }}
        onKeyDown={onKey}
        className="w-full min-w-[12rem] border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-slate-500"
      />
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      {value && !open && (
        <button type="button" aria-label={ui.clear} onMouseDown={e => e.preventDefault()} onClick={() => choose(null)}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      )}
      {open && (
        <ul id={listId} role="listbox" aria-label={label}
          className="absolute z-30 mt-1 w-full min-w-[16rem] max-h-80 overflow-auto bg-white border border-slate-200 rounded-xl shadow-lg py-1">
          {rows.length === 0 && <li className="px-3 py-2 text-sm text-slate-500">{ui.none}</li>}
          {rows.map((o, i) => (
            <li key={o ? o.slug : '__all'} id={`${listId}-${i}`} role="option" aria-selected={i === active}
              onMouseDown={e => e.preventDefault()} onClick={() => choose(o)} onMouseEnter={() => setActive(i)}
              className={`px-3 py-2 cursor-pointer flex items-baseline justify-between gap-3 ${i === active ? 'bg-blue-50' : ''}`}>
              <span className={`text-sm ${o && o.slug === value ? 'font-semibold' : ''} text-slate-800`}>{o ? o.label : allLabel}</span>
              {o?.hint && <span className="text-xs text-slate-500 shrink-0">{o.hint}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
