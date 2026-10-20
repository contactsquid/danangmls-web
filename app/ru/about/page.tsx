import type { Metadata } from 'next';
import { footerAlternates } from '@/lib/footerPages';

export const metadata: Metadata = {
  title: 'О DanangMLS',
  description: 'DanangMLS — база объявлений о продаже и аренде домов, квартир, вилл и земельных участков в Дананге и Хойане, Вьетнам. Объявления собираются от местных агентов и обновляются ежедневно.',
  alternates: footerAlternates('about', 'ru'),
};

export default function RuAboutPage() {
  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">О DanangMLS</h1>
        <p className="text-slate-600 leading-relaxed mb-4">
          DanangMLS — это база объявлений (MLS) о недвижимости в <strong>Дананге и Хойане, Вьетнам</strong>.
          Мы собираем дома, квартиры, виллы и земельные участки в аренду и на продажу в одном удобном каталоге
          с поиском, доступном на английском, вьетнамском, корейском и русском языках.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          Объявления поступают от местных агентов и собственников и обновляются ежедневно, поэтому вы видите то,
          что действительно сейчас есть на рынке. Каждое объявление ведет напрямую к тем, кто занимается
          объектом, — мы же делаем так, чтобы предложения было удобно просматривать и сравнивать.
        </p>
        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">География объявлений</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Аренда и продажа во всех районах Дананга — Хайтяу (Hai Chau), Тханькхе (Thanh Khe), Шонча (Son Tra),
          Нгуханьшон (Ngu Hanh Son), Камле (Cam Le), Льенчьеу (Lien Chieu) и сельском уезде Хоаванг (Hoa Vang), —
          а также в соседнем Хойане. От квартир у моря рядом с пляжами Микхе и Ан Тхыонг (An Thuong) до семейных
          домов, таунхаусов, вилл и земельных участков.
        </p>
        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Связаться с нами</h2>
        <p className="text-slate-600 leading-relaxed">
          DanangMLS управляет команда Da Nang Homes. Свяжитесь с нами по телефону{' '}
          <a href="tel:+84973747373" className="text-blue-600 hover:underline">+84 973 747 373</a> (Zalo / WhatsApp),
          по электронной почте{' '}
          <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>{' '}
          или посетите сайт{' '}
          <a href="https://danang.homes" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">danang.homes</a>.
        </p>
      </main>
    </div>
  );
}
