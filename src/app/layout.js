'use client';

import { useState } from 'react';
import { CartProvider } from '@/app/context/CartContext';
import Navbar from '@/app/components/Navbar';
import CartDrawer from '@/app/components/CartDrawer';
import Footer from '@/app/components/Footer';
import '@/app/globals.css';

export default function RootLayout({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <CartProvider>
          <Navbar onOpenCart={() => setIsCartOpen(true)} />
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <div className="flex-1">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}