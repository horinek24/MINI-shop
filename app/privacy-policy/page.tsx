import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chính Sách Bảo Mật - Mini Shop Decor',
  description: 'Chính sách bảo mật thông tin cá nhân khách hàng của Mini Shop Decor.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="policy-page-wrapper">
      <div className="breadcrumb-bar" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', padding: '0.85rem 0', marginBottom: '2.5rem' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--color-muted)' }}>
          <Link href="/" style={{ color: 'var(--color-muted)' }}>Trang chủ</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>Chính sách bảo mật</span>
        </div>
      </div>

      <div className="container">
        <div className="policy-card">
          <header className="policy-header">
            <h1 className="policy-title">Chính Sách Bảo Mật Thông Tin</h1>
            <p className="policy-subtitle">
              Mini Shop Decor tôn trọng và cam kết bảo vệ tuyệt đối thông tin riêng tư của khách hàng.
            </p>
          </header>

          <section className="policy-section">
            <h2 className="policy-heading">1. Thông Tin Thu Thập</h2>
            <p className="policy-paragraph">
              Khi quý khách thực hiện đăng ký tài khoản, đặt hàng hoặc tương tác trên website Mini Shop Decor, chúng tôi có thể thu thập các thông tin sau:
            </p>
            <ul className="policy-list">
              <li>Họ và tên người đặt hàng / người nhận hàng.</li>
              <li>Địa chỉ email, số điện thoại liên hệ.</li>
              <li>Địa chỉ giao nhận hàng hóa chi tiết.</li>
              <li>Lịch sử đơn hàng, ghi chú mua hàng và phương thức thanh toán lựa chọn.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">2. Mục Đích Thu Thập & Sử Dụng Thông Tin</h2>
            <p className="policy-paragraph">
              Thông tin thu thập được sử dụng duy nhất cho các mục đích hợp pháp sau:
            </p>
            <ul className="policy-list">
              <li>Xử lý, xác nhận đơn hàng và giao sản phẩm tới đúng địa chỉ của quý khách.</li>
              <li>Thông báo về tiến độ đơn hàng và hỗ trợ chăm sóc khách hàng sau bán hàng.</li>
              <li>Gửi thông tin cập nhật về khuyến mãi, chính sách ưu đãi (nếu quý khách đăng ký nhận tin).</li>
              <li>Giải quyết các khiếu nại, tranh chấp phát sinh trong quá trình sử dụng dịch vụ.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">3. Lưu Trữ & Bảo Vệ Dữ Liệu</h2>
            <p className="policy-paragraph">
              Mọi dữ liệu cá nhân của khách hàng được mã hóa và lưu trữ an toàn trên hệ thống máy chủ cơ sở dữ liệu chuyên dụng với các giao thức bảo mật SSL tiêu chuẩn. Mật khẩu tài khoản của người dùng được mã hóa qua cơ chế Auth tiêu chuẩn và tuyệt đối không bao giờ được lưu dưới dạng văn bản thường.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">4. Quy Định Chia Sẻ Với Bên Thứ Ba</h2>
            <p className="policy-paragraph">
              Mini Shop Decor cam kết không bán, chia sẻ hay trao đổi thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào vì mục đích thương mại.
            </p>
            <p className="policy-paragraph">
              Thông tin chỉ được cung cấp cho các đơn vị vận chuyển đối tác để thực hiện việc giao nhận hàng, hoặc cung cấp theo yêu cầu của cơ quan pháp luật có thẩm quyền khi có văn bản yêu cầu chính thức.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">5. Cookie & Dữ Liệu Truy Cập Website</h2>
            <p className="policy-paragraph">
              Website sử dụng Cookie để lưu trạng thái phiên làm việc (như sản phẩm trong giỏ hàng, danh sách yêu thích, trạng thái đăng nhập). Việc sử dụng Cookie giúp mang lại trải nghiệm mua sắm nhanh chóng và mượt mà hơn cho quý khách.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">6. Quyền Của Khách Hàng Đối Với Dữ Liệu</h2>
            <p className="policy-paragraph">
              Quý khách có toàn quyền truy cập, cập nhật hoặc yêu cầu chỉnh sửa, xóa bỏ thông tin cá nhân của mình bằng cách đăng nhập vào tài khoản trên website hoặc liên hệ với bộ phận hỗ trợ của chúng tôi.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">7. Thời Gian Lưu Trữ Dữ Liệu</h2>
            <p className="policy-paragraph">
              Dữ liệu cá nhân của khách hàng sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ hoặc tự khách hàng thực hiện xóa tài khoản trên hệ thống.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">8. Thắc Mắc & Liên Hệ Bảo Mật</h2>
            <p className="policy-paragraph">
              Nếu quý khách có bất kỳ thắc mắc hoặc góp ý nào liên quan đến chính sách bảo mật, xin vui lòng gửi phản hồi qua hệ thống hỗ trợ trực tiếp trên website Mini Shop Decor để được bộ phận kỹ thuật hỗ trợ kịp thời.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
