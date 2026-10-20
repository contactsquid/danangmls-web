import type { Metadata } from 'next';
import { footerAlternates } from '@/lib/footerPages';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description: 'Как DanangMLS обращается с данными и файлами cookie.',
  alternates: footerAlternates('privacy', 'ru'),
};

export default function RuPrivacyPolicyPage() {
  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Политика конфиденциальности</h1>
        <p className="text-slate-400 text-sm mb-6">Последнее обновление: июнь 2026 г.</p>

        <p className="text-slate-600 leading-relaxed mb-4">
          DanangMLS (далее — «мы») управляет сайтом danangmls.com. Настоящая политика описывает, какие
          ограниченные данные мы обрабатываем, когда вы просматриваете сайт.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Какую информацию мы собираем</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Для просмотра объявлений не требуется учетная запись, и мы не просим вас предоставлять персональные
          данные. Мы собираем стандартную обобщенную аналитику (например, просмотренные страницы, приблизительный
          регион, тип устройства и сайт, с которого был выполнен переход), чтобы понимать, как используется сайт,
          и улучшать его. Если вы связываетесь с нами напрямую по телефону, через мессенджер или по электронной
          почте, мы получаем ту информацию, которую вы сами решите указать в сообщении.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Файлы cookie</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Мы используем файлы cookie и аналогичные технологии для обеспечения базовой работы сайта и аналитики.
          Вы можете отключить файлы cookie в настройках браузера; просмотр объявлений при этом останется доступен.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Сторонние сервисы</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Сайт работает на платформе Vercel и может использовать сторонние сервисы аналитики. Фотографии объектов
          размещаются в нашей сети доставки изображений (CDN). Эти поставщики обрабатывают технические данные
          запросов (например, IP-адрес) в рамках обеспечения работы сайта. Мы не продаем ваши персональные данные.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Ваши права</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Если вы связывались с нами и хотите, чтобы мы удалили данные из отправленных вами сообщений, напишите на{' '}
          <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>,
          и мы их удалим.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Контакты</h2>
        <p className="text-slate-600 leading-relaxed">
          Вопросы по настоящей политике направляйте на{' '}
          <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>.
        </p>
      </main>
    </div>
  );
}
