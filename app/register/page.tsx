'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải có độ dài từ 6 ký tự trở lên.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không trùng khớp.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const res = await register(name, email, password);
    setSubmitting(false);

    if (res.success) {
      alert('Đăng ký tài khoản thành công! Bạn sẽ chuyển đến trang chủ.');
      router.push('/');
    } else {
      setErrorMsg(res.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-wrapper">
        {/* Left decorative panel */}
        <div className="auth-panel-left">
          <div className="auth-left-content">
            <div className="auth-left-brand">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h6v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z" />
              </svg>
              Mini Shop Decor
            </div>

            <div className="auth-banner-img-wrap">
              <img
                src="/MiniShop_Assets/assets/images/banner/auth-banner.jpg"
                alt="Mini Shop Register Banner"
                loading="eager"
              />
            </div>

            <h2 className="auth-left-heading">Tham gia cùng Mini Shop</h2>
            <p className="auth-left-sub">
              Tạo tài khoản ngay hôm nay để nhận ưu đãi thành viên mới và theo dõi đơn hàng dễ dàng.
            </p>

            <div className="auth-left-features">
              <span className="auth-feature-chip">🎁 Ưu đãi thành viên</span>
              <span className="auth-feature-chip">⚡ Thanh toán nhanh</span>
              <span className="auth-feature-chip">📦 Quản lý đơn hàng</span>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="auth-panel-right">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Tạo tài khoản</h1>
            <p className="auth-form-subtitle">
              Đã có tài khoản?{' '}
              <Link href="/login">
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          {errorMsg && (
            <div className="auth-error-banner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errorMsg}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group-v2">
              <label className="form-label-v2">Họ và tên *</label>
              <div className="input-with-icon">
                <span className="input-icon-left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="form-input-v2"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group-v2">
              <label className="form-label-v2">Email đăng ký *</label>
              <div className="input-with-icon">
                <span className="input-icon-left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  type="email"
                  className="form-input-v2"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group-v2">
              <label className="form-label-v2">Mật khẩu * (Tối thiểu 6 ký tự)</label>
              <div className="input-with-icon">
                <span className="input-icon-left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="password"
                  className="form-input-v2"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group-v2">
              <label className="form-label-v2">Xác nhận mật khẩu *</label>
              <div className="input-with-icon">
                <span className="input-icon-left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </span>
                <input
                  type="password"
                  className="form-input-v2"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-auth-submit"
              disabled={submitting}
            >
              {submitting ? 'Đang tạo tài khoản...' : 'Đăng ký tài khoản'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
