import type { Metadata } from 'next';
import { footerAlternates } from '@/lib/footerPages';

export const metadata: Metadata = {
  title: 'Контакты DanangMLS',
  description: 'Свяжитесь с командой DanangMLS по любому объекту в аренду или на продажу в Дананге и Хойане, Вьетнам. Пишите нам в Zalo, WhatsApp или на электронную почту.',
  alternates: footerAlternates('contact', 'ru'),
};

export default function RuContactPage() {
  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Свяжитесь с нами</h1>
        <p className="text-slate-600 leading-relaxed mb-6">
          Нашли понравившийся объект или хотите, чтобы мы помогли с поиском? Напишите нам — мы свяжем вас с
          нужным человеком и организуем просмотр. Мы отвечаем на английском и вьетнамском языках.
        </p>
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3 text-slate-700">
          <p>📱 <strong>Zalo / WhatsApp:</strong>{' '}
            <a href="tel:+84973747373" className="text-blue-600 hover:underline">+84 973 747 373</a>
          </p>
          <p>📧 <strong>Эл. почта:</strong>{' '}
            <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>
          </p>
          <p>🌐 <strong>Сайт:</strong>{' '}
            <a href="https://danang.homes" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">danang.homes</a>
          </p>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed mt-6">
          Если вы пишете о конкретном объявлении, приложите ссылку на него — так мы быстрее найдем все детали.
          Быстрее всего с нами можно связаться через WhatsApp.
        </p>
      </main>
    </div>
  );
}
