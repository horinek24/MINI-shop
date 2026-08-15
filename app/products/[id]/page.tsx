'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Product, formatVND } from '@/data/products';
import { getProductByIdFromSupabase, getProductsFromSupabase } from '@/utils/supabase/services';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import { ProductCard } from '@/components/ProductCard';
import { Breadcrumb } from '@/components/Breadcrumb';

interface ReviewItem {
  id: string;
  user_name: string;
  user_email: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = (params.id as string) || 'sofa-nordic';
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImg, setSelectedImg] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([]);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const loadReviews = async (pid: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', pid)
        .order('created_at', { ascending: false });

      if (data) {
        setReviewsList(data);
      }
    } catch (err) {
      console.error('Lỗi khi tải đánh giá sản phẩm:', err);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Vui lòng đăng nhập để gửi đánh giá.');
      return;
    }
    if (!reviewComment.trim()) {
      alert('Vui lòng nhập nội dung đánh giá.');
      return;
    }

    setSubmittingReview(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('reviews').insert({
        product_id: product?.id || productId,
        user_name: user.name || 'Khách hàng',
        user_email: user.email,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      if (error) {
        alert(`Lỗi khi gửi đánh giá: ${error.message}`);
      } else {
        alert('Cảm ơn bạn đã gửi đánh giá sản phẩm!');
        setReviewComment('');
        setReviewRating(5);
        await loadReviews(product?.id || productId);
      }
    } catch (err) {
      console.error('Lỗi gửi đánh giá:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      const fetchedProduct = await getProductByIdFromSupabase(productId);
      const allProducts = await getProductsFromSupabase();

      if (fetchedProduct) {
        setProduct(fetchedProduct);
        setSelectedImg(fetchedProduct.image);
        const related = allProducts
          .filter((p) => p.id !== fetchedProduct.id && (p.category === fetchedProduct.category || p.category !== fetchedProduct.category))
          .slice(0, 5);
        setRelatedProducts(related);
        loadReviews(fetchedProduct.id);
      } else if (allProducts.length > 0) {
        const fallbackProduct = allProducts[0];
        setProduct(fallbackProduct);
        setSelectedImg(fallbackProduct.image);
        loadReviews(fallbackProduct.id);
      }
      setLoading(false);
    }
    loadDetail();
  }, [productId]);

  if (loading || !product) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h3>Đang tải thông tin sản phẩm từ Supabase...</h3>
      </div>
    );
  }

  const liked = isInWishlist(product.id);
  const thumbnails = product.thumbnails && product.thumbnails.length > 0 ? product.thumbnails : [product.image];

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

        {/* Product Reviews Section */}
        <section className="product-reviews-section" style={{ marginTop: '4rem', backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg, 12px)', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '0.25rem' }}>
                Đánh giá & Nhận xét sản phẩm ({reviewsList.length})
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', margin: 0 }}>
                Ý kiến thực tế từ những khách hàng đã mua sản phẩm này tại Mini Shop Decor.
              </p>
            </div>
            {reviewsList.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fef3c7', padding: '0.5rem 1rem', borderRadius: '20px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d97706' }}>
                  {(reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length).toFixed(1)}
                </span>
                <span style={{ color: '#fbbf24', fontSize: '1.1rem' }}>★</span>
                <span style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 600 }}>({reviewsList.length} đánh giá)</span>
              </div>
            )}
          </div>

          {/* Review Submission Form */}
          {user ? (
            <form onSubmit={handleAddReview} style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md, 8px)', marginBottom: '2rem', border: '1px solid var(--color-border)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.75rem' }}>
                Viết đánh giá của bạn
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: 600 }}>Đánh giá số sao:</span>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.4rem',
                        cursor: 'pointer',
                        color: star <= reviewRating ? '#f59e0b' : '#cbd5e1',
                        padding: '0 0.1rem',
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                className="form-input form-textarea"
                rows={3}
                placeholder="Chia sẻ cảm nhận chi tiết của bạn về chất lượng sản phẩm, màu sắc, cách đóng gói..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                required
              />
              <button
                type="submit"
                className="btn btn-green btn-sm"
                disabled={submittingReview}
                style={{ marginTop: '0.75rem', fontWeight: 700 }}
              >
                {submittingReview ? 'Đang gửi...' : 'Gửi nhận xét đánh giá'}
              </button>
            </form>
          ) : (
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-muted)' }}>
              Vui lòng <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'underline' }}>Đăng nhập</Link> để gửi nhận xét đánh giá cho sản phẩm này.
            </div>
          )}

          {/* Reviews List */}
          {reviewsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-muted)', fontSize: '0.95rem' }}>
              Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {reviewsList.map((rev) => (
                <div key={rev.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--color-dark)' }}>{rev.user_name}</strong>
                      <span style={{ color: '#f59e0b', fontSize: '0.9rem' }}>
                        {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                      {rev.created_at ? new Date(rev.created_at).toLocaleDateString('vi-VN') : 'Mới đây'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.92rem', color: '#4b5563', margin: 0, lineHeight: 1.6 }}>
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

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
