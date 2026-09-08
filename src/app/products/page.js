import { getProducts } from '@/app/lib/woocommerce';
import ProductGrid from '@/app/components/ProductGrid';

export default async function ProductsPage() {
  const products = await getProducts(24);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-gray-200 pb-5 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
        <p className="text-sm text-gray-500 mt-1">Browse our complete collection.</p>
      </div>
      <ProductGrid products={products} />
    </main>
  );
}