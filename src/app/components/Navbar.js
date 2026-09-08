'use client';

import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';

export default function Navbar({ onOpenCart }) {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
          STORE<span className="text-indigo-600">.</span>
        </Link>

        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-indigo-600 transition">Home</Link>
          <Link href="/products" className="hover:text-indigo-600 transition">Shop</Link>
          <Link href="/about" className="hover:text-indigo-600 transition">About</Link>
        </nav>

        <button
          onClick={onOpenCart}
          className="relative p-2 text-gray-700 hover:text-indigo-600 transition flex items-center gap-1"
          aria-label="Open cart"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}