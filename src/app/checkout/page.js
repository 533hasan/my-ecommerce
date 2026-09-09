'use client';

import { useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import { createCodOrder } from '@/app/lib/woocommerce';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [form, setForm] = useState({ firstName: '', phone: '', address: '', city: '' });

  const subtotal = cart.reduce((acc, item) => {
    const rawPrice = item.price ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) : 0;
    return acc + rawPrice * item.quantity;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // WooGraphQL validation-এর জন্য ফোন নম্বর ফিল্টার করে ইমেইল তৈরি
    const cleanPhone = form.phone.replace(/[^0-9]/g, '');

    const payload = {
      billing: {
        firstName: form.firstName,
        lastName: '.',
        phone: form.phone,
        address1: form.address,
        city: form.city,
        country: 'BD',
        email: `${cleanPhone || 'guest'}@example.com`,
      },
      lineItems: cart.map((item) => ({
        // WooGraphQL integer Database ID বা Product ID প্রত্যাশা করে
        productId: Number(item.databaseId || item.id),
        quantity: Number(item.quantity || 1),
      })),
    };

    try {
      const order = await createCodOrder(payload);
      
      // Response Structure হ্যান্ডলিং ( orderNumber / databaseId )
      const resultOrderNumber = order?.orderNumber || order?.databaseId || order?.order?.orderNumber || order?.order?.databaseId;

      if (resultOrderNumber) {
        setOrderNumber(resultOrderNumber);
        clearCart();
      } else {
        alert('Failed to place order. Invalid response received from server.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert(err.message || 'Failed to place order. Please check browser console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (orderNumber) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-green-50 border border-green-200 rounded-2xl text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-green-900">Order Placed Successfully!</h1>
        <p className="text-gray-700">
          Order Number: <span className="font-bold">#{orderNumber}</span>
        </p>
        <p className="text-xs text-gray-500">
          We will call you shortly to confirm delivery details.
        </p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-xl font-semibold">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Delivery Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Delivery Information</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              required
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-600"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              required
              type="tel"
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-600"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Street Address</label>
            <input
              required
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-600"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City / District</label>
            <input
              required
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-600"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>

          <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-lg border border-amber-200">
            💵 Payment Method: <strong>Cash on Delivery (COD)</strong>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Place COD Order'}
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-gray-100 p-6 rounded-2xl border border-gray-200 h-fit space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
          <div className="space-y-3">
            {cart.map((item, index) => (
              <div key={item.id || index} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="font-semibold">{item.price}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-300 pt-3 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}