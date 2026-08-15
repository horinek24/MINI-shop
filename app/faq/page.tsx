'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FaqItem {
  id: number;
  question: string;
  answer: React.ReactNode;
}

export default function FaqPage() {
  const [openId, setOpenId] = useState<number | null>(1);

  const faqs: FaqItem[] = [
    {
      id: 1,
      question: 'Làm thế nào để đặt hàng trên website Mini Shop Decor?',
      answer: (
        <span>
          Quý khách chỉ cần duyệt qua các danh mục sản phẩm hoặc sử dụng ô Tìm kiếm, bấm chọn sản phẩm ưng ý, chọn số lượng và nhấn <strong>"Thêm vào giỏ hàng"</strong>. Sau đó vào Giỏ hàng bấm <strong>"Tiến hành thanh toán"</strong>, điền thông tin người nhận và bấm <strong>"Đặt hàng ngay"</strong>.
        </span>
      ),
    },
    {
      id: 2,
      question: 'Tôi có thể hủy hoặc thay đổi đơn hàng sau khi đặt không?',
      answer: (
        <span>
          Có thể. Quý khách có thể liên hệ ngay với bộ phận chăm sóc khách hàng của shop qua số Hotline trước khi đơn hàng chuyển sang trạng thái <strong>"Đang vận chuyển"</strong> để hỗ trợ thay đổi địa chỉ hoặc hủy đơn hoàn toàn miễn phí.
        </span>
      ),
    },
    {
      id: 3,
      question: 'Sau bao lâu thì tôi nhận được hàng?',
      answer: (
        <span>
          Thời gian giao hàng trung bình từ <strong>1 - 2 ngày</strong> đối với khu vực nội thành Hà Nội & TP.HCM, và từ <strong>3 - 5 ngày</strong> đối với các tỉnh thành khác trên toàn quốc.
        </span>
      ),
    },
    {
      id: 4,
      question: 'Tôi có được kiểm tra hàng (Đồng kiểm) trước khi thanh toán không?',
      answer: (
        <span>
          Hoàn toàn ĐƯỢC. Mini Shop Decor luôn khuyến khích quý khách đồng kiểm mở thùng kiểm tra tình trạng sản phẩm trước khi thanh toán cho shipper để đảm bảo sản phẩm nguyên vẹn, đúng mẫu mã.
        </span>
      ),
    },
    {
      id: 5,
      question: 'Nếu nhận được sản phẩm bị nứt vỡ hoặc lỗi thì phải làm gì?',
      answer: (
        <span>
          Quý khách từ chối nhận hàng trực tiếp với shipper hoặc chụp lại hình ảnh/video gửi cho shop qua kênh tư vấn trực tuyến. Mini Shop Decor sẽ đổi mới sản phẩm cho quý khách trong thời gian nhanh nhất mà không phát sinh thêm bất kỳ chi phí nào.
        </span>
      ),
    },
    {
      id: 6,
      question: 'Làm thế nào để yêu cầu đổi/trả sản phẩm?',
      answer: (
        <span>
          Quý khách xem chi tiết tại trang <Link href="/return-policy" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Chính sách đổi trả</Link>. Thời hạn đổi trả trong vòng 07 ngày kể từ khi nhận hàng.
        </span>
      ),
    },
    {
      id: 7,
      question: 'Tôi có thể thay đổi số điện thoại hoặc địa chỉ nhận hàng sau khi đặt không?',
      answer: (
        <span>
          Nếu đơn hàng chưa bàn giao cho đơn vị vận chuyển, quý khách có thể gửi yêu cầu hỗ trợ sửa thông tin địa chỉ/sĐT trực tiếp qua hotline dịch vụ khách hàng.
        </span>
      ),
    },
    {
      id: 8,
      question: 'Làm thế nào để liên hệ trực tiếp với Mini Shop Decor?',
      answer: (
        <span>
          Quý khách có thể kết nối với chúng tôi qua các kênh Mạng xã hội chính thức ở chân trang (Facebook, TikTok, YouTube) hoặc nhắn tin qua ô chat chăm sóc khách hàng trực tuyến trên website.
        </span>
      ),
    },
  ];

  const toggleItem = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="policy-page-wrapper">
      <div className="breadcrumb-bar" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', padding: '0.85rem 0', marginBottom: '2.5rem' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--color-muted)' }}>
          <Link href="/" style={{ color: 'var(--color-muted)' }}>Trang chủ</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>Câu hỏi thường gặp</span>
        </div>
      </div>

      <div className="container">
        <div className="policy-card">
          <header className="policy-header">
            <h1 className="policy-title">Câu Hỏi Thường Gặp (FAQ)</h1>
            <p className="policy-subtitle">
              Giải đáp nhanh những thắc mắc phổ biến của khách hàng trong quá trình mua sắm tại Mini Shop Decor.
            </p>
          </header>

          <div className="faq-accordion-list" style={{ marginTop: '1.5rem' }}>
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div key={faq.id} className="faq-accordion-item">
                  <div
                    className="faq-accordion-header"
                    onClick={() => toggleItem(faq.id)}
                  >
                    <span>{faq.id}. {faq.question}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      width="20"
                      height="20"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease',
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>

                  {isOpen && (
                    <div className="faq-accordion-body">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
