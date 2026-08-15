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
    <div className="auth-page" style={{ minHeight: '80vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left decorative panel */}
      <div className="auth-panel-left" style={{ background: '#f0fdf4', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="auth-brand" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '2rem' }}>
          Mini Shop
        </div>
        <img
          src="/MiniShop_Assets/assets/images/banner/banner-trang-chu-mini-shop.webp"
          alt="Mini Shop Register"
          className="auth-hero-img"
          style={{ width: '100%', maxWidth: '340px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-hover)' }}
        />
        <div className="auth-tagline" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <h2>Tham gia cùng Mini Shop</h2>
          <p>Nhận ngay ưu đãi cho thành viên mới và trải nghiệm mua sắm dễ dàng.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-panel-right" style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="auth-form-wrap" style={{ width: '100%', maxWidth: '400px' }}>
          <h1 className="auth-form-title" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Đăng ký tài khoản
          </h1>
          <p className="auth-form-subtitle" style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '1.5rem' }}>
            Đã có tài khoản?{' '}
            <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              Đăng nhập ngay
            </Link>
          </p>

          {errorMsg && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>
              {errorMsg}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Họ và tên *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-input"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Mật khẩu * (Tối thiểu 6 ký tự)</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Xác nhận mật khẩu *</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              style={{ width: '100%', padding: '0.8rem' }}
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
