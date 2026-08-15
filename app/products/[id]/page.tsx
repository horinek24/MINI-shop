'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProductById, getRelatedProducts, formatVND } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/ProductCard';
import { Breadcrumb } from '@/components/Breadcrumb';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = (params.id as string) || 'sofa-nordic';
  const product = getProductById(productId) || getProductById('sofa-nordic')!;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImg, setSelectedImg] = useState<string>(product.image);
  const [quantity, setQuantity] = useState<number>(1);

  const liked = isInWishlist(product.id);
  const thumbnails = product.thumbnails && product.thumbnails.length > 0 ? product.thumbnails : [product.image];
  const relatedProducts = getRelatedProducts(product.id, product.category, 5);

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Sản phẩm', href: '/products' },
          { label: product.categoryName, href: '/products' },
          { label: product.name },
        ]}
      />

      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div className="product-detail-layout">
          {/* Left: Product Image Gallery */}
          <div className="product-gallery-card">
            <div className="main-image-wrapper">
              <img src={selectedImg} alt={product.name} id="main-product-image" />
            </div>

            <div className="gallery-thumbnails" id="gallery-thumbnails-container">
              {thumbnails.map((thumbSrc, index) => (
                <div
                  key={index}
                  className={`thumb-item ${selectedImg === thumbSrc ? 'active' : ''}`}
                  onClick={() => setSelectedImg(thumbSrc)}
                >
                  <img src={thumbSrc} alt={`${product.name} thumb ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info & Purchase Form */}
          <div className="product-info-card">
            <div className="product-detail-meta">
              <span className="stock-tag detail-stock" id="product-stock">
                {product.stock || 'Còn hàng'}
              </span>
              <span className="category-tag" id="product-category-tag">
                {product.categoryName}
              </span>
            </div>

            <h1 className="product-detail-title" id="product-title">
              {product.name}
            </h1>

            <div className="product-rating-row">
              <div className="rating-stars">
                {'★'.repeat(Math.round(product.rating || 5))}
                {'☆'.repeat(5 - Math.round(product.rating || 5))}
              </div>
              <span className="rating-score" id="product-rating-score">
                {product.rating || 4.9}
              </span>
              <span className="reviews-count" id="product-reviews-count">
                ({product.reviewsCount || 30} đánh giá)
              </span>
            </div>

            <div className="product-detail-price-box">
              <span className="detail-price" id="product-price">
                {formatVND(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="original-price" id="product-original-price">
                  {formatVND(product.originalPrice)}
                </span>
              )}
              {product.discount && (
                <span className="discount-badge" id="product-discount">
                  {product.discount}
                </span>
              )}
            </div>

            <p className="product-detail-desc" id="product-desc">
              {product.desc}
            </p>

            {/* Specifications Table */}
            {product.specs && (
              <div className="product-specs-box">
                <h4 className="specs-title">Thông số kỹ thuật</h4>
                <table className="specs-table">
                  <tbody>
                    <tr>
                      <td className="spec-label">Chất liệu</td>
                      <td className="spec-val" id="spec-material">
                        {product.specs.material || 'Cao cấp'}
                      </td>
                    </tr>
                    <tr>
                      <td className="spec-label">Màu sắc</td>
                      <td className="spec-val" id="spec-color">
                        {product.specs.color || 'Tự nhiên'}
                      </td>
                    </tr>
                    <tr>
                      <td className="spec-label">Kích thước</td>
                      <td className="spec-val" id="spec-dimensions">
                        {product.specs.dimensions || 'Tiêu chuẩn'}
                      </td>
                    </tr>
                    <tr>
                      <td className="spec-label">Trọng lượng</td>
                      <td className="spec-val" id="spec-weight">
                        {product.specs.weight || '1.0 kg'}
                      </td>
                    </tr>
                    <tr>
                      <td className="spec-label">Xuất xứ</td>
                      <td className="spec-val" id="spec-madein">
                        {product.specs.madeIn || 'Việt Nam'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Quantity Selector & Add to Cart Actions */}
            <div className="product-actions-row">
              <div className="quantity-picker">
                <button
                  type="button"
                  className="btn-qty"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  className="qty-input"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  min="1"
                  max="99"
                />
                <button
                  type="button"
                  className="btn-qty"
                  onClick={() => setQuantity(Math.min(99, quantity + 1))}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-add-cart"
                onClick={() => addToCart(product.id, quantity)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Thêm vào giỏ hàng
              </button>

              <button
                type="button"
                className={`btn btn-outline-gray btn-wishlist-detail ${liked ? 'active' : ''}`}
                title={liked ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
                onClick={() => toggleWishlist(product.id, product.name)}
              >
                <svg viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <section className="related-products-section" style={{ marginTop: '5rem' }}>
          <div className="section-header">
            <h2 className="section-title">Sản phẩm liên quan</h2>
            <Link href="/products" className="view-all-link">
              Xem thêm
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          <div className="products-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
