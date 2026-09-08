import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-4">STORE.</h3>
          <p className="text-sm text-gray-400">High quality products delivered straight to your door with Cash on Delivery.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/checkout" className="hover:underline">Checkout</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Payment Methods</h4>
          <p className="text-sm text-gray-400">💵 Cash on Delivery (COD) supported nationwide.</p>
        </div>
      </div>
      <div className="bg-gray-950 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Headless Store. All rights reserved.
      </div>
    </footer>
  );
}