import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thanh Toán & Giao Hàng - Mini Shop Decor',
  description: 'Thông tin phương thức thanh toán, quy trình đóng gói và chính sách giao hàng tại Mini Shop Decor.',
};

export default function PaymentShippingPage() {
  return (
    <div className="policy-page-wrapper">
      <div className="breadcrumb-bar" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', padding: '0.85rem 0', marginBottom: '2.5rem' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--color-muted)' }}>
          <Link href="/" style={{ color: 'var(--color-muted)' }}>Trang chủ</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>Thanh toán & giao hàng</span>
        </div>
      </div>

      <div className="container">
        <div className="policy-card">
          <header className="policy-header">
            <h1 className="policy-title">Thanh Toán & Quy Trình Giao Hàng</h1>
            <p className="policy-subtitle">
              Phương thức thanh toán an toàn, quy trình đóng gói chuẩn quy cách và vận chuyển tận tay.
            </p>
          </header>

          <section className="policy-section">
            <h2 className="policy-heading">1. Các Phương Thức Thanh Toán</h2>
            <p className="policy-paragraph">
              Mini Shop Decor hỗ trợ đa dạng hình thức thanh toán thuận tiện cho quý khách:
            </p>
            <ul className="policy-list">
              <li><strong>Thanh toán khi nhận hàng (COD):</strong> Quý khách kiểm tra hàng trước và thanh toán tiền mặt trực tiếp cho nhân viên giao hàng.</li>
              <li><strong>Chuyển khoản ngân hàng:</strong> Chuyển khoản trực tiếp vào tài khoản ngân hàng của shop với cú pháp là Mã đơn hàng.</li>
              <li><strong>Ví điện tử (MoMo / ZaloPay):</strong> Thanh toán nhanh chóng qua mã QR hiển thị tại bước checkout.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">2. Quy Trình Xác Nhận & Đóng Gói Đơn Hàng</h2>
            <p className="policy-paragraph">
              <strong>Xác nhận đơn hàng:</strong> Sau khi quý khách hoàn tất bấm đặt hàng trên website, bộ phận tư vấn sẽ liên hệ qua điện thoại/Zalo để xác nhận lại danh sách món và địa chỉ giao hàng.
            </p>
            <p className="policy-paragraph">
              <strong>Quy chuẩn đóng gói:</strong> Với đặc thù là các sản phẩm trang trí gia dụng, đồ gốm sứ, đồ mây tre đan... tất cả sản phẩm đều được bọc xốp bóng khí (bubble wrap) 3-4 lớp bọc dày, chèn mút xốp định hình và bọc thùng carton 5 lớp cứng cáp chống va đập tuyệt đối.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">3. Quy Trình Vận Chuyển & Thời Gian Giao Dự Kiến</h2>
            <ul className="policy-list">
              <li><strong>Khu vực Nội thành (Hà Nội & TP.HCM):</strong> Nhận hàng từ 1 - 2 ngày làm việc.</li>
              <li><strong>Các Tỉnh/Thành phố khác:</strong> Nhận hàng từ 3 - 5 ngày làm việc tùy khu vực địa lý.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">4. Những Lưu Ý Quan Trọng Khi Nhận Hàng</h2>
            <p className="policy-paragraph">
              Quý khách có quyền mở thùng kiểm tra sản phẩm trước khi thanh toán cho nhân viên giao hàng (Quyền lợi đồng kiểm).
            </p>
            <p className="policy-paragraph">
              Nếu phát hiện sản phẩm bị nứt vỡ hoặc sai mẫu, quý khách vui lòng từ chối nhận hàng và chụp ảnh/quay video gửi lại cho chăm sóc khách hàng của Mini Shop Decor để được gửi hàng mới nhanh nhất.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">5. Xử Lý Trường Hợp Giao Hàng Không Thành Công</h2>
            <p className="policy-paragraph">
              Trong trường hợp nhân viên giao hàng không liên lạc được với người nhận, đơn hàng sẽ được lưu kho tại bưu cục và giao lại tối đa 3 lần. Nếu vẫn không giao được, đơn hàng sẽ được hoàn về cho shop và bộ phận chăm sóc khách hàng sẽ liên hệ lại với quý khách để hẹn lại lịch giao.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
