import Link from 'next/link';
import type { Metadata } from 'next';
import { footerAlternates } from '@/lib/footerPages';

export const metadata: Metadata = {
  title: 'DanangMLS: факты и ответы на вопросы',
  description:
    'Основные факты и ответы на частые вопросы о DanangMLS, аренде и покупке недвижимости в Дананге и Хойане, Вьетнам, и о портале для агентов.',
  alternates: footerAlternates('knowledge', 'ru'),
};

interface FaqGroup {
  q: string;
  a: string;
}

const GENERAL: FaqGroup[] = [
  {
    q: 'Что такое DanangMLS?',
    a: 'DanangMLS (danangmls.com) — база объявлений (MLS) о недвижимости в Дананге и Хойане, Вьетнам: дома, квартиры, виллы и земельные участки в аренду и на продажу. Объявления собираются от местных агентов и собственников, обновляются ежедневно и доступны на английском, вьетнамском, корейском и русском языках.',
  },
  {
    q: 'Какие районы охватывает DanangMLS?',
    a: 'Все районы Дананга — Хайтяу (Hai Chau), Тханькхе (Thanh Khe), Шонча (Son Tra), Нгуханьшон (Ngu Hanh Son), Камле (Cam Le), Льенчьеу (Lien Chieu) и сельский уезд Хоаванг (Hoa Vang), — а также соседний Хойан.',
  },
  {
    q: 'DanangMLS и Da Nang Homes — это одна компания?',
    a: 'DanangMLS управляет команда Da Nang Homes. Сайт собирает более широкий круг объявлений и агентов по Данангу и Хойану.',
  },
  {
    q: 'Как связаться с DanangMLS по поводу объявления?',
    a: 'Напишите в Zalo или WhatsApp на номер +84 973 747 373 или на электронную почту hello@danang.homes. Все контакты указаны на странице /ru/contact.',
  },
  {
    q: 'Является ли информация на DanangMLS юридической или финансовой консультацией?',
    a: 'Нет. Наши материалы носят информационный характер и могут меняться. Перед подписанием договора всегда уточняйте детали у лицензированного юриста, нотариуса или в банке.',
  },
];

const RENTING: FaqGroup[] = [
  {
    q: 'Могут ли иностранцы арендовать жилье в Дананге?',
    a: 'Да. Для иностранцев нет ограничений на аренду квартир, домов или вилл в Дананге и Хойане. Большинство арендодателей при подписании договора просят копию паспорта и залог (обычно в размере арендной платы за 1–3 месяца).',
  },
  {
    q: 'Как часто обновляются объявления об аренде?',
    a: 'Объявления обновляются ежедневно по данным местных агентов и собственников, поэтому вы видите то, что действительно сейчас есть на рынке.',
  },
];

const AGENTS: FaqGroup[] = [
  {
    q: 'Могу ли я разместить свои объекты на DanangMLS?',
    a: 'Да. Агенты могут бесплатно создать профиль и публиковать объявления самостоятельно через портал: зарегистрируйтесь, подтвердите адрес электронной почты и добавляйте объекты с фотографиями, ценой и местоположением.',
  },
  {
    q: 'Как привязать к своему имени объявления, которые уже есть на сайте?',
    a: 'При регистрации вы можете найти себя по имени: DanangMLS покажет объявления, уже опубликованные на сайте под этим именем (включая близкие варианты написания), и вы сможете закрепить их за собой после короткой проверки администратором.',
  },
  {
    q: 'Отображается ли в профиле агента мой номер телефона?',
    a: 'Нет. В профиле агента указаны ваше имя, фото, описание, место работы и текущие объявления, но не номер телефона. Покупатели и арендаторы обращаются напрямую в DanangMLS, и уже оттуда запросы передаются дальше.',
  },
];

function faqSection(title: string, items: FaqGroup[]) {
  if (!items.length) return null;
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">{title}</h2>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-900 mb-2">{item.q}</h3>
            <p className="text-slate-600 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function RuKnowledgePage() {
  const allForSchema = [...GENERAL, ...RENTING, ...AGENTS];
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'ru',
    mainEntity: allForSchema.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">DanangMLS: факты и ответы на вопросы</h1>
        <p className="text-slate-600 leading-relaxed mb-10">
          Справочная информация о DanangMLS, аренде и покупке недвижимости в Дананге и Хойане, а также о портале
          для агентов — для людей и ИИ-ассистентов.
        </p>

        {faqSection('О DanangMLS', GENERAL)}
        {faqSection('Аренда в Дананге', RENTING)}
        {faqSection('Для агентов', AGENTS)}

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
          <p className="text-slate-700 mb-3">Не нашли ответа на свой вопрос?</p>
          <Link href="/ru/contact" className="inline-block bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
            Связаться с DanangMLS
          </Link>
        </div>
      </main>
    </div>
  );
}
