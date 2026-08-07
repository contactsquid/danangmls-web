import type { Metadata } from 'next';
import FacetPage, { facetMetadata } from '@/components/FacetPage';

export const dynamic = 'force-dynamic';

interface Props { params: Promise<{ filter: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { filter } = await params;
  return facetMetadata('rent', 'vi', filter);
}

export default async function Page({ params }: Props) {
  const { filter } = await params;
  return <FacetPage mode="rent" lang="vi" filterSlug={filter} />;
}
