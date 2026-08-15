'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRODUCTS_DATA } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'noithat', label: 'Nội thất' },
    { id: 'trangtri', label: 'Trang trí' },
    { id: 'nhabep', label: 'Nhà bếp' },
    { id: 'den', label: 'Đèn' },
    { id: 'vanphong', label: 'Văn phòng' },
    { id: 'luutru', label: 'Lưu trữ' },
    { id: 'khac', label: 'Khác' },
  ];

  const filteredProducts = PRODUCTS_DATA.filter((product) => {
    if (selectedCategory === 'all') return true;
    return product.category === selectedCategory;
  });

  return (
    <>
      {/* Hero Banner Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-card">
            {/* Left Column: Copy & Actions */}
            <div className="hero-content">
              <h1 className="hero-title">
                Sống đẹp mỗi ngày
                <br />
                cùng <span className="text-gradient">Mini Shop</span>
              </h1>
              <p className="hero-subtitle">Sản phẩm chất lượng cho tổ ấm của bạn.</p>

              <div className="hero-cta">
                <Link href="/products" className="btn btn-primary">
                  Mua sắm ngay
                </Link>
              </div>

              {/* 3 Service Feature Commitments */}
              <div className="hero-features">
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13" rx="2" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  </div>
                  <div className="feature-text">
                    <span className="feature-title">Giao hàng nhanh</span>
                    <span className="feature-desc">Toàn quốc</span>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="feature-text">
                    <span className="feature-title">Bảo hành chính hãng</span>
                    <span className="feature-desc">7 ngày đổi trả</span>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                    </svg>
                  </div>
                  <div className="feature-text">
                    <span className="feature-title">Hỗ trợ 24/7</span>
                    <span className="feature-desc">Tư vấn tận tâm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Banner Image */}
            <div className="hero-image-wrapper">
              <img
                src="/MiniShop_Assets/assets/images/banner/banner-trang-chu-mini-shop.webp"
                alt="Sống đẹp mỗi ngày cùng Mini Shop - Đồ trang trí & Nội thất"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Tabs Section */}
      <section className="category-section">
        <div className="container">
          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Grid Section */}
      <section className="products-section" id="products">
        <div className="container">
          {/* Section Header */}
          <div className="section-header">
            <h2 className="section-title">Sản phẩm nổi bật</h2>
            <Link href="/products" className="view-all-link">
              Xem tất cả
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          {/* Featured Products Grid */}
          <div className="products-grid">
            {filteredProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
