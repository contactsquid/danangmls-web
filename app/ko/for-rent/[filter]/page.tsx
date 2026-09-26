import type { Metadata } from 'next';
import FacetPage, { facetMetadata } from '@/components/FacetPage';

export const dynamic = 'force-dynamic';

interface Props { params: Promise<{ filter: string }>; searchParams: Promise<{ view?: string | string[] }> }

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { filter } = await params;
  return facetMetadata('rent', 'ko', filter, (await searchParams).view);
}

export default async function Page({ params }: Props) {
  const { filter } = await params;
  return <FacetPage mode="rent" lang="ko" filterSlug={filter} />;
}
