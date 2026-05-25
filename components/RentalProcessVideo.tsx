'use client';

import { useLanguage } from './LanguageProvider';

// Hardcoded educational video about the Da Nang rental process. Rendered at the
// bottom of every for-rent listing detail page so prospective renters get
// context on what the process looks like before they reach out about a specific
// property. If we ever want to rotate this video, swap VIDEO_ID — the rest is
// content-agnostic.
const VIDEO_ID = '7JuTaRFLhEI';

export default function RentalProcessVideo() {
  const { lang } = useLanguage();
  const isVi = lang === 'vi';

  return (
    <section className="bg-slate-100 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {isVi ? 'Quy trình thuê nhà tại Đà Nẵng' : 'How Renting a House in Da Nang Works'}
        </h2>
        <p className="text-slate-600 mb-6">
          {isVi
            ? 'Xem hướng dẫn từng bước về quy trình thuê nhà tại Đà Nẵng — từ tham quan đến ký hợp đồng.'
            : 'A step-by-step walkthrough of the rental process in Da Nang — from viewing to signing the lease.'}
        </p>
        <div className="aspect-video bg-slate-200 rounded-xl overflow-hidden shadow-md">
          <iframe
            src={`https://www.youtube.com/embed/${VIDEO_ID}`}
            title={isVi ? 'Quy trình thuê nhà tại Đà Nẵng' : 'House Rental Process in Da Nang, Vietnam'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
