'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { createClient } from '@/utils/supabase/client';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Tư vấn chọn mẫu decor');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState<number>(0);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) {
      alert(`Vui lòng chờ ${cooldown} giây trước khi gửi tin nhắn tiếp theo.`);
      return;
    }
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert('Vui lòng điền đầy đủ Họ tên, Email và Nội dung cần hỗ trợ.');
      return;
    }

    setSending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('messages').insert({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || '---',
        subject: subject,
        message: message.trim(),
        status: 'new',
      });

      if (error) {
        alert(`Lỗi khi gửi tin nhắn: ${error.message}`);
      } else {
        alert('Cảm ơn bạn đã liên hệ! Đội ngũ tư vấn Mini Shop Decor đã nhận được tin nhắn và sẽ phản hồi bạn trong thời gian sớm nhất.');
        setName('');
        setEmail('');
        setPhone('');
        setSubject('Tư vấn chọn mẫu decor');
        setMessage('');
        setCooldown(30);
      }
    } catch (err) {
      console.error('Lỗi khi gửi tin nhắn:', err);
      alert('Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại sau.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="policy-page-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', padding: '0.85rem 0', marginBottom: '2.5rem' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--color-muted)' }}>
          <Link href="/" style={{ color: 'var(--color-muted)' }}>Trang chủ</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>Liên hệ</span>
        </div>
      </div>

      <div className="container">
        <div className="policy-card">
          <header className="policy-header">
            <h1 className="policy-title">Liên Hệ Với Chúng Tôi</h1>
            <p className="policy-subtitle">
              Mini Shop Decor luôn lắng nghe và sẵn sàng hỗ trợ giải đáp mọi thắc mắc của quý khách.
            </p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', marginTop: '1.5rem' }}>
            {/* Left Col: Contact Information */}
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '1.2rem' }}>
                Thông Tin Hỗ Trợ Khách Hàng
              </h2>
              <p style={{ fontSize: '0.98rem', color: '#4b5563', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Hãy kết nối với chúng tôi qua các kênh hỗ trợ bên dưới hoặc gửi tin nhắn trực tiếp qua mẫu liên hệ. Chúng tôi sẽ phản hồi nhanh nhất có thể.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.2rem' }}>Địa Chỉ Văn Phòng</h4>
                    <p style={{ fontSize: '0.92rem', color: '#4b5563' }}>Hà Nội, Việt Nam</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.2rem' }}>Hotline / Zalo Tư Vấn</h4>
                    <p style={{ fontSize: '0.92rem', color: '#4b5563' }}>0123 456 789 (08:00 - 21:00 hàng ngày)</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', backgroundColor: '#f5f3ff', color: '#8b5cf6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.2rem' }}>Email Dịch Vụ Khách Hàng</h4>
                    <p style={{ fontSize: '0.92rem', color: '#4b5563' }}>support@minishop.vn</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.75rem' }}>Theo Dõi Chúng Tôi Trên Mạng Xã Hội</h4>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <a
                    href="https://www.facebook.com/trinhtan.phat.33/?locale=vi_VN"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: '0.5rem 1rem', borderRadius: '6px', backgroundColor: '#1877f2', color: '#fff', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}
                  >
                    Facebook
                  </a>
                  <a
                    href="https://www.tiktok.com/@p_shinaa.24"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: '0.5rem 1rem', borderRadius: '6px', backgroundColor: '#000000', color: '#fff', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}
                  >
                    TikTok
                  </a>
                  <a
                    href="https://www.youtube.com/@TanPhat-xh2dr"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: '0.5rem 1rem', borderRadius: '6px', backgroundColor: '#ff0000', color: '#fff', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}
                  >
                    YouTube
                  </a>
                </div>
              </div>
            </div>

            {/* Right Col: Contact Message Form */}
            <div style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: 'var(--radius-lg, 12px)', border: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '1.2rem' }}>
                Gửi Tin Nhắn Cho Chúng Tôi
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Họ và tên của bạn *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email liên hệ *</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Số điện thoại</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="0912 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Chủ đề cần tư vấn</label>
                  <select
                    className="form-input form-select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="Tư vấn sản phẩm">Tư vấn chọn mẫu decor</option>
                    <option value="Hỏi về đơn hàng">Hỏi về đơn hàng đã đặt</option>
                    <option value="Hỗ trợ đổi trả">Yêu cầu bảo hành / đổi trả</option>
                    <option value="Hợp tác kinh doanh">Góp ý dịch vụ & hợp tác</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Nội dung tin nhắn *</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Hãy nhập câu hỏi hoặc thắc mắc của bạn tại đây..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-green btn-full"
                  style={{ padding: '0.8rem 1.5rem', fontSize: '0.95rem', fontWeight: 700 }}
                >
                  Gửi tin nhắn liên hệ
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
