import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chính Sách Đổi Trả - Mini Shop Decor',
  description: 'Chính sách đổi trả sản phẩm, điều kiện và quy trình hoàn tiền tại Mini Shop Decor.',
};

export default function ReturnPolicyPage() {
  return (
    <div className="policy-page-wrapper">
      <div className="breadcrumb-bar" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', padding: '0.85rem 0', marginBottom: '2.5rem' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--color-muted)' }}>
          <Link href="/" style={{ color: 'var(--color-muted)' }}>Trang chủ</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>Chính sách đổi trả</span>
        </div>
      </div>

      <div className="container">
        <div className="policy-card">
          <header className="policy-header">
            <h1 className="policy-title">Chính Sách Đổi Trả Sản Phẩm</h1>
            <p className="policy-subtitle">
              Đảm bảo quyền lợi mua sắm minh bạch, rõ ràng và uy tín cho khách hàng của Mini Shop Decor.
            </p>
          </header>

          <section className="policy-section">
            <h2 className="policy-heading">1. Điều Kiện Được Đổi / Trả Hàng</h2>
            <p className="policy-paragraph">
              Sản phẩm mua tại Mini Shop Decor được hỗ trợ đổi trả khi đáp ứng đầy đủ các điều kiện sau:
            </p>
            <ul className="policy-list">
              <li>Sản phẩm còn nguyên tem mác, bao bì đóng gói ban đầu và chưa qua sử dụng.</li>
              <li>Có thông tin xác nhận đơn hàng hoặc mã đơn hàng trùng khớp trên hệ thống.</li>
              <li>Thời gian yêu cầu đổi trả nằm trong thời hạn quy định.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">2. Các Trường Hợp Được Hỗ Trợ Đổi Trả</h2>
            <ul className="policy-list">
              <li>Sản phẩm bị nứt, vỡ, móp méo hoặc hỏng hóc do quá trình vận chuyển.</li>
              <li>Giao sai chủng loại, sai mẫu mã hoặc thiếu sản phẩm so với đơn hàng đã đặt.</li>
              <li>Sản phẩm gặp lỗi kỹ thuật từ nhà sản xuất ngay khi mở thùng kiểm tra.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">3. Các Trường Hợp Không Được Đổi Trả</h2>
            <ul className="policy-list">
              <li>Sản phẩm đã qua sử dụng, va đập, nứt vỡ do khách hàng gây ra trong quá trình sử dụng.</li>
              <li>Sản phẩm thuộc chương trình xả kho hoặc quà tặng khuyến mãi đặc biệt có thông báo không đổi trả.</li>
              <li>Quá thời hạn yêu cầu đổi trả quy định kể từ khi nhận hàng thành công.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">4. Thời Gian & Quy Trình Yêu Cầu Đổi Trả</h2>
            <p className="policy-paragraph">
              <strong>Thời gian tiếp nhận:</strong> Trong vòng 07 ngày kể từ ngày khách hàng nhận được đơn hàng.
            </p>
            <p className="policy-paragraph">
              <strong>Quy trình 4 bước đơn giản:</strong>
            </p>
            <ul className="policy-list">
              <li><strong>Bước 1:</strong> Chụp ảnh / quay video tình trạng sản phẩm lỗi hoặc nhầm lẫn.</li>
              <li><strong>Bước 2:</strong> Gửi hình ảnh và mã đơn hàng qua hotline/email hỗ trợ dịch vụ khách hàng.</li>
              <li><strong>Bước 3:</strong> Bộ phận chăm sóc khách hàng xác nhận yêu cầu và hướng dẫn đóng gói gửi trả.</li>
              <li><strong>Bước 4:</strong> Mini Shop Decor gửi sản phẩm mới thay thế hoặc tiến hành hoàn tiền.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">5. Chi Phí Vận Chuyển & Phương Thức Hoàn Tiền</h2>
            <p className="policy-paragraph">
              <strong>Chi phí vận chuyển:</strong> Miễn phí 100% chi phí gửi đổi trả nếu lỗi xuất phát từ phía sản xuất hoặc đơn vị vận chuyển.
            </p>
            <p className="policy-paragraph">
              <strong>Phương thức hoàn tiền:</strong> Hoàn tiền qua chuyển khoản ngân hàng hoặc ví điện tử trong vòng 03 ngày làm việc sau khi tiếp nhận và kiểm tra hàng đổi trả thành công.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
