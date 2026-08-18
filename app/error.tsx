'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

// Catches any unhandled error thrown while rendering a page or running a
// server action, so agents/visitors get an on-brand message instead of
// Next's raw crash screen ("This page couldn't load" / "Application error").
// The most common trigger in practice: a photo upload that blows past the
// server action body-size limit (next.config.ts bodySizeLimit: '6mb') before
// our own type/size checks in the action ever run — that failure surfaces
// here as a generic Error, not the friendly inline photoType/photoSize copy.
const COPY = {
  en: {
    uploadHeading: "That photo didn't upload",
    uploadBody: 'We only accept plain JPG, PNG, or WebP images, 5 MB or smaller. Please choose a different photo and try again.',
    heading: 'Something went wrong',
    body: 'This page ran into a problem. Please try again, or head back to the homepage.',
    retry: 'Try again',
    home: 'Back to homepage',
  },
  vi: {
    uploadHeading: 'Ảnh đó không tải lên được',
    uploadBody: 'Chúng tôi chỉ nhận ảnh định dạng JPG, PNG hoặc WebP, tối đa 5 MB. Vui lòng chọn ảnh khác và thử lại.',
    heading: 'Đã xảy ra lỗi',
    body: 'Trang này gặp sự cố. Vui lòng thử lại hoặc quay về trang chủ.',
    retry: 'Thử lại',
    home: 'Về trang chủ',
  },
};

// Best-effort match on the errors Next.js/undici throw when a server action
// request body exceeds bodySizeLimit (wording isn't officially stable API,
// so this is a heuristic, not a hard dependency).
const isUploadRelated = (message: string) =>
  /body exceeded|payload too large|request entity too large|413|content[- ]?length/i.test(message);

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname() ?? '';
  const isVi = pathname.startsWith('/vi');
  const t = isVi ? COPY.vi : COPY.en;
  const uploadError = isUploadRelated(error.message ?? '');

  useEffect(() => {
    console.error('[app-error-boundary]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="max-w-md w-full mx-auto px-4 sm:px-6 py-16 flex-1 text-center">
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            {uploadError ? t.uploadHeading : t.heading}
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            {uploadError ? t.uploadBody : t.body}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={reset}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              {t.retry}
            </button>
            <Link
              href={isVi ? '/vi' : '/'}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t.home}
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
