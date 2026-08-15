import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toast } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'Mini Shop - Sống đẹp mỗi ngày cùng Mini Shop',
  description: 'Mini Shop - Sản phẩm nội thất, trang trí thủ công mỹ nghệ cao cấp cho tổ ấm của bạn.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <CartProvider>
          <AuthProvider>
            <WishlistProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <Toast />
            </WishlistProvider>
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
