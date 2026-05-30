import React from 'react';

/**
 * Renders a plain string with lightweight inline markup into React nodes:
 *   **text** -> <strong>   *text* -> <em>
 * Used for SEO copy stored in translations so we can bold/italicize key terms
 * without HTML-in-strings or dangerouslySetInnerHTML.
 */
export function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] !== undefined) parts.push(<strong key={key++}>{m[1]}</strong>);
    else parts.push(<em key={key++}>{m[2]}</em>);
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
