
import ProductDetailClient from '@/app/product/[id]/ProductDetailClient';

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  return <ProductDetailClient id={resolvedParams.id} />;
}