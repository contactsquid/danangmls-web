'use client';

// Last-resort boundary: only fires if the root layout itself throws, which
// app/error.tsx can't catch (it renders *inside* the root layout). Must
// supply its own <html>/<body> since the layout is being replaced. Deliberately
// minimal — this path should be rare — but bilingual, since Supabase's own
// send-one-template-per-event limitation already established the pattern of a
// single message serving both languages (see docs/agent-portal-smtp.md).
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-full flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-sm w-full text-center bg-white rounded-xl border border-slate-200 p-8">
          <h1 className="text-lg font-bold text-slate-900 mb-2">
            Something went wrong · Đã xảy ra lỗi
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            Please try again, or reload the page.
            <br />
            Vui lòng thử lại hoặc tải lại trang.
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Try again · Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}
