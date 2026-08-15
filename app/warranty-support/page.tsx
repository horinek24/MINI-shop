import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bảo Hành & Đổi Trả - Mini Shop Decor',
  description: 'Chính sách và hướng dẫn bảo hành sản phẩm nội thất & trang trí tại Mini Shop Decor.',
};

export default function WarrantySupportPage() {
  return (
    <div className="policy-page-wrapper">
      <div className="breadcrumb-bar" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', padding: '0.85rem 0', marginBottom: '2.5rem' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--color-muted)' }}>
          <Link href="/" style={{ color: 'var(--color-muted)' }}>Trang chủ</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>Bảo hành & hỗ trợ</span>
        </div>
      </div>

      <div className="container">
        <div className="policy-card">
          <header className="policy-header">
            <h1 className="policy-title">Chính Sách Bảo Hành & Hỗ Trợ Kỹ Thuật</h1>
            <p className="policy-subtitle">
              Cam kết đồng hành và xử lý triệt để các vấn đề sản phẩm cho khách hàng.
            </p>
          </header>

          <section className="policy-section">
            <h2 className="policy-heading">1. Phân Biệt Giữa Bảo Hành & Đổi Trả</h2>
            <p className="policy-paragraph">
              Để quý khách dễ dàng áp dụng quyền lợi của mình, Mini Shop Decor phân biệt rõ 2 dịch vụ hỗ trợ:
            </p>
            <ul className="policy-list">
              <li><strong>Chính sách Đổi Trả:</strong> Áp dụng trong vòng 07 ngày đầu tiên kể từ khi nhận hàng cho các sản phẩm bị lỗi móp vỡ do giao hàng, sai mẫu mã hoặc lỗi sản xuất ngay khi bóc hộp (Chi tiết xem tại <Link href="/return-policy" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Chính sách đổi trả</Link>).</li>
              <li><strong>Chính sách Bảo Hành:</strong> Áp dụng từ 3 đến 12 tháng tùy loại sản phẩm cho các phát sinh kỹ thuật trong quá trình sử dụng bình thường (như lỗi kết nối mạch đèn decor, lỏng khớp kết nối bàn gỗ,...).</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">2. Điều Kiện & Khi Nào Được Bảo Hành</h2>
            <ul className="policy-list">
              <li>Sản phẩm còn trong thời hạn bảo hành tính từ ngày mua trên hóa đơn/hệ thống đơn hàng.</li>
              <li>Lỗi xuất phát từ chất lượng vật liệu hoặc quá trình gia công sản xuất của Mini Shop Decor.</li>
              <li>Phiếu bảo hành hoặc mã đơn hàng trùng khớp trên hệ thống lưu trữ kho Supabase.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">3. Các Trường Hợp Từ Chối Bảo Hành</h2>
            <ul className="policy-list">
              <li>Sản phẩm hư hỏng do tai nạn, rơi vỡ, thiên tai, hỏa hoạn hoặc ngâm nước.</li>
              <li>Khách hàng tự ý tháo rời, biến dạng cấu trúc hoặc sửa chữa tại các cơ sở bên ngoài.</li>
              <li>Hao mòn tự nhiên theo thời gian sử dụng (như trầy xước sơn nhẹ trong quá trình dùng).</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">4. Quy Trình Gửi Yêu Cầu Bảo Hành</h2>
            <ul className="policy-list">
              <li><strong>Bước 1:</strong> Khách hàng quay video mô tả chi tiết lỗi phát sinh trên sản phẩm.</li>
              <li><strong>Bước 2:</strong> Gửi video kèm Mã đơn hàng đến kênh CSKH của Mini Shop Decor.</li>
              <li><strong>Bước 3:</strong> Kỹ thuật viên tiếp nhận, đánh giá và hướng dẫn gửi sản phẩm về trung tâm bảo hành hoặc gửi linh kiện thay thế tận nhà.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
