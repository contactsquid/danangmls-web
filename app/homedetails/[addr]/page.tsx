import AddressDetailPage, { addressMetadata } from '@/components/AddressDetailPage';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ addr: string }> }) {
  return addressMetadata('homedetails', (await params).addr);
}

export default async function Page({ params }: { params: Promise<{ addr: string }> }) {
  return <AddressDetailPage kind="homedetails" addr={(await params).addr} />;
}
