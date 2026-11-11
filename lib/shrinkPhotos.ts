// Client-side photo downscaling for the listing forms.
//
// Phone photos are 3-10 MB each. Ten of them in one Server Action body blow
// past next.config.ts's serverActions bodySizeLimit ('6mb') and Vercel's own
// ~4.5 MB request cap, so the upload failed before our action ran. We shrink
// each photo in the browser (long edge 1600px, JPEG) so ten fit comfortably.
// If a file can't be decoded here we hand it back untouched and let the
// server-side checks decide.

export const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
/** Total budget for one submission's photos — under Vercel's 4.5 MB body cap. */
const TOTAL_BUDGET = 3.8 * 1024 * 1024;

async function shrinkOne(file: File, maxEdge: number, quality: number): Promise<File> {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const scale = Math.min(1, maxEdge / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * scale));
    const h = Math.max(1, Math.round(bmp.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.fillStyle = '#fff'; // flatten PNG/WebP transparency for JPEG
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close?.();
    const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', quality));
    if (!blob || blob.size >= file.size) return file; // already smaller than our output
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', {
      type: 'image/jpeg',
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  }
}

/** Filters to allowed types, shrinks, and returns the files plus how many were rejected. */
export async function prepareListingPhotos(picked: File[]): Promise<{ files: File[]; rejected: number }> {
  const allowed = picked.filter(f => ALLOWED_PHOTO_TYPES.includes(f.type));
  let files = await Promise.all(allowed.map(f => shrinkOne(f, 1600, 0.82)));
  if (files.reduce((n, f) => n + f.size, 0) > TOTAL_BUDGET) {
    files = await Promise.all(allowed.map(f => shrinkOne(f, 1280, 0.68)));
  }
  const ok = files.filter(f => f.size <= MAX_PHOTO_BYTES);
  return { files: ok, rejected: picked.length - ok.length };
}
