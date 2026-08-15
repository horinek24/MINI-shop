'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, formatVND } from '@/data/products';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import { getProductsFromSupabase, getCategoriesFromSupabase, CategoryItem } from '@/utils/supabase/services';

interface OrderItem {
  id: string;
  rawId: string;
  customer: string;
  phone: string;
  date: string;
  total: number;
  payment: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
}

interface MessageItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  date: string;
}

const SAMPLE_IMAGES = [
  { label: 'Bình gốm trang trí', url: '/MiniShop_Assets/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp' },
  { label: 'Sofa phòng khách', url: '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/sofa-phong-khach.webp' },
  { label: 'Bộ bàn ăn gỗ', url: '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/bo-ban-an-go.webp' },
  { label: 'Đèn tre thủ công', url: '/MiniShop_Assets/assets/images/products/do-my-nghe/den-tre-thu-cong.webp' },
  { label: 'Giỏ mây đan', url: '/MiniShop_Assets/assets/images/products/do-thu-cong/gio-may-dan.webp' },
];

export default function AdminPage() {
  const router = useRouter();
  const { user, loading, isAdmin, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'messages'>('dashboard');
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([]);
  const [ordersList, setOrdersList] = useState<OrderItem[]>([]);
  const [messagesList, setMessagesList] = useState<MessageItem[]>([]);
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [messageFilter, setMessageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Protection Guard: Redirect non-admin users or unauthenticated visitors to /login
  useEffect(() => {
    if (!loading) {
      if (!user || !isAdmin) {
        router.push('/login');
      }
    }
  }, [user, loading, isAdmin, router]);

  // Form State for Product Add / Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('noithat');
  const [formPrice, setFormPrice] = useState<number>(100000);
  const [formImage, setFormImage] = useState<string>(
    '/MiniShop_Assets/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp'
  );
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [formDesc, setFormDesc] = useState<string>('');

  const loadAdminData = async () => {
    setIsDataLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        getProductsFromSupabase(),
        getCategoriesFromSupabase(),
      ]);
      setProductsList(prods);
      setCategoriesList(cats);

      // Load orders & messages from Supabase
      const supabase = createClient();

      const { data: dbOrders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbOrders) {
        const mappedOrders: OrderItem[] = dbOrders.map((o: any) => ({
          id: o.order_code || `MS-${o.id.slice(0, 6)}`,
          rawId: o.id,
          customer: o.customer_name || 'Khách hàng',
          phone: o.customer_phone || '---',
          date: o.created_at ? new Date(o.created_at).toLocaleString('vi-VN') : '---',
          total: o.total_amount || 0,
          payment: o.payment_method === 'cod' ? 'COD' : o.payment_method === 'bank' ? 'Chuyển khoản' : 'MoMo',
          status: o.status || 'pending',
        }));
        setOrdersList(mappedOrders);
      }

      const { data: dbMessages } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbMessages) {
        const mappedMessages: MessageItem[] = dbMessages.map((m: any) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          phone: m.phone,
          subject: m.subject,
          message: m.message,
          status: m.status || 'new',
          date: m.created_at ? new Date(m.created_at).toLocaleString('vi-VN') : '---',
        }));
        setMessagesList(mappedMessages);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      loadAdminData();
    }
  }, [user, isAdmin]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Dung lượng tệp ảnh quá lớn. Vui lòng chọn tệp nhỏ hơn 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setFormImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateMessageStatus = async (msgId: string, newStatus: string) => {
    const supabase = createClient();
    const { error } = await supabase.from('messages').update({ status: newStatus }).eq('id', msgId);

    if (error) {
      alert(`Lỗi khi cập nhật tin nhắn: ${error.message}`);
    } else {
      setMessagesList(
        messagesList.map((m) => (m.id === msgId ? { ...m, status: newStatus as any } : m))
      );
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (confirm('Bạn có chắc muốn xóa tin nhắn này khỏi Supabase?')) {
      try {
        const supabase = createClient();
        const { error } = await supabase.from('messages').delete().eq('id', msgId);

        if (error) {
          alert(`Lỗi khi xóa tin nhắn: ${error.message}`);
        } else {
          setMessagesList(messagesList.filter((m) => m.id !== msgId));
        }
      } catch (err) {
        console.error('Lỗi khi xóa tin nhắn:', err);
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormName('');
    setFormCategory(categoriesList[0]?.id || 'noithat');
    setFormPrice(100000);
    setFormImage('/MiniShop_Assets/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp');
    setFormStatus('active');
    setFormDesc('');
  };

  const handleEditProduct = (prod: Product) => {
    setActiveTab('products');
    setEditingId(prod.id);
    setFormName(prod.name);
    setFormCategory(prod.category || categoriesList[0]?.id || 'noithat');
    setFormPrice(prod.price);
    setFormImage(prod.image);
    setFormStatus(prod.status || 'active');
    setFormDesc(prod.desc || '');
  };

  const handleDeleteProduct = async (productId: string) => {
    const prod = productsList.find((p) => p.id === productId);
    if (prod && confirm(`Bạn có chắc muốn xóa vĩnh viễn sản phẩm "${prod.name}" khỏi Supabase?`)) {
      const supabase = createClient();
      const { error } = await supabase.from('products').delete().eq('id', productId);

      if (error) {
        alert(`Lỗi khi xóa sản phẩm: ${error.message}`);
      } else {
        alert(`Đã xóa sản phẩm "${prod.name}" thành công!`);
        await loadAdminData();
      }
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Vui lòng nhập tên sản phẩm.');
      return;
    }
    if (formPrice <= 0 || isNaN(formPrice)) {
      alert('Giá sản phẩm phải lớn hơn 0đ.');
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const selectedCatObj = categoriesList.find((c) => c.id === formCategory);
    const categoryName = selectedCatObj ? selectedCatObj.label : 'Khác';
    const finalImage = formImage.trim() || '/MiniShop_Assets/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp';

    if (editingId) {
      // Update in Supabase
      const { error } = await supabase
        .from('products')
        .update({
          name: formName.trim(),
          category_id: formCategory,
          category_name: categoryName,
          price: formPrice,
          image: finalImage,
          status: formStatus,
          desc: formDesc.trim(),
        })
        .eq('id', editingId);

      if (error) {
        alert(`Lỗi khi cập nhật sản phẩm: ${error.message}`);
      } else {
        alert('Đã cập nhật sản phẩm trên Supabase thành công!');
        resetForm();
        await loadAdminData();
      }
    } else {
      // Create new product
      const slugId =
        formName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;

      const { error } = await supabase.from('products').insert({
        id: slugId,
        name: formName.trim(),
        category_id: formCategory,
        category_name: categoryName,
        price: formPrice,
        image: finalImage,
        thumbnails: JSON.stringify([finalImage]),
        status: formStatus,
        desc: formDesc.trim() || 'Sản phẩm decor thủ công cao cấp.',
        stock: 'Còn hàng',
      });

      if (error) {
        alert(`Lỗi khi thêm sản phẩm mới: ${error.message}`);
      } else {
        alert('Đã thêm sản phẩm mới vào Supabase thành công!');
        resetForm();
        await loadAdminData();
      }
    }
    setSaving(false);
  };

  const handleUpdateOrderStatus = async (rawId: string, newStatus: string) => {
    if (!confirm(`Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng sang "${newStatus}"?`)) {
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', rawId);

    if (error) {
      alert(`Lỗi khi cập nhật trạng thái đơn hàng: ${error.message}`);
    } else {
      setOrdersList(
        ordersList.map((o) => (o.rawId === rawId ? { ...o, status: newStatus as any } : o))
      );
    }
  };

  const filteredOrders =
    orderFilter === 'all'
      ? ordersList
      : ordersList.filter((o) => o.status === orderFilter);

  if (loading || isDataLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '1rem', fontWeight: 600 }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid #10b981', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
          Đang kết nối kho Supabase và kiểm tra quyền Admin...
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const activeProductsCount = productsList.filter((p) => p.status !== 'inactive').length;
  const totalRevenue = ordersList.reduce((sum, o) => sum + o.total, 0);
  const newMessagesCount = messagesList.filter((m) => m.status === 'new').length;

  const getCategoryClass = (catId?: string) => {
    if (catId === 'noithat') return 'furniture';
    if (catId === 'domynghe') return 'decor';
    if (catId === 'den') return 'lighting';
    if (catId === 'dothucong') return 'storage';
    return 'kitchen';
  };

  return (
    <div className="admin-shell">
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="admin-sidebar">
        <div>
          {/* Brand Header */}
          <div className="admin-brand-header">
            <div className="brand-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <div className="brand-info">
              <span className="brand-title">Mini Shop</span>
              <span className="brand-sub">Trang Quản Trị</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="admin-nav-list">
            <button
              className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Bảng điều khiển
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              Danh mục sản phẩm
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              Quản lý sản phẩm
              <span className="admin-nav-count">{productsList.length}</span>
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="M9 14l2 2 4-4" />
              </svg>
              Quản lý đơn hàng
              <span className="admin-nav-count">{ordersList.length}</span>
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Tin nhắn hỗ trợ
              {newMessagesCount > 0 && <span className="admin-nav-count" style={{ backgroundColor: '#ef4444', color: '#ffffff' }}>{newMessagesCount} mới</span>}
            </button>

            <button className="admin-nav-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Khách hàng
            </button>

            <button className="admin-nav-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Cài đặt hệ thống
            </button>
          </nav>
        </div>

        <div>
          {/* Quick Summary Widget */}
          <div className="sidebar-summary-card">
            <div className="summary-card-title">Tóm tắt nhanh</div>
            <div className="summary-row">
              <span>Sản phẩm</span>
              <strong>{productsList.length}</strong>
            </div>
            <div className="summary-row">
              <span>Danh mục</span>
              <strong>{categoriesList.length}</strong>
            </div>
            <div className="summary-row">
              <span>Đơn hàng</span>
              <strong>{ordersList.length}</strong>
            </div>
            <div className="summary-row">
              <span>Khách hàng</span>
              <strong>84</strong>
            </div>
          </div>

          {/* Logout Button */}
          <button
            className="admin-nav-item"
            style={{ color: '#dc2626' }}
            onClick={async () => {
              await logout();
              router.push('/');
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <div className="admin-workspace">
        {/* Top Bar */}
        <header className="admin-top-bar">
          <div className="admin-bar-left">
            <button className="toggle-menu-btn" title="Đóng/Mở menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className="admin-page-heading">
              {activeTab === 'dashboard' && 'Bảng điều khiển tổng quan'}
              {activeTab === 'products' && 'Quản lý sản phẩm'}
              {activeTab === 'orders' && 'Quản lý đơn hàng'}
              {activeTab === 'messages' && 'Tin nhắn & Hỗ trợ khách hàng'}
            </h1>
          </div>

          <div className="admin-bar-right">
            {/* Search Box */}
            <div className="admin-search-wrapper">
              <svg className="admin-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="admin-search-input"
                placeholder="Tìm kiếm... Ctrl + K"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Notification Bell */}
            <button className="notification-btn" title="Thông báo mới">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="notification-badge">5</span>
            </button>

            {/* Admin Profile Pill */}
            <div className="admin-profile-pill">
              <div className="admin-avatar">A</div>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Quản trị viên</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{ color: '#64748b' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="admin-body-content">
          {/* TAB 1: DASHBOARD VIEW (MATCHING mini-shop-admin-dashboard-reference-v2.webp) */}
          {activeTab === 'dashboard' && (
            <div>
              {/* 4 Stat Metric Cards */}
              <div className="admin-metrics-grid">
                <div className="metric-card-v2">
                  <div className="metric-info">
                    <span className="metric-label">Tổng sản phẩm</span>
                    <h2 className="metric-value">{productsList.length}</h2>
                    <span className="metric-sub">Tất cả sản phẩm trong kho</span>
                  </div>
                  <div className="metric-icon-box green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                  </div>
                </div>

                <div className="metric-card-v2">
                  <div className="metric-info">
                    <span className="metric-label">Danh mục</span>
                    <h2 className="metric-value">{categoriesList.length}</h2>
                    <span className="metric-sub">Danh mục sản phẩm</span>
                  </div>
                  <div className="metric-icon-box blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                </div>

                <div className="metric-card-v2">
                  <div className="metric-info">
                    <span className="metric-label">Sản phẩm đang hiển thị</span>
                    <h2 className="metric-value">{activeProductsCount}</h2>
                    <span className="metric-sub">Đang mở bán</span>
                  </div>
                  <div className="metric-icon-box eye">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                </div>

                <div className="metric-card-v2">
                  <div className="metric-info">
                    <span className="metric-label">Sản phẩm sắp hết</span>
                    <h2 className="metric-value">14</h2>
                    <span className="metric-sub">Cần nhập thêm hàng</span>
                  </div>
                  <div className="metric-icon-box orange">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Middle Row: Sales Overview & Recent Products */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {/* Sales Overview Chart */}
                <div className="admin-card-v2">
                  <div className="admin-card-header-v2">
                    <h3 className="admin-card-title-v2">Tổng quan doanh thu</h3>
                    <select className="admin-select-sm" defaultValue="7days">
                      <option value="7days">7 ngày qua</option>
                      <option value="30days">30 ngày qua</option>
                    </select>
                  </div>

                  {/* SVG Chart Visualization */}
                  <div style={{ position: 'relative', height: '180px', width: '100%', marginBottom: '1.25rem' }}>
                    <svg viewBox="0 0 500 150" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d="M 0 90 Q 75 40 150 70 T 300 50 T 450 20 L 450 140 L 0 140 Z" fill="url(#salesGrad)" />
                      <path d="M 0 90 Q 75 40 150 70 T 300 50 T 450 20" fill="none" stroke="#10b981" strokeWidth="3" />
                      <circle cx="260" cy="50" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    </svg>

                    {/* Tooltip Overlay */}
                    <div style={{ position: 'absolute', top: '15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.35rem 0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                      7,540,000 đ
                    </div>
                  </div>

                  {/* Sub stats row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Tổng doanh thu</span>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>{formatVND(totalRevenue)}</div>
                      <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>↑ 18.6%</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Đơn hàng</span>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>{ordersList.length}</div>
                      <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>↑ 12.4%</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Giá trị TB/Đơn</span>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>332,656 đ</div>
                      <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>↑ 5.7%</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Tỷ lệ chuyển đổi</span>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>2.35%</div>
                      <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>↑ 8.1%</span>
                    </div>
                  </div>
                </div>

                {/* Recent Products Card */}
                <div className="admin-card-v2">
                  <div className="admin-card-header-v2">
                    <h3 className="admin-card-title-v2">Sản phẩm mới cập nhật</h3>
                    <button
                      className="btn btn-green btn-sm"
                      onClick={() => {
                        setActiveTab('products');
                        resetForm();
                      }}
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                    >
                      + Thêm sản phẩm
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Sản phẩm</th>
                          <th>Danh mục</th>
                          <th>Giá bán</th>
                          <th>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productsList.slice(0, 5).map((p) => (
                          <tr key={p.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <img src={p.image} alt={p.name} className="table-thumb" />
                                <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a' }}>{p.name}</span>
                              </div>
                            </td>
                            <td>
                              <span className={`cat-pill ${getCategoryClass(p.category)}`}>
                                {p.categoryName}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700, fontSize: '0.85rem' }}>{formatVND(p.price)}</td>
                            <td>
                              <span className="status-badge-v2 active">
                                • Đang hiển thị
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Donut Chart, Top Categories, Stock Alert */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
                {/* Orders Overview */}
                <div className="admin-card-v2">
                  <div className="admin-card-header-v2">
                    <h3 className="admin-card-title-v2">Phân bổ đơn hàng</h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '16px solid #10b981', borderTopColor: '#3b82f6', borderRightColor: '#f59e0b', flexShrink: 0 }}></div>
                    <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <div><span style={{ color: '#10b981' }}>●</span> Hoàn thành (35.2%)</div>
                      <div><span style={{ color: '#3b82f6' }}>●</span> Đang xử lý (29.7%)</div>
                      <div><span style={{ color: '#f59e0b' }}>●</span> Đang giao hàng (17.2%)</div>
                      <div><span style={{ color: '#ef4444' }}>●</span> Đã hủy (7.8%)</div>
                    </div>
                  </div>
                </div>

                {/* Top Categories */}
                <div className="admin-card-v2">
                  <div className="admin-card-header-v2">
                    <h3 className="admin-card-title-v2">Top danh mục bán chạy</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span>Nội thất phòng khách</span><strong>18,450,000 đ</strong>
                      </div>
                      <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: '80%', height: '100%', backgroundColor: '#10b981', borderRadius: '3px' }}></div></div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span>Đồ mỹ nghệ decor</span><strong>9,200,000 đ</strong>
                      </div>
                      <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: '45%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '3px' }}></div></div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span>Đèn trang trí</span><strong>6,780,000 đ</strong>
                      </div>
                      <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: '35%', height: '100%', backgroundColor: '#f59e0b', borderRadius: '3px' }}></div></div>
                    </div>
                  </div>
                </div>

                {/* Stock Alert */}
                <div className="admin-card-v2">
                  <div className="admin-card-header-v2">
                    <h3 className="admin-card-title-v2">Cảnh báo tồn kho</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {productsList.slice(0, 3).map((p) => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img src={p.image} alt={p.name} className="table-thumb" style={{ width: '32px', height: '32px' }} />
                          <span style={{ fontWeight: 600 }}>{p.name}</span>
                        </div>
                        <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.8rem' }}>Còn lại 9 món</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT (MATCHING mini-shop-admin-management-reference-v2.webp) */}
          {activeTab === 'products' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
              {/* Left Column: Products Table & Categories Table */}
              <div>
                {/* Products Table Card */}
                <div className="admin-card-v2">
                  <div className="admin-card-header-v2">
                    <h3 className="admin-card-title-v2">Danh sách sản phẩm</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-outline-gray btn-sm">Bộ lọc</button>
                      <button className="btn btn-green btn-sm" onClick={resetForm}>+ Thêm sản phẩm</button>
                    </div>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Hình ảnh</th>
                          <th>Tên sản phẩm</th>
                          <th>Danh mục</th>
                          <th>Giá bán</th>
                          <th>Trạng thái</th>
                          <th style={{ textAlign: 'right' }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productsList.map((prod, idx) => (
                          <tr key={prod.id}>
                            <td>{idx + 1}</td>
                            <td>
                              <img src={prod.image} alt={prod.name} className="table-thumb" />
                            </td>
                            <td style={{ fontWeight: 700, color: '#0f172a' }}>{prod.name}</td>
                            <td>
                              <span className={`cat-pill ${getCategoryClass(prod.category)}`}>
                                {prod.categoryName}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700 }}>{formatVND(prod.price)}</td>
                            <td>
                              <span className={`status-badge-v2 ${prod.status === 'inactive' ? 'inactive' : 'active'}`}>
                                • {prod.status === 'inactive' ? 'Tạm ẩn' : 'Đang bán'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                                <button className="btn-action-edit" onClick={() => handleEditProduct(prod)}>
                                  Sửa
                                </button>
                                <button className="btn-action-delete" onClick={() => handleDeleteProduct(prod.id)}>
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', fontSize: '0.85rem', color: '#64748b' }}>
                    <span>Hiển thị 1 đến {productsList.length} trong {productsList.length} sản phẩm</span>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button className="btn btn-outline-gray btn-sm" disabled>&lt;</button>
                      <button className="btn btn-green btn-sm">1</button>
                      <button className="btn btn-outline-gray btn-sm">&gt;</button>
                    </div>
                  </div>
                </div>

                {/* Categories Table Card */}
                <div className="admin-card-v2">
                  <div className="admin-card-header-v2">
                    <h3 className="admin-card-title-v2">Danh mục sản phẩm</h3>
                    <button className="btn btn-primary btn-sm">+ Thêm danh mục</button>
                  </div>

                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Tên danh mục</th>
                        <th>Số sản phẩm</th>
                        <th>Trạng thái</th>
                        <th style={{ textAlign: 'right' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoriesList.map((cat, idx) => {
                        const count = productsList.filter((p) => p.category === cat.id).length;
                        return (
                          <tr key={cat.id}>
                            <td>{idx + 1}</td>
                            <td style={{ fontWeight: 700, color: '#0f172a' }}>{cat.label}</td>
                            <td>{count} sản phẩm</td>
                            <td><span className="status-badge-v2 active">• Đang bán</span></td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                                <button className="btn-action-edit">Sửa</button>
                                <button className="btn-action-delete">Xóa</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Product Form Card (MATCHING mini-shop-admin-management-reference-v2.webp) */}
              <div className="admin-card-v2" style={{ position: 'sticky', top: '80px' }}>
                <h3 className="admin-card-title-v2" style={{ marginBottom: '1.25rem' }}>
                  {editingId ? 'Chỉnh sửa sản phẩm' : 'Biểu mẫu sản phẩm'}
                </h3>

                <form onSubmit={handleSaveProduct}>
                  <div className="form-group">
                    <label className="form-label">Tên sản phẩm *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Nhập tên sản phẩm..."
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Danh mục sản phẩm</label>
                    <select
                      className="form-input form-select"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Giá bán (VNĐ) *</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Nhập giá bán..."
                      value={formPrice}
                      onChange={(e) => setFormPrice(parseInt(e.target.value, 10) || 0)}
                      required
                    />
                  </div>

                  {/* Upload Dropzone Box */}
                  <div className="form-group">
                    <label className="form-label">Hình ảnh sản phẩm</label>
                    <div
                      className="upload-dropzone-box"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32" style={{ margin: '0 auto', color: '#94a3b8' }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <div className="dropzone-text">Bấm để tải ảnh lên</div>
                      <div className="dropzone-sub">Định dạng PNG, JPG, WEBP dưới 5MB</div>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />

                    {/* Image Preview */}
                    {formImage && (
                      <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                        <img src={formImage} alt="Xem trước" className="admin-preview-img" />
                      </div>
                    )}
                  </div>

                  {/* Preset Image Selector */}
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Hoặc chọn ảnh mẫu nhanh:</label>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {SAMPLE_IMAGES.map((imgItem, index) => (
                        <button
                          key={index}
                          type="button"
                          className="btn btn-outline-gray btn-sm"
                          onClick={() => setFormImage(imgItem.url)}
                          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                        >
                          {imgItem.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Trạng thái mở bán</label>
                    <select
                      className="form-input form-select"
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                    >
                      <option value="active">Hiển thị (Đang bán)</option>
                      <option value="inactive">Tạm ẩn</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mô tả sản phẩm</label>
                    <textarea
                      className="form-input form-textarea"
                      rows={3}
                      placeholder="Nhập mô tả sản phẩm..."
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <button
                      type="submit"
                      className="btn btn-green btn-full"
                      disabled={saving}
                      style={{ fontWeight: 700, padding: '0.75rem' }}
                    >
                      {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Lưu sản phẩm'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-gray btn-full"
                      onClick={resetForm}
                      style={{ fontWeight: 600, padding: '0.75rem' }}
                    >
                      Hủy bỏ
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="admin-card-v2">
              <div className="admin-card-header-v2">
                <h3 className="admin-card-title-v2">Quản lý đơn hàng</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['all', 'pending', 'processing', 'completed', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      className={`btn btn-sm ${orderFilter === st ? 'btn-green' : 'btn-outline-gray'}`}
                      onClick={() => setOrderFilter(st)}
                    >
                      {st === 'all' ? 'Tất cả' : st === 'pending' ? 'Chờ duyệt' : st === 'processing' ? 'Đang xử lý' : st === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Khách hàng</th>
                      <th>SĐT</th>
                      <th>Ngày đặt</th>
                      <th>Tổng tiền</th>
                      <th>Thanh toán</th>
                      <th>Trạng thái</th>
                      <th style={{ textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => (
                      <tr key={o.rawId}>
                        <td style={{ fontWeight: 800, color: '#0f172a' }}>{o.id}</td>
                        <td>{o.customer}</td>
                        <td>{o.phone}</td>
                        <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{o.date}</td>
                        <td style={{ fontWeight: 800, color: '#10b981' }}>{formatVND(o.total)}</td>
                        <td>{o.payment}</td>
                        <td>
                          <span className={`status-badge-v2 ${o.status}`}>
                            • {o.status === 'completed' ? 'Hoàn thành' : o.status === 'processing' ? 'Đang xử lý' : o.status === 'cancelled' ? 'Đã hủy' : 'Chờ duyệt'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <select
                            className="admin-select-sm"
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.rawId, e.target.value)}
                          >
                            <option value="pending">Chờ duyệt</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="cancelled">Đã hủy</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: MESSAGES & CUSTOMER SUPPORT */}
          {activeTab === 'messages' && (
            <div className="admin-card-v2">
              <div className="admin-card-header-v2">
                <h3 className="admin-card-title-v2">Tin nhắn & Hỗ trợ khách hàng</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['all', 'new', 'read', 'replied'].map((st) => (
                    <button
                      key={st}
                      className={`btn btn-sm ${messageFilter === st ? 'btn-green' : 'btn-outline-gray'}`}
                      onClick={() => setMessageFilter(st)}
                    >
                      {st === 'all' ? 'Tất cả' : st === 'new' ? 'Tin mới' : st === 'read' ? 'Đã đọc' : 'Đã phản hồi'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Khách hàng</th>
                      <th>Email / SĐT</th>
                      <th>Chủ đề</th>
                      <th>Nội dung</th>
                      <th>Ngày gửi</th>
                      <th>Trạng thái</th>
                      <th style={{ textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(messageFilter === 'all' ? messagesList : messagesList.filter(m => m.status === messageFilter)).map((msg) => (
                      <tr key={msg.id}>
                        <td style={{ fontWeight: 700, color: '#0f172a' }}>{msg.name}</td>
                        <td style={{ fontSize: '0.82rem' }}>
                          <div>{msg.email}</div>
                          <div style={{ color: '#64748b' }}>{msg.phone}</div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{msg.subject}</td>
                        <td style={{ maxWidth: '240px', fontSize: '0.85rem', color: '#475569' }}>{msg.message}</td>
                        <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{msg.date}</td>
                        <td>
                          <span className={`status-badge-v2 ${msg.status === 'new' ? 'pending' : 'active'}`}>
                            • {msg.status === 'new' ? 'Mới' : msg.status === 'read' ? 'Đã đọc' : 'Đã phản hồi'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <a
                              href={`mailto:${msg.email}?subject=Re: [Mini Shop Decor] ${encodeURIComponent(msg.subject)}`}
                              className="btn-action-edit"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Email
                            </a>
                            <select
                              className="admin-select-sm"
                              value={msg.status}
                              onChange={(e) => handleUpdateMessageStatus(msg.id, e.target.value)}
                            >
                              <option value="new">Mới</option>
                              <option value="read">Đã đọc</option>
                              <option value="replied">Đã phản hồi</option>
                            </select>
                            <button
                              className="btn-action-delete"
                              onClick={() => handleDeleteMessage(msg.id)}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
