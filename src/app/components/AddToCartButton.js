'use client';
import { useCart } from '@/app/context/CartContext';

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  return (
    <button
      onClick={() => addToCart(product)}
      className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition text-lg"
    >
      Add to Cart
    </button>
  );
}