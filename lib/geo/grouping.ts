// Which map listings merge into a numbered circle. Blake, 2026-09-26: circles only
// for 11 or more — anything smaller always shows as individual price tags.
// Points are screen pixels at the current zoom (Leaflet's map.project), binned into
// a fixed world-pixel grid so panning doesn't reshuffle the groups.
export const MIN_GROUP = 11;

export interface GroupPoint { id: number; x: number; y: number }
export interface Group { x: number; y: number; ids: number[] }

export function groupPoints(points: GroupPoint[], cellPx: number, minGroup = MIN_GROUP): { singles: number[]; groups: Group[] } {
  const cells = new Map<string, GroupPoint[]>();
  for (const p of points) {
    const key = `${Math.floor(p.x / cellPx)},${Math.floor(p.y / cellPx)}`;
    const cell = cells.get(key);
    if (cell) cell.push(p); else cells.set(key, [p]);
  }
  const singles: number[] = [];
  let groups: (Group & { sx: number; sy: number })[] = [];
  for (const cell of cells.values()) {
    if (cell.length < minGroup) { for (const p of cell) singles.push(p.id); continue; }
    const sx = cell.reduce((s, p) => s + p.x, 0), sy = cell.reduce((s, p) => s + p.y, 0);
    groups.push({ x: sx / cell.length, y: sy / cell.length, sx, sy, ids: cell.map(p => p.id) });
  }
  // A crowd straddling a cell edge makes two circles side by side, drawn on top
  // of each other. Merge any two whose centres are closer than a cell.
  for (let merged = true; merged; ) {
    merged = false;
    outer: for (let i = 0; i < groups.length; i++) for (let j = i + 1; j < groups.length; j++) {
      const a = groups[i], b = groups[j];
      if (Math.hypot(a.x - b.x, a.y - b.y) >= cellPx) continue;
      const ids = [...a.ids, ...b.ids], sx = a.sx + b.sx, sy = a.sy + b.sy;
      groups[i] = { x: sx / ids.length, y: sy / ids.length, sx, sy, ids };
      groups = groups.filter((_, k) => k !== j);
      merged = true;
      break outer;
    }
  }
  return { singles, groups: groups.map(({ x, y, ids }) => ({ x, y, ids })) };
}

export interface Tag { id: number; x: number; y: number; w: number; h: number; pinned?: boolean }

/** Rough on-screen width of a price tag: padding + icon + gap + text at 13px bold. */
export function tagWidthPx(price: string): number {
  return 18 + 15 + 5 + price.length * 7.6;
}

const hits = (a: Tag, b: Tag) => Math.abs(a.x - b.x) * 2 < a.w + b.w + 4 && Math.abs(a.y - b.y) * 2 < a.h + b.h + 4;

/** With circles only for 11+, up to 10 tags can share a spot and pile into an
 *  unreadable stack. Nudge each tag to the nearest free position within maxShift px
 *  that canPlace accepts; a tag with no free spot stays put. Pinned tags (an open
 *  popup) never move. */
export function declutter(tags: Tag[], maxShift: number, canPlace: (t: Tag) => boolean = () => true): Tag[] {
  // Candidate offsets on a 6px lattice, nearest first.
  const offsets: [number, number][] = [];
  for (let dy = -maxShift; dy <= maxShift; dy += 6)
    for (let dx = -maxShift; dx <= maxShift; dx += 6)
      if (Math.hypot(dx, dy) <= maxShift) offsets.push([dx, dy]);
  offsets.sort((a, b) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1]));

  // Placed tags, bucketed so each check only looks at close neighbours.
  const B = 120;
  const buckets = new Map<string, Tag[]>();
  const near = (t: Tag) => {
    const res: Tag[] = [];
    const bx = Math.floor(t.x / B), by = Math.floor(t.y / B);
    for (let i = bx - 1; i <= bx + 1; i++) for (let j = by - 1; j <= by + 1; j++) res.push(...(buckets.get(`${i},${j}`) ?? []));
    return res;
  };
  const place = (t: Tag) => {
    const k = `${Math.floor(t.x / B)},${Math.floor(t.y / B)}`;
    const b = buckets.get(k); if (b) b.push(t); else buckets.set(k, [t]);
  };

  const out: Tag[] = [];
  const order = [...tags].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || a.y - b.y || a.x - b.x);
  for (const t of order) {
    let spot = t;
    if (!t.pinned) {
      for (const [dx, dy] of offsets) {
        const c = { ...t, x: t.x + dx, y: t.y + dy };
        // canPlace keeps a nudged tag inside its ward/district and off water.
        if ((dx || dy) && !canPlace(c)) continue;
        if (!near(c).some(p => hits(c, p))) { spot = c; break; }
      }
    }
    place(spot);
    out.push(spot);
  }
  return out.sort((a, b) => a.id - b.id);
}
