import type { Metadata } from 'next';
import DistrictComboPage, { districtComboMetadata } from '@/components/DistrictComboPage';

export const dynamic = 'force-dynamic';

interface Props { params: Promise<{ filter: string; sub: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { filter, sub } = await params;
  return districtComboMetadata('rent', filter, sub, 'ru');
}

export default async function Page({ params }: Props) {
  const { filter, sub } = await params;
  return <DistrictComboPage mode="rent" districtSlug={filter} subSlug={sub} lang="ru" />;
}
