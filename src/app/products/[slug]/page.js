import { getProductBySlug } from '@/app/lib/woocommerce';
import AddToCartButton from '@/app/components/AddToCartButton';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden aspect-square">
          {product.image ? (
            <img
              src={product.image.sourceUrl}
              alt={product.image.altText || product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-2xl font-bold text-indigo-600">{product.price}</p>

          <div
            className="prose prose-sm text-gray-600 border-t border-b border-gray-200 py-4"
            dangerouslySetInnerHTML={{ __html: product.shortDescription || product.description || 'No description available.' }}
          />

          <AddToCartButton product={product} />

          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-sm text-indigo-900 flex items-center gap-3">
            <span>🚚</span>
            <div>
              <p className="font-semibold">Cash on Delivery Available</p>
              <p className="text-xs text-indigo-700">Pay cash when your order is delivered to your address.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}