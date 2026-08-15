'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      if (email.trim().toLowerCase() === 'admin@minishop.vn') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      setErrorMsg(res.message || 'Tài khoản hoặc mật khẩu không chính xác.');
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
          alt="Mini Shop Login"
          className="auth-hero-img"
          style={{ width: '100%', maxWidth: '340px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-hover)' }}
        />
        <div className="auth-tagline" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <h2>Sống đẹp mỗi ngày</h2>
          <p>Khám phá bộ sưu tập nội thất và đồ trang trí phong cách độc đáo.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-panel-right" style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="auth-form-wrap" style={{ width: '100%', maxWidth: '400px' }}>
          <h1 className="auth-form-title" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Đăng nhập
          </h1>
          <p className="auth-form-subtitle" style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '1.5rem' }}>
            Chưa có tài khoản?{' '}
            <Link href="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              Đăng ký ngay
            </Link>
          </p>

          {errorMsg && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>
              {errorMsg}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1.1rem' }}>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Mật khẩu</label>
              <div className="password-wrapper" style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn-toggle-password"
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              style={{ width: '100%', padding: '0.8rem' }}
              disabled={submitting}
            >
              {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
