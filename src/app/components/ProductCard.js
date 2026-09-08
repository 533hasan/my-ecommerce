'use client';

import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="group border border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col justify-between hover:shadow-lg transition">
      <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-gray-100 overflow-hidden">
        {product.image ? (
          <img
            src={product.image.sourceUrl}
            alt={product.image.altText || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-medium text-gray-900 hover:text-indigo-600 transition line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-lg font-bold text-gray-900 mt-1">{product.price}</p>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="mt-4 w-full bg-gray-900 text-white font-semibold py-2 rounded-lg hover:bg-indigo-600 transition text-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}