import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mini Shop - Admin Dashboard',
  description: 'Khu quản trị cửa hàng Mini Shop - Tổng quan, Quản lý sản phẩm và Đơn hàng.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-body">
      {children}
    </div>
  );
}
