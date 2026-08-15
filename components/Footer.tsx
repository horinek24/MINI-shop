import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer id="site-footer" className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand */}
          <div className="footer-col-brand">
            <Link href="/" className="brand-logo" title="Mini Shop Decor">
              <svg viewBox="0 0 24 24">
                <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h6v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z" />
              </svg>
              Mini Shop Decor
            </Link>
            <p className="footer-tagline">Đồ dùng & trang trí cho cuộc sống tiện nghi và phong cách.</p>
            <div className="footer-socials">
              <a
                href="https://www.facebook.com/trinhtan.phat.33/?locale=vi_VN"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="Facebook Mini Shop Decor"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.5C10 7.01 11.49 5.6 13.78 5.6c1.1 0 2.25.2 2.25.2v2.48h-1.27c-1.23 0-1.62.77-1.62 1.56V12h2.78l-.44 3h-2.34v6.8c4.56-.93 8-4.96 8-9.8z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@p_shinaa.24"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="TikTok Mini Shop Decor"
                aria-label="TikTok"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V5.8a6.32 6.32 0 0 0-1-.08A6.34 6.34 0 0 0 3.05 12a6.34 6.34 0 0 0 10.82 4.46V9.45a8.27 8.27 0 0 0 4.85 1.56v-3.4a4.84 4.84 0 0 1-1.13-.92z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@TanPhat-xh2dr"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="YouTube Mini Shop Decor"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Thông tin */}
          <div>
            <h4 className="footer-heading">Thông tin</h4>
            <ul className="footer-links">
              <li><Link href="/about">Về chúng tôi</Link></li>
              <li><Link href="/privacy-policy">Chính sách bảo mật</Link></li>
              <li><Link href="/terms">Điều khoản sử dụng</Link></li>
              <li><Link href="/return-policy">Chính sách đổi trả</Link></li>
            </ul>
          </div>

          {/* Col 3: Hỗ trợ khách hàng */}
          <div>
            <h4 className="footer-heading">Hỗ trợ khách hàng</h4>
            <ul className="footer-links">
              <li><Link href="/guide">Hướng dẫn mua hàng</Link></li>
              <li><Link href="/payment-shipping">Thanh toán & giao hàng</Link></li>
              <li><Link href="/warranty-support">Bảo hành & đổi trả</Link></li>
              <li><Link href="/faq">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>

          {/* Col 4: Liên hệ */}
          <div>
            <h4 className="footer-heading">Liên hệ</h4>
            <ul className="footer-contact-list">
              <li className="contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Hà Nội, Việt Nam</span>
              </li>
              <li className="contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>Hotline hỗ trợ khách hàng</span>
              </li>
              <li className="contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>Email dịch vụ khách hàng</span>
              </li>
              <li className="contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>08:00 - 21:00 (T2 - CN)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Mini Shop Decor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
