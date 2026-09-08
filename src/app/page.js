import { getProducts } from '@/app/lib/woocommerce';
import ProductGrid from '@/app/components/ProductGrid';
import Link from 'next/link';

export default async function HomePage() {
  const products = await getProducts(12);

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-indigo-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Premium Products, Delivered Cash on Delivery
          </h1>
          <p className="text-indigo-200 text-lg">
            Shop our top selection and pay at your doorstep. Fast shipping nationwide.
          </p>
          <div>
            <Link
              href="/products"
              className="inline-block bg-white text-indigo-900 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition mt-2"
            >
              Shop All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Products</h2>
        <ProductGrid products={products} />
      </section>
    </main>
  );
}