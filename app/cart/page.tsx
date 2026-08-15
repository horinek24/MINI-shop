'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatVND } from '@/data/products';
import { Breadcrumb } from '@/components/Breadcrumb';

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeItem,
    getSubtotal,
    appliedCouponDiscount,
    applyCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState<string>('');

  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 500000 || subtotal === 0 ? 0 : 30000;
  const finalTotal = Math.max(0, subtotal + shippingFee - appliedCouponDiscount);

  const handleApplyCoupon = () => {
    const success = applyCoupon(couponCode);
    if (!success && couponCode.trim() !== '') {
      alert('Mã giảm giá không hợp lệ. Vui lòng thử lại với mã "MINISHOP".');
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Giỏ hàng' }]} />

      <div className="container" style={{ paddingBottom: '5rem' }}>
        {cart.length === 0 ? (
          /* Empty Cart View */
          <div className="empty-cart-container" style={{ display: 'flex' }}>
            <div className="empty-cart-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                <line x1="9" y1="9" x2="15" y2="15" />
                <line x1="15" y1="9" x2="9" y2="15" />
              </svg>
            </div>
            <h2 className="empty-cart-title">Giỏ hàng của bạn đang trống</h2>
            <p className="empty-cart-desc">
              Hãy khám phá các sản phẩm tuyệt vời của Mini Shop và thêm vào giỏ hàng ngay nhé!
            </p>
            <Link href="/products" className="btn btn-primary btn-empty-cart-cta">
              Khám phá sản phẩm ngay
            </Link>
          </div>
        ) : (
          /* Cart Content View Grid */
          <div className="cart-page-grid" style={{ display: 'grid' }}>
            {/* Left: Cart Items List Table */}
            <div className="cart-items-card">
              <div className="cart-header-row">
                <h1 className="cart-page-title">Giỏ hàng của bạn</h1>
                <span className="cart-items-count-badge">
                  {cart.reduce((s, i) => s + i.quantity, 0)} sản phẩm
                </span>
              </div>

              {/* Items List */}
              <div className="cart-items-list">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item-row" data-id={item.id}>
                    <div className="cart-product-info">
                      <Link href={`/products/${item.id}`}>
                        <img src={item.image} alt={item.name} className="cart-product-img" />
                      </Link>
                      <div>
                        <h4 className="cart-product-name">
                          <Link href={`/products/${item.id}`}>{item.name}</Link>
                        </h4>
                        <span className="cart-product-category">
                          {item.categoryName || 'Sản phẩm thủ công'}
                        </span>
                      </div>
                    </div>

                    <div className="cart-unit-price">{formatVND(item.price)}</div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div className="quantity-picker">
                        <button
                          type="button"
                          className="btn-qty"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="qty-input"
                          value={item.quantity}
                          min="1"
                          max="99"
                          onChange={(e) =>
                            updateQuantity(item.id, parseInt(e.target.value, 10) || 1)
                          }
                        />
                        <button
                          type="button"
                          className="btn-qty"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-total" style={{ textAlign: 'right' }}>
                      {formatVND(item.price * item.quantity)}
                    </div>

                    <button
                      type="button"
                      className="btn-remove-item"
                      title="Xóa món này"
                      aria-label="Xóa"
                      onClick={() => {
                        if (confirm(`Bạn có chắc muốn xóa "${item.name}" khỏi giỏ hàng?`)) {
                          removeItem(item.id);
                        }
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-footer-actions">
                <Link href="/products" className="btn-continue-shopping">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>

            {/* Right: Order Summary Sidebar */}
            <aside className="cart-summary-card">
              <h3 className="summary-title">Tóm tắt đơn hàng</h3>

              <div className="coupon-box">
                <label className="coupon-label">Mã giảm giá</label>
                <div className="coupon-input-group">
                  <input
                    type="text"
                    className="coupon-input"
                    placeholder="Nhập mã (VD: MINISHOP)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button type="button" className="btn-apply-coupon" onClick={handleApplyCoupon}>
                    Áp dụng
                  </button>
                </div>
              </div>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Tạm tính</span>
                  <span className="summary-row-val">{formatVND(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Phí giao hàng</span>
                  <span className={`summary-row-val ${shippingFee === 0 ? 'free-ship' : ''}`}>
                    {shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}
                  </span>
                </div>
                {appliedCouponDiscount > 0 && (
                  <div className="summary-row" style={{ color: 'var(--color-primary)' }}>
                    <span>Giảm giá</span>
                    <span className="summary-row-val">-{formatVND(appliedCouponDiscount)}</span>
                  </div>
                )}
                <div className="summary-row summary-total-row">
                  <span>Tổng tiền</span>
                  <span className="summary-total-val">{formatVND(finalTotal)}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn-checkout">
                Tiến hành thanh toán
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
