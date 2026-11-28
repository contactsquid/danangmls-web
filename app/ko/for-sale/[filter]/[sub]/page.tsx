import type { Metadata } from 'next';
import DistrictComboPage, { districtComboMetadata } from '@/components/DistrictComboPage';

export const dynamic = 'force-dynamic';

interface Props { params: Promise<{ filter: string; sub: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { filter, sub } = await params;
  return districtComboMetadata('sale', filter, sub, 'ko');
}

export default async function Page({ params }: Props) {
  const { filter, sub } = await params;
  return <DistrictComboPage mode="sale" districtSlug={filter} subSlug={sub} lang="ko" />;
}
