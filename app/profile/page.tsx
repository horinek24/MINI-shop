'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import { VIETNAM_PROVINCES } from '@/data/vietnamLocations';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [provinceId, setProvinceId] = useState<string>('hanoi');
  const [districtName, setDistrictName] = useState<string>('Quận Cầu Giấy');
  const [streetAddress, setStreetAddress] = useState<string>('');

  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [updatingProfile, setUpdatingProfile] = useState<boolean>(false);
  const [updatingPassword, setUpdatingPassword] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      setName(user.name || '');
      // Load saved user_metadata from localStorage or Supabase
      const savedPhone = localStorage.getItem(`profile_phone_${user.email}`) || '';
      const savedProv = localStorage.getItem(`profile_province_${user.email}`) || 'hanoi';
      const savedDist = localStorage.getItem(`profile_district_${user.email}`) || 'Quận Cầu Giấy';
      const savedAddr = localStorage.getItem(`profile_address_${user.email}`) || '';

      setPhone(savedPhone);
      setProvinceId(savedProv);
      setDistrictName(savedDist);
      setStreetAddress(savedAddr);
    }
  }, [user, loading, router]);

  const selectedProvince = VIETNAM_PROVINCES.find((p) => p.id === provinceId) || VIETNAM_PROVINCES[0];

  const handleProvinceChange = (newProvId: string) => {
    setProvinceId(newProvId);
    const prov = VIETNAM_PROVINCES.find((p) => p.id === newProvId);
    if (prov && prov.districts.length > 0) {
      setDistrictName(prov.districts[0].name);
    } else {
      setDistrictName('');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdatingProfile(true);
    try {
      localStorage.setItem(`profile_phone_${user.email}`, phone.trim());
      localStorage.setItem(`profile_province_${user.email}`, provinceId);
      localStorage.setItem(`profile_district_${user.email}`, districtName);
      localStorage.setItem(`profile_address_${user.email}`, streetAddress.trim());

      alert('Đã cập nhật thông tin cá nhân và địa chỉ mặc định thành công!');
    } catch (err) {
      console.error('Lỗi khi lưu profile:', err);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Xác nhận mật khẩu mới không trùng khớp.');
      return;
    }

    setUpdatingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        alert(`Lỗi đổi mật khẩu: ${error.message}`);
      } else {
        alert('Đổi mật khẩu thành công! Vui lòng nhớ mật khẩu mới cho lần đăng nhập sau.');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error('Lỗi đổi mật khẩu:', err);
      alert('Đã xảy ra lỗi khi đổi mật khẩu.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="policy-page-wrapper" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.1rem', color: 'var(--color-muted)', fontWeight: 600 }}>Đang tải thông tin cá nhân...</div>
      </div>
    );
  }

  return (
    <div className="policy-page-wrapper">
      <div className="breadcrumb-bar" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', padding: '0.85rem 0', marginBottom: '2.5rem' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--color-muted)' }}>
          <Link href="/" style={{ color: 'var(--color-muted)' }}>Trang chủ</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>Hồ sơ cá nhân</span>
        </div>
      </div>

      <div className="container">
        <div className="policy-card">
          <header className="policy-header">
            <h1 className="policy-title">Hồ Sơ Cá Nhân & Cài Đặt</h1>
            <p className="policy-subtitle">
              Quản lý thông tin liên hệ, địa chỉ giao hàng mặc định và đổi mật khẩu tài khoản.
            </p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginTop: '1.5rem' }}>
            {/* Form 1: Cập nhật thông tin giao hàng */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg, 12px)', padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '1.25rem' }}>
                Thông Tin Cá Nhân & Giao Hàng Mặc Định
              </h2>

              <form onSubmit={handleSaveProfile}>
                <div className="form-group">
                  <label className="form-label">Email tài khoản</label>
                  <input type="text" className="form-input" value={user.email} disabled style={{ backgroundColor: '#f1f5f9' }} />
                </div>

                <div className="form-group">
                  <label className="form-label">Họ và tên</label>
                  <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Số điện thoại liên hệ</label>
                  <input type="tel" className="form-input" placeholder="0912 345 678" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Tỉnh / Thành phố mặc định</label>
                  <select className="form-input form-select" value={provinceId} onChange={(e) => handleProvinceChange(e.target.value)}>
                    {VIETNAM_PROVINCES.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Quận / Huyện mặc định</label>
                  <select className="form-input form-select" value={districtName} onChange={(e) => setDistrictName(e.target.value)}>
                    {selectedProvince.districts.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Địa chỉ cụ thể (Số nhà, Tên đường...)</label>
                  <input type="text" className="form-input" placeholder="Số 123 đường ABC, Phường XYZ..." value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} />
                </div>

                <button type="submit" className="btn btn-green btn-full" disabled={updatingProfile} style={{ padding: '0.8rem', fontWeight: 700 }}>
                  {updatingProfile ? 'Đang lưu...' : 'Lưu thông tin hồ sơ'}
                </button>
              </form>
            </div>

            {/* Form 2: Đổi mật khẩu */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg, 12px)', padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '1.25rem' }}>
                Đổi Mật Khẩu Tài Khoản
              </h2>

              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label className="form-label">Mật khẩu mới *</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Nhập ít nhất 6 ký tự"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Xác nhận mật khẩu mới *</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full" disabled={updatingPassword} style={{ padding: '0.8rem', fontWeight: 700, marginTop: '1.5rem' }}>
                  {updatingPassword ? 'Đang xử lý...' : 'Đổi mật khẩu ngay'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
