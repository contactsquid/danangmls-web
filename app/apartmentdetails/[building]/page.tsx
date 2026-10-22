import ApartmentDetailPage, { apartmentMetadata } from '@/components/ApartmentDetailPage';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ building: string }> }) {
  return apartmentMetadata((await params).building);
}

export default async function Page({ params }: { params: Promise<{ building: string }> }) {
  return <ApartmentDetailPage slug={(await params).building} />;
}
