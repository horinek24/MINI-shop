'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS_DATA, Product } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { Breadcrumb } from '@/components/Breadcrumb';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortOption, setSortOption] = useState<string>('newest');

  const categories = [
    { id: 'all', label: 'Tất cả sản phẩm', count: 12 },
    { id: 'noithat', label: 'Nội thất', count: 3 },
    { id: 'trangtri', label: 'Trang trí', count: 2 },
    { id: 'den', label: 'Đèn', count: 2 },
    { id: 'dothucong', label: 'Đồ thủ công', count: 3 },
    { id: 'domynghe', label: 'Đồ mỹ nghệ', count: 1 },
    { id: 'luutru', label: 'Lưu trữ', count: 1 },
  ];

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS_DATA];

    // Filter by Category
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Filter by Price Range
    if (priceFilter === 'under-500') {
      list = list.filter((p) => p.price < 500000);
    } else if (priceFilter === '500-1500') {
      list = list.filter((p) => p.price >= 500000 && p.price <= 1500000);
    } else if (priceFilter === 'over-1500') {
      list = list.filter((p) => p.price > 1500000);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
      );
    }

    // Sort products
    if (sortOption === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [selectedCategory, priceFilter, searchQuery, sortOption]);

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setPriceFilter('all');
    setSearchQuery('');
    setSortOption('newest');
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Sản phẩm' }]} />

      <div className="container">
        <div className="products-page-layout">
          {/* Left Sidebar Filters */}
          <aside className="filter-sidebar">
            {/* Category Filter Card */}
            <div className="filter-card">
              <h3 className="filter-title">Danh mục</h3>
              <ul className="filter-list">
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    className={`filter-item ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span>{cat.label}</span>
                    <span className="filter-count">
                      {cat.id === 'all'
                        ? PRODUCTS_DATA.length
                        : PRODUCTS_DATA.filter((p) => p.category === cat.id).length}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter Card */}
            <div className="filter-card">
              <h3 className="filter-title">Khoảng giá</h3>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="price-filter"
                    value="all"
                    checked={priceFilter === 'all'}
                    onChange={() => setPriceFilter('all')}
                  />
                  <span>Tất cả mức giá</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="price-filter"
                    value="under-500"
                    checked={priceFilter === 'under-500'}
                    onChange={() => setPriceFilter('under-500')}
                  />
                  <span>Dưới 500.000đ</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="price-filter"
                    value="500-1500"
                    checked={priceFilter === '500-1500'}
                    onChange={() => setPriceFilter('500-1500')}
                  />
                  <span>500.000đ - 1.500.000đ</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="price-filter"
                    value="over-1500"
                    checked={priceFilter === 'over-1500'}
                    onChange={() => setPriceFilter('over-1500')}
                  />
                  <span>Trên 1.500.000đ</span>
                </label>
              </div>
            </div>

            {/* Availability Filter Card */}
            <div className="filter-card">
              <h3 className="filter-title">Trạng thái</h3>
              <div className="filter-options">
                <label className="filter-option">
                  <input type="checkbox" checked disabled />
                  <span>Còn hàng</span>
                  <span className="opt-count">{PRODUCTS_DATA.length}</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Right Main Catalog Content */}
          <section className="products-catalog-main">
            {/* Header & Controls */}
            <div className="products-main-header">
              <div>
                <h1 className="products-page-title">Tất cả sản phẩm</h1>
                <p className="products-count-text">
                  Hiển thị {filteredProducts.length > 0 ? 1 : 0}–{filteredProducts.length} trong{' '}
                  {PRODUCTS_DATA.length} sản phẩm
                </p>
              </div>

              <div className="products-controls">
                {/* Search input */}
                <div className="product-search-bar">
                  <input
                    type="text"
                    placeholder="Tìm tên hoặc mô tả..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>

                {/* Sorting */}
                <select
                  className="sort-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="newest">Sắp xếp: Mới nhất</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                </select>
              </div>
            </div>

            {/* Quick Pills */}
            <div className="catalog-top-pills">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label.replace('Tất cả sản phẩm', 'Tất cả')}
                </button>
              ))}
            </div>

            {/* Grid Catalog */}
            <div className="catalog-grid">
              {filteredProducts.length === 0 ? (
                <div className="no-products-found" style={{ display: 'flex' }}>
                  <div className="no-products-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="8" y1="8" x2="14" y2="14" />
                      <line x1="14" y1="8" x2="8" y2="14" />
                    </svg>
                  </div>
                  <h4 className="no-products-title">Không tìm thấy sản phẩm phù hợp</h4>
                  <p className="no-products-desc">
                    Vui lòng thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc danh mục.
                  </p>
                  <button className="btn btn-primary" onClick={resetAllFilters}>
                    Đặt lại bộ lọc
                  </button>
                </div>
              ) : (
                filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 0' }}>Đang tải sản phẩm...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}
