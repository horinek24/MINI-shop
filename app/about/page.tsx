import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Về Chúng Tôi - Mini Shop Decor',
  description: 'Giới thiệu về thương hiệu Mini Shop Decor, định hướng phát triển, sản phẩm trang trí nội thất & gia dụng tinh tế.',
};

export default function AboutPage() {
  return (
    <div className="policy-page-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', padding: '0.85rem 0', marginBottom: '2.5rem' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--color-muted)' }}>
          <Link href="/" style={{ color: 'var(--color-muted)' }}>Trang chủ</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>Về chúng tôi</span>
        </div>
      </div>

      <div className="container">
        <div className="policy-card">
          <header className="policy-header">
            <h1 className="policy-title">Về Chúng Tôi - Mini Shop Decor</h1>
            <p className="policy-subtitle">
              Không gian sống phong cách, tinh tế và ấm cúng cho mỗi ngôi nhà Việt.
            </p>
          </header>

          <section className="policy-section">
            <h2 className="policy-heading">1. Mini Shop Decor Là Gì?</h2>
            <p className="policy-paragraph">
              <strong>Mini Shop Decor</strong> là thương hiệu chuyên cung cấp các sản phẩm đồ dùng nội thất, vật dụng gia đình và đồ trang trí (decor) cao cấp. Chúng tôi tin rằng nhà không chỉ là nơi để trở về, mà còn là không gian thể hiện gu thẩm mỹ, cá tính và nâng niu cảm xúc của mỗi thành viên trong gia đình.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">2. Câu Chuyện & Định Hướng Thương Hiệu</h2>
            <p className="policy-paragraph">
              Khởi đầu từ niềm đam mê tôn vinh nét đẹp thủ công kết hợp cùng phong cách thiết kế hiện đại tối giản, Mini Shop Decor ra đời nhằm giải quyết mong muốn tìm kiếm những sản phẩm decor tinh tế, thẩm mỹ cao nhưng vẫn đảm bảo sự tiện dụng trong cuộc sống thường nhật.
            </p>
            <p className="policy-paragraph">
              Chúng tôi chú trọng từng đường nét, chất liệu bền đẹp tự nhiên như gốm sứ truyền thống, gỗ sồi tự nhiên, mây tre đan thủ công, vải sợi cao cấp... Mỗi sản phẩm đưa tới tay khách hàng đều là một tác phẩm được lựa chọn tỉ mỉ.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">3. Danh Mục Sản Phẩm Cung Cấp</h2>
            <p className="policy-paragraph">
              Mini Shop Decor mang đến hệ sinh thái sản phẩm trang trí đa dạng cho nhiều không gian:
            </p>
            <ul className="policy-list">
              <li><strong>Nội thất & Gia dụng:</strong> Sofa phòng khách, bộ bàn ăn gỗ cao cấp, kệ lưu trữ đồ đạc tiện lợi.</li>
              <li><strong>Đồ Mỹ Nghệ & Thủ Công:</strong> Bình gốm Bát Tràng nghệ thuật, giỏ mây đan tỉ mỉ, đồ lưu niệm thủ công.</li>
              <li><strong>Đèn & Ánh Sáng Decor:</strong> Đèn tre nghệ thuật, đèn thả trần không gian ấm cúng, đèn ngủ để bàn tinh tế.</li>
              <li><strong>Phụ Kiện Trang Trí:</strong> Khay đựng trà, tranh treo tường, gương decor phong cách tối giản Scandinavian.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">4. Giá Trị Mang Đến Cho Khách Hàng</h2>
            <p className="policy-paragraph">
              Chúng tôi cam kết tạo nên sự khác biệt thông qua:
            </p>
            <ul className="policy-list">
              <li><strong>Thẩm Mỹ & Tinh Tế:</strong> Thiết kế chuẩn mực, màu sắc hài hòa giúp không gian sống trở nên đẳng cấp hơn.</li>
              <li><strong>Công Năng Thực Tế:</strong> Sản phẩm không chỉ đẹp mà còn phục vụ tiện nghi tối đa cho sinh hoạt hàng ngày.</li>
              <li><strong>Chất Lượng Thật:</strong> Sử dụng vật liệu an toàn cho sức khỏe, thân thiện với môi trường và độ bền dài lâu.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">5. Cam Kết Chất Lượng & Dịch Vụ</h2>
            <p className="policy-paragraph">
              Mini Shop Decor luôn đặt trải nghiệm và sự hài lòng của khách hàng làm kim chỉ nam vận hành:
            </p>
            <ul className="policy-list">
              <li>100% sản phẩm được đóng gói kỹ lưỡng, quy chuẩn chống va đập an toàn trước khi vận chuyển.</li>
              <li>Tư vấn tận tâm, chu đáo, hỗ trợ giải đáp mọi thắc mắc của khách hàng trước và sau khi mua hàng.</li>
              <li>Chính sách bảo hành và hỗ trợ đổi trả rõ ràng, nhanh chóng nhằm bảo vệ quyền lợi tối đa cho người tiêu dùng.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="policy-heading">6. Định Hướng Phát Triển Tương Lai</h2>
            <p className="policy-paragraph">
              Trong thời gian tới, Mini Shop Decor tiếp tục mở rộng bộ sưu tập sản phẩm decor độc quyền, đồng thời đẩy mạnh trải nghiệm mua sắm trực tuyến thời gian thực hiện đại, nhanh chóng. Chúng tôi hướng tới mục tiêu trở thành một trong những điểm đến trang trí nhà cửa uy tín hàng đầu được hàng triệu gia đình Việt yêu thích.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
