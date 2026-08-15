'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatVND } from '@/data/products';
import { Breadcrumb } from '@/components/Breadcrumb';

export default function CheckoutPage() {
  const { cart, getSubtotal, appliedCouponDiscount, clearCart } = useCart();
  const { user } = useAuth();

  const [fullName, setFullName] = useState<string>(user?.name || '');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [province, setProvince] = useState<string>('hanoi');
  const [district, setDistrict] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('cod');

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [createdOrderCode, setCreatedOrderCode] = useState<string>('');

  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 500000 || subtotal === 0 ? 0 : 30000;
  const finalTotal = Math.max(0, subtotal + shippingFee - appliedCouponDiscount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, boolean> = {};
    if (!fullName.trim()) newErrors['fullName'] = true;
    if (!phone.trim() || phone.trim().length < 9) newErrors['phone'] = true;
    if (!province) newErrors['province'] = true;
    if (!district.trim()) newErrors['district'] = true;
    if (!address.trim()) newErrors['address'] = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const orderCode = 'MS' + Math.floor(100000 + Math.random() * 900000);
    setCreatedOrderCode(orderCode);
    setIsSuccess(true);
    clearCart();
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Giỏ hàng', href: '/cart' },
          { label: 'Đặt hàng' },
        ]}
      />

      <div className="container" style={{ paddingBottom: '5rem' }}>
        {/* Step Indicator */}
        <div className="checkout-steps">
          <div className={`checkout-step ${isSuccess ? 'done' : 'done'}`}>
            <div className="step-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span>Giỏ hàng</span>
          </div>
          <div className="step-line" />
          <div className={`checkout-step ${isSuccess ? 'done' : 'active'}`}>
            <div className="step-circle">{isSuccess ? '✓' : '2'}</div>
            <span>Thông tin đặt hàng</span>
          </div>
          <div className="step-line" />
          <div className={`checkout-step ${isSuccess ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <span>Xác nhận</span>
          </div>
        </div>

        {isSuccess ? (
          /* Order Confirmation View */
          <div className="checkout-success-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 1.5rem', background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', maxWidth: '640px', margin: '0 auto' }}>
            <div className="success-icon" style={{ width: '72px', height: '72px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="36" height="36">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="success-title" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '0.5rem' }}>
              Đặt hàng thành công!
            </h2>
            <p className="success-subtitle" style={{ fontSize: '1rem', color: 'var(--color-muted)', marginBottom: '1.5rem' }}>
              Cảm ơn bạn đã mua sắm tại Mini Shop. Mã đơn hàng của bạn là{' '}
              <strong style={{ color: 'var(--color-primary)' }}>#{createdOrderCode}</strong>.
            </p>
            <div className="order-details-box" style={{ background: '#f8fafc', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', width: '100%', textAlign: 'left', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Người nhận:</span>
                <strong>{fullName} ({phone})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Địa chỉ giao hàng:</span>
                <strong>{address}, {district}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Phương thức:</span>
                <strong>{paymentMethod === 'cod' ? 'Thanh toán COD' : paymentMethod === 'bank' ? 'Chuyển khoản Ngân hàng' : 'Ví MoMo'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                <span>Tổng tiền:</span>
                <strong style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}>{formatVND(finalTotal)}</strong>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link href="/products" className="btn btn-primary">
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        ) : (
          /* Main Checkout Form Grid */
          <div className="checkout-grid" id="checkout-form-view">
            {/* Left: Customer Info Form */}
            <div>
              <form className="checkout-section-card" onSubmit={handleSubmit} noValidate>
                {/* Receiver Info */}
                <div className="form-section-title">
                  <div className="form-section-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  Thông tin người nhận
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="full-name" className="form-label">
                      Họ và tên <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="full-name"
                      className={`form-input ${errors['fullName'] ? 'is-error' : ''}`}
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setErrors({ ...errors, fullName: false });
                      }}
                    />
                    {errors['fullName'] && (
                      <span className="field-error visible">Vui lòng nhập họ và tên.</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Số điện thoại <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className={`form-input ${errors['phone'] ? 'is-error' : ''}`}
                      placeholder="0912 345 678"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setErrors({ ...errors, phone: false });
                      }}
                    />
                    {errors['phone'] && (
                      <span className="field-error visible">Vui lòng nhập số điện thoại hợp lệ.</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Shipping Address */}
                <div className="form-section-title" style={{ marginTop: '1.75rem' }}>
                  <div className="form-section-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  Địa chỉ giao hàng
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="province" className="form-label">
                      Tỉnh / Thành phố <span className="required">*</span>
                    </label>
                    <select
                      id="province"
                      className={`form-input form-select ${errors['province'] ? 'is-error' : ''}`}
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                    >
                      <option value="hanoi">Hà Nội</option>
                      <option value="hcm">TP. Hồ Chí Minh</option>
                      <option value="danang">Đà Nẵng</option>
                      <option value="haiphong">Hải Phòng</option>
                      <option value="cantho">Cần Thơ</option>
                      <option value="other">Tỉnh / Thành khác</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="district" className="form-label">
                      Quận / Huyện <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="district"
                      className={`form-input ${errors['district'] ? 'is-error' : ''}`}
                      placeholder="Quận Cầu Giấy"
                      value={district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        setErrors({ ...errors, district: false });
                      }}
                    />
                    {errors['district'] && (
                      <span className="field-error visible">Vui lòng nhập quận / huyện.</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address" className="form-label">
                    Địa chỉ cụ thể <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    className={`form-input ${errors['address'] ? 'is-error' : ''}`}
                    placeholder="Số nhà, tên đường, phường / xã..."
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setErrors({ ...errors, address: false });
                    }}
                  />
                  {errors['address'] && (
                    <span className="field-error visible">Vui lòng nhập địa chỉ giao hàng.</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="notes" className="form-label">
                    Ghi chú đơn hàng
                  </label>
                  <textarea
                    id="notes"
                    className="form-input form-textarea"
                    placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {/* Payment Options */}
                <div className="form-section-title" style={{ marginTop: '1.75rem' }}>
                  <div className="form-section-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  </div>
                  Phương thức thanh toán
                </div>

                <div className="payment-options">
                  <label
                    className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      readOnly
                    />
                    <div className="payment-option-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="6" width="20" height="12" rx="2" />
                        <path d="M22 10H2" />
                      </svg>
                    </div>
                    <div>
                      <div className="payment-option-name">Thanh toán khi nhận hàng (COD)</div>
                      <div className="payment-option-desc">Kiểm tra hàng trước khi thanh toán</div>
                    </div>
                  </label>

                  <label
                    className={`payment-option ${paymentMethod === 'bank' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('bank')}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      readOnly
                    />
                    <div className="payment-option-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <div className="payment-option-name">Chuyển khoản ngân hàng</div>
                      <div className="payment-option-desc">Thông tin tài khoản gửi qua email</div>
                    </div>
                  </label>

                  <label
                    className={`payment-option ${paymentMethod === 'momo' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('momo')}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="momo"
                      checked={paymentMethod === 'momo'}
                      readOnly
                    />
                    <div className="payment-option-icon" style={{ background: '#fce4ec', color: '#e91e63' }}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10" />
                        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
                          M
                        </text>
                      </svg>
                    </div>
                    <div>
                      <div className="payment-option-name">Ví MoMo</div>
                      <div className="payment-option-desc">Quét mã QR sau khi đặt hàng</div>
                    </div>
                  </label>
                </div>

                <button type="submit" className="btn-place-order" style={{ marginTop: '2rem' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Đặt hàng ngay
                </button>
              </form>
            </div>

            {/* Right: Order Summary */}
            <aside className="checkout-summary-card">
              <h3 className="summary-title">Tóm tắt đơn hàng</h3>

              <div id="order-items-list" className="order-items-list">
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
                    <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>Số lượng: {item.quantity}</div>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{formatVND(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              <div className="summary-rows" style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '1rem' }}>
                <div className="summary-row">
                  <span>Tạm tính ({cart.reduce((s, i) => s + i.quantity, 0)} sản phẩm)</span>
                  <span className="summary-row-val">{formatVND(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Phí vận chuyển</span>
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
                  <span>Tổng thanh toán</span>
                  <span className="summary-total-val">{formatVND(finalTotal)}</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
