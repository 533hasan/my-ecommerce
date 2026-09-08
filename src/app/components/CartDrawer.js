'use client';

import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, addToCart } = useCart();

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => {
    const rawPrice = item.price ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) : 0;
    return acc + rawPrice * item.quantity;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col justify-between">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Your Shopping Cart</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-medium">Your cart is empty</p>
                <button onClick={onClose} className="mt-4 text-indigo-600 font-semibold hover:underline">
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4 gap-4">
                  {item.image && (
                    <img
                      src={item.image.sourceUrl}
                      alt={item.image.altText || item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
                    <p className="text-sm font-bold text-gray-900">{item.price}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-xs font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-4">
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500">Shipping and taxes calculated at checkout.</p>
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full text-center bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}