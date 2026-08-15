import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hướng Dẫn Mua Hàng - Mini Shop Decor',
  description: 'Hướng dẫn từng bước mua sắm trực tuyến nhanh chóng, dễ dàng tại Mini Shop Decor.',
};

export default function PurchasingGuidePage() {
  const steps = [
    {
      num: '01',
      title: 'Tìm Kiếm & Lựa Chọn Sản Phẩm',
      desc: 'Sử dụng thanh tìm kiếm ở đầu trang hoặc duyệt qua danh mục sản phẩm (Nội thất, Đèn decor, Đồ thủ công, Đồ mỹ nghệ,...) để tìm món đồ phù hợp với không gian sống của bạn.',
    },
    {
      num: '02',
      title: 'Xem Chi Tiết Thông Tin Sản Phẩm',
      desc: 'Bấm trực tiếp vào sản phẩm để xem kích thước, chất liệu, giá bán niêm yết, tình trạng kho hàng và các hình ảnh góc quay chi tiết.',
    },
    {
      num: '03',
      title: 'Thêm Sản Phẩm Vào Giỏ Hàng',
      desc: 'Tùy chỉnh số lượng mong muốn và bấm nút "Thêm vào giỏ hàng" hoặc biểu tượng Trái Tim để lưu lại danh sách yêu thích.',
    },
    {
      num: '04',
      title: 'Kiểm Tra Giỏ Hàng',
      desc: 'Bấm biểu tượng Giỏ hàng ở góc phải màn hình để rà soát lại danh sách sản phẩm, số lượng và tổng tiền trước khi tiến hành thanh toán.',
    },
    {
      num: '05',
      title: 'Nhập Thông Tin Nhận Hàng',
      desc: 'Điền đầy đủ Họ và tên người nhận, Số điện thoại và Địa chỉ giao hàng chính xác để đơn hàng được vận chuyển suôn sẻ.',
    },
    {
      num: '06',
      title: 'Chọn Phương Thức Thanh Toán',
      desc: 'Lựa chọn hình thức thanh toán thuận tiện nhất cho bạn: Thanh toán khi nhận hàng (COD), Chuyển khoản ngân hàng hoặc qua Ví điện tử.',
    },
    {
      num: '07',
      title: 'Xác Nhận Đặt Hàng',
      desc: 'Rà soát lại toàn bộ đơn hàng và bấm "Đặt hàng ngay". Hệ thống sẽ tạo Mã đơn hàng duy nhất và ghi nhận trực tiếp trên kho dữ liệu.',
    },
    {
      num: '08',
      title: 'Theo Dõi Đơn Hàng & Nhận Hàng',
      desc: 'Đội ngũ chăm sóc khách hàng sẽ liên hệ xác nhận và tiến hành đóng gói tiêu chuẩn chống va đập để giao tới tay bạn nhanh nhất.',
    },
  ];

  return (
    <div className="policy-page-wrapper">
      <div className="breadcrumb-bar" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', padding: '0.85rem 0', marginBottom: '2.5rem' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--color-muted)' }}>
          <Link href="/" style={{ color: 'var(--color-muted)' }}>Trang chủ</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>Hướng dẫn mua hàng</span>
        </div>
      </div>

      <div className="container">
        <div className="policy-card">
          <header className="policy-header">
            <h1 className="policy-title">Hướng Dẫn Mua Hàng Trực Tuyến</h1>
            <p className="policy-subtitle">
              Chỉ với 8 bước đơn giản để sở hữu những món đồ trang trí tinh tế cho không gian nhà bạn.
            </p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            {steps.map((step) => (
              <div
                key={step.num}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg, 12px)',
                  padding: '1.5rem',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    backgroundColor: 'var(--color-primary-light, #ecfdf5)',
                    color: 'var(--color-primary, #10b981)',
                    borderRadius: '50%',
                    fontWeight: 800,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  {step.num}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.5rem' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#4b5563', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
