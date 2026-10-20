import type { Metadata } from 'next';
import { footerAlternates } from '@/lib/footerPages';

export const metadata: Metadata = {
  title: 'Условия использования',
  description: 'Условия использования сайта DanangMLS.',
  alternates: footerAlternates('terms', 'ru'),
};

export default function RuTermsPage() {
  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Условия использования</h1>
        <p className="text-slate-400 text-sm mb-6">Последнее обновление: июнь 2026 г.</p>

        <p className="text-slate-600 leading-relaxed mb-4">
          Используя danangmls.com (далее — «сайт»), вы соглашаетесь с настоящими условиями.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Об объявлениях</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          DanangMLS собирает объявления о недвижимости в Дананге и Хойане от местных агентов и собственников.
          Мы стремимся поддерживать актуальность объявлений, однако не являемся владельцами объектов и не можем
          гарантировать точность, доступность, цену или состояние какого-либо объекта. Всегда уточняйте детали
          непосредственно у агента или собственника, прежде чем принимать решение или вносить оплату.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Отказ от гарантий</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Сайт предоставляется «как есть» в информационных целях. В пределах, допустимых законом, мы не несем
          ответственности за любые убытки, возникшие в результате использования размещенной здесь информации,
          включая ошибки и пропуски в объявлениях, а также действия третьих лиц.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Допустимое использование</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Запрещается массово извлекать, копировать или перепубликовывать содержимое сайта, а также использовать
          его для рассылки спама или незаконных сообщений. Тексты и фотографии объявлений остаются собственностью
          их владельцев.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Контакты</h2>
        <p className="text-slate-600 leading-relaxed">
          Вопросы по настоящим условиям направляйте на{' '}
          <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>.
        </p>
      </main>
    </div>
  );
}
