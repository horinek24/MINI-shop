'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/data/products';
import { useWishlist } from '@/context/WishlistContext';
import { getProductsFromSupabase } from '@/utils/supabase/services';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const dbProducts = await getProductsFromSupabase();
        setProducts(dbProducts);
      } catch (err) {
        console.error('Lỗi khi tải danh sách sản phẩm cho Wishlist:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="wishlist-page-wrapper">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-bar" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', padding: '0.85rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--color-muted)' }}>
          <Link href="/" style={{ color: 'var(--color-muted)', transition: 'var(--transition-base)' }}>
            Trang chủ
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>Sản phẩm yêu thích</span>
        </div>
      </div>

      <main className="wishlist-content" style={{ padding: '3rem 0 5rem 0', backgroundColor: 'var(--color-bg-body)' }}>
        <div className="container">
          {/* Page Title & Count Badge */}
          <div className="wishlist-header" style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <svg viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2" width="32" height="32">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Sản phẩm yêu thích
              </h1>
              <p style={{ color: 'var(--color-muted)', marginTop: '0.35rem', fontSize: '0.95rem' }}>
                Danh sách các sản phẩm bạn đã lưu để dễ dàng mua sắm sau.
              </p>
            </div>

            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.5rem 1.2rem', borderRadius: 'var(--radius-pill)', fontWeight: 700, fontSize: '0.92rem' }}>
              {favoriteProducts.length} món yêu thích
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div style={{ padding: '4rem 0', textAlign: 'center' }}>
              <h3>Đang tải danh sách sản phẩm yêu thích...</h3>
            </div>
          ) : favoriteProducts.length === 0 ? (
            /* Empty State */
            <div
              className="wishlist-empty-box"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '4rem 2rem',
                textAlign: 'center',
                maxWidth: '600px',
                margin: '0 auto',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#fef2f2',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" width="40" height="40">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.6rem' }}>
                Danh sách yêu thích đang trống
              </h2>
              <p style={{ color: 'var(--color-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
                Bạn chưa lưu sản phẩm nào vào danh sách yêu thích. Hãy bấm biểu tượng hình trái tim trên sản phẩm bất kỳ để xem lại sau nhé!
              </p>

              <Link
                href="/products"
                className="btn btn-blue"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem', fontSize: '0.95rem' }}
              >
                Khám phá sản phẩm ngay
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          ) : (
            /* Wishlist Products Grid */
            <div
              className="catalog-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.75rem',
              }}
            >
              {favoriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
