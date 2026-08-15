import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Điều Khoản Sử Dụng - Mini Shop Decor',
  description: 'Quy định và điều khoản sử dụng dịch vụ trên website bán hàng Mini Shop Decor.',
};

export default function TermsPage() {
  return (
    <div className="policy-page-wrapper">
      <div className="breadcrumb-bar" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', padding: '0.85rem 0', marginBottom: '2.5rem' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--color-muted)' }}>
          <Link href="/" style={{ color: 'var(--color-muted)' }}>Trang chủ</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>Điều khoản sử dụng</span>
        </div>
      </div>

      <div className="container">
        <div className="policy-card">
          <header className="policy-header">
            <h1 className="policy-title">Điều Khoản Sử Dụng Website</h1>
            <p className="policy-subtitle">
              Vui lòng đọc kỹ các điều khoản dưới đây trước khi thực hiện mua sắm tại Mini Shop Decor.
            </p>
          </header>

          <section className="policy-section">
            <h2 className="policy-heading">1. Quy Định Chung</h2>
            <p className="policy-paragraph">
              Khi truy cập và sử dụng website Mini Shop Decor, quý khách mặc định đồng ý tuân thủ các điều khoản và quy định được nêu tại đây. Chúng tôi có quyền thay đổi, chỉnh sửa nội dung điều khoản bất kỳ lúc nào để phù hợp với quy định pháp luật và hoạt động kinh doanh.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">2. Quyền & Trách Nhiệm Của Khách Hàng</h2>
            <ul className="policy-list">
              <li>Cung cấp đầy đủ, chính xác các thông tin khi đăng ký tài khoản và đặt hàng (Họ tên, Số điện thoại, Địa chỉ nhận hàng).</li>
              <li>Tự bảo mật thông tin tài khoản và mật khẩu đăng nhập của mình.</li>
              <li>Tuyệt đối không sử dụng bất kỳ công cụ hay hành vi nào làm tổn hại, can thiệp trái phép vào hệ thống website.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">3. Tài Khoản & Đặt Hàng</h2>
            <p className="policy-paragraph">
              Khách hàng có thể đăng ký tài khoản để quản lý đơn hàng và trải nghiệm mua sắm nhanh chóng. Quý khách có trách nhiệm cập nhật thông tin nếu có thay đổi để đảm bảo việc giao nhận diễn ra chính xác.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">4. Sản Phẩm, Giá Bán & Thông Tin</h2>
            <p className="policy-paragraph">
              Mini Shop Decor cam kết cung cấp thông tin sản phẩm, hình ảnh và giá niêm yết chính xác nhất. Tuy nhiên, trong một số trường hợp hiếm hoi do sai sót kỹ thuật, nếu giá bán sản phẩm hiển thị không chính xác, chúng tôi sẽ liên hệ thông báo trực tiếp tới quý khách trước khi xử lý đơn hàng.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">5. Đơn Hàng & Thanh Toán</h2>
            <p className="policy-paragraph">
              Đơn hàng của quý khách chỉ được coi là hợp lệ khi được xác nhận thành công trên hệ thống. Quý khách có thể lựa chọn các phương thức thanh toán linh hoạt như Thanh toán khi nhận hàng (COD), Chuyển khoản ngân hàng hoặc qua Ví điện tử.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">6. Bản Quyền & Sở Hữu Trí Tuệ</h2>
            <p className="policy-paragraph">
              Toàn bộ nội dung, hình ảnh thiết kế, logo, văn bản và mã nguồn trên website thuộc quyền sở hữu trí tuệ của Mini Shop Decor. Nghiêm cấm mọi hành vi sao chép, trích dẫn khi chưa được sự đồng ý bằng văn bản của chúng tôi.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">7. Thay Đổi Nội Dung & Điều Khoản</h2>
            <p className="policy-paragraph">
              Mini Shop Decor có thể cập nhật các nội dung điều khoản bất kỳ lúc nào mà không cần thông báo trước. Việc khách hàng tiếp tục sử dụng website sau khi các điều khoản được sửa đổi đồng nghĩa với việc chấp nhận những thay đổi đó.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">8. Giới Hạn Trách Nhiệm & Giải Quyết Tranh Chấp</h2>
            <p className="policy-paragraph">
              Mọi tranh chấp phát sinh giữa khách hàng và Mini Shop Decor sẽ được ưu tiên thương lượng và giải quyết trên tinh thần hợp tác, tôn trọng quyền lợi chính đáng của cả hai bên.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
