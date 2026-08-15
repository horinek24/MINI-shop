'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import { formatVND } from '@/data/products';

interface UserOrder {
  id: string;
  order_code: string;
  created_at: string;
  total_amount: number;
  payment_method: string;
  shipping_address: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: any[];
}

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchMyOrders();
    }
  }, [user, loading, router]);

  const fetchMyOrders = async () => {
    setIsDataLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', user?.email)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Lỗi khi tải lịch sử đơn hàng:', error);
      } else if (data) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Lỗi kết nối Supabase:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  if (loading || isDataLoading) {
    return (
      <div className="policy-page-wrapper" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.1rem', color: 'var(--color-muted)', fontWeight: 600 }}>Đang tải lịch sử đơn hàng...</div>
      </div>
    );
  }

  return (
    <div className="policy-page-wrapper">
      <div className="breadcrumb-bar" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', padding: '0.85rem 0', marginBottom: '2.5rem' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--color-muted)' }}>
          <Link href="/" style={{ color: 'var(--color-muted)' }}>Trang chủ</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>Đơn hàng của tôi</span>
        </div>
      </div>

      <div className="container">
        <div className="policy-card">
          <header className="policy-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className="policy-title">Lịch Sử Đơn Hàng Của Tôi</h1>
              <p className="policy-subtitle">
                Theo dõi trạng thái tất cả các đơn hàng bạn đã mua tại Mini Shop Decor.
              </p>
            </div>
            <Link href="/products" className="btn btn-outline-gray btn-sm">
              Tiếp tục mua sắm
            </Link>
          </header>

          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.5rem' }}>
                Bạn chưa có đơn hàng nào
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-muted)', marginBottom: '1.5rem' }}>
                Hãy khám phá các sản phẩm nội thất & đồ dùng trang trí nhà cửa của chúng tôi!
              </p>
              <Link href="/products" className="btn btn-green">
                Khám phá sản phẩm ngay
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
              {orders.map((o) => {
                const dateStr = o.created_at ? new Date(o.created_at).toLocaleString('vi-VN') : '---';
                const statusBadge =
                  o.status === 'completed'
                    ? { label: 'Đã hoàn thành', bg: '#dcfce7', color: '#15803d' }
                    : o.status === 'processing'
                    ? { label: 'Đang xử lý', bg: '#e0f2fe', color: '#0369a1' }
                    : o.status === 'cancelled'
                    ? { label: 'Đã hủy', bg: '#fee2e2', color: '#b91c1c' }
                    : { label: 'Chờ xác nhận', bg: '#fef3c7', color: '#b45309' };

                return (
                  <div
                    key={o.id}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg, 12px)',
                      padding: '1.5rem',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                    }}
                  >
                    {/* Header line */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--color-border)', paddingBottom: '1rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-dark)' }}>
                          Mã đơn: #{o.order_code || o.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span style={{ marginLeft: '0.75rem', fontSize: '0.88rem', color: 'var(--color-muted)' }}>
                          Ngày đặt: {dateStr}
                        </span>
                      </div>
                      <span
                        style={{
                          padding: '0.35rem 0.85rem',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          backgroundColor: statusBadge.bg,
                          color: statusBadge.color,
                        }}
                      >
                        • {statusBadge.label}
                      </span>
                    </div>

                    {/* Order Details & Items */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1rem' }}>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.35rem' }}>Địa chỉ giao hàng:</h4>
                        <p style={{ fontSize: '0.9rem', color: '#4b5563', margin: 0, lineHeight: 1.5 }}>{o.shipping_address || '---'}</p>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.35rem' }}>Phương thức thanh toán:</h4>
                        <p style={{ fontSize: '0.9rem', color: '#4b5563', margin: 0 }}>
                          {o.payment_method === 'cod' ? 'Thanh toán COD khi nhận hàng' : o.payment_method === 'bank' ? 'Chuyển khoản Ngân hàng' : 'Ví MoMo'}
                        </p>
                      </div>
                    </div>

                    {/* Items List */}
                    {o.items && Array.isArray(o.items) && o.items.length > 0 && (
                      <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.5rem' }}>Sản phẩm đã mua:</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          {o.items.map((item: any, idx: number) => (
                            <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#4b5563', padding: '0.25rem 0' }}>
                              <span>• {item.name} x {item.quantity || 1}</span>
                              <strong style={{ color: 'var(--color-dark)' }}>{formatVND((item.price || 0) * (item.quantity || 1))}</strong>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Total Footer */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '0.95rem', color: 'var(--color-muted)' }}>Tổng thanh toán:</span>
                      <strong style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                        {formatVND(o.total_amount || 0)}
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
