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
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

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
      if (cats.length > 0 && !formCategory) {
        setFormCategory(cats[0].id);
      }

      // Load real orders from Supabase
      const supabase = createClient();
      const { data: dbOrders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbOrders) {
        const mappedOrders: OrderItem[] = dbOrders.map((o: any) => ({
          id: o.order_code || (o.id ? o.id.slice(0, 8).toUpperCase() : 'MS000'),
          rawId: o.id,
          customer: o.customer_name || 'Khách hàng',
          phone: o.customer_phone || '---',
          date: o.created_at ? new Date(o.created_at).toLocaleString('vi-VN') : 'Vừa xong',
          total: Number(o.total_amount || 0),
          payment: o.payment_method === 'cod' ? 'Thanh toán COD' : o.payment_method === 'bank' ? 'Chuyển khoản' : 'Ví MoMo',
          status: o.status || 'pending',
        }));
        setOrdersList(mappedOrders);
      }
      // Load real messages from Supabase
      const { data: dbMessages } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbMessages) {
        const mappedMessages: MessageItem[] = dbMessages.map((m: any) => ({
          id: m.id,
          name: m.name || 'Khách hàng',
          email: m.email || '---',
          phone: m.phone || '---',
          subject: m.subject || 'Tư vấn sản phẩm',
          message: m.message || '',
          status: m.status || 'new',
          date: m.created_at ? new Date(m.created_at).toLocaleString('vi-VN') : 'Vừa xong',
        }));
        setMessagesList(mappedMessages);
      }
    } catch (err) {
      console.error('Failed to load admin data from Supabase:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      loadAdminData();
    }
  }, [user, isAdmin]);

  const handleUpdateMessageStatus = async (msgId: string, newStatus: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('messages').update({ status: newStatus }).eq('id', msgId);
      if (error) {
        alert(`Lỗi khi cập nhật trạng thái tin nhắn: ${error.message}`);
      } else {
        setMessagesList(
          messagesList.map((m) => (m.id === msgId ? { ...m, status: newStatus as any } : m))
        );
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật tin nhắn:', err);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa tin nhắn này khỏi hệ thống?')) {
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

    // Find category label
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
      // Generate ID slug
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
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h3>Đang kiểm tra quyền và tải dữ liệu từ Supabase...</h3>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="admin-layout">
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="admin-sidebar" id="admin-sidebar">
        <div className="admin-brand">
          <Link href="/" title="Trở về Trang chủ Mini Shop">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
              <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h6v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z" />
            </svg>
            <div className="brand-text-wrap">
              <span className="brand-name">Mini Shop</span>
              <span className="brand-sub">Admin Panel</span>
            </div>
          </Link>
        </div>

        <nav className="admin-nav-menu">
          <button
            className={`admin-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Overview
          </button>
          <button
            className={`admin-nav-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products ({productsList.length})
          </button>
          <button
            className={`admin-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            Orders ({ordersList.length})
          </button>

          <button
            className={`admin-nav-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Messages ({messagesList.filter(m => m.status === 'new').length > 0 ? `${messagesList.length} (${messagesList.filter(m => m.status === 'new').length} mới)` : messagesList.length})
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <button
            className="admin-logout-btn"
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
            Log out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT REGION */}
      <main className="admin-main">
        <header className="admin-header-bar">
          <div className="admin-header-title">
            <h2>
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'products' && 'Product Management'}
              {activeTab === 'orders' && 'Order Management'}
              {activeTab === 'messages' && 'Messages & Customer Support'}
            </h2>
            <p>Quản lý sản phẩm, đơn hàng và kho dữ liệu Supabase thời gian thực.</p>
          </div>

          <div className="admin-header-user">
            <span className="user-badge-admin">Admin: {user.name}</span>
            <Link href="/" className="btn btn-outline-gray btn-sm">
              Xem trang bán hàng
            </Link>
          </div>
        </header>

        <div className="admin-content-inner">
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <section className="admin-tab-view active">
              {/* Stat Metric Cards */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="stat-icon bg-green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Tổng doanh thu</span>
                    <h3 className="stat-val">
                      {formatVND(ordersList.reduce((sum, o) => sum + o.total, 0))}
                    </h3>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-icon bg-blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Tổng sản phẩm trong kho</span>
                    <h3 className="stat-val">{productsList.length} món</h3>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-icon bg-purple">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Tổng đơn hàng</span>
                    <h3 className="stat-val">{ordersList.length} đơn</h3>
                  </div>
                </div>
              </div>

              {/* Quick Products Overview */}
              <div className="admin-grid-2col" style={{ marginTop: '2rem' }}>
                <div className="admin-card">
                  <div className="card-header-row">
                    <h3 className="card-title">Sản phẩm mới nhất</h3>
                    <button
                      className="btn btn-blue btn-sm"
                      onClick={() => {
                        setActiveTab('products');
                        resetForm();
                      }}
                    >
                      + Add product
                    </button>
                  </div>
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th style={{ width: '60px' }}>Hình ảnh</th>
                          <th>Sản phẩm</th>
                          <th>Giá bán</th>
                          <th>Trạng thái</th>
                          <th style={{ textAlign: 'right' }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productsList.slice(0, 5).map((p) => (
                          <tr key={p.id}>
                            <td>
                              <img
                                src={p.image}
                                alt={p.name}
                                className="table-thumb"
                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                                onError={(e) => {
                                  (e.target as HTMLElement).setAttribute(
                                    'src',
                                    '/MiniShop_Assets/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp'
                                  );
                                }}
                              />
                            </td>
                            <td>
                              <strong>{p.name}</strong>
                            </td>
                            <td>{formatVND(p.price)}</td>
                            <td>
                              <span className={`badge-status ${p.status === 'inactive' ? 'inactive' : 'active'}`}>
                                • {p.status === 'inactive' ? 'Inactive' : 'Active'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                className="btn-icon-more"
                                onClick={() => handleEditProduct(p)}
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <section className="admin-tab-view active">
              <div className="management-grid">
                <div className="management-main-col">
                  <div className="admin-card">
                    <div className="card-header-row">
                      <h3 className="card-title">Products ({productsList.length})</h3>
                      <button className="btn btn-blue btn-sm" onClick={resetForm}>
                        + Add Product
                      </button>
                    </div>

                    <div className="table-responsive">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productsList.map((p, idx) => (
                            <tr key={p.id}>
                              <td>{idx + 1}</td>
                              <td>
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="table-thumb"
                                  onError={(e) => {
                                    (e.target as HTMLElement).setAttribute(
                                      'src',
                                      '/MiniShop_Assets/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp'
                                    );
                                  }}
                                />
                              </td>
                              <td>
                                <strong>{p.name}</strong>
                              </td>
                              <td>
                                <span className="badge-category">
                                  {p.categoryName || 'Đồ thủ công'}
                                </span>
                              </td>
                              <td>
                                <strong>{formatVND(p.price)}</strong>
                              </td>
                              <td>
                                <span className={`badge-status ${p.status === 'inactive' ? 'inactive' : 'active'}`}>
                                  • {p.status === 'inactive' ? 'Inactive' : 'Active'}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div className="action-btn-group">
                                  <button
                                    className="btn-action-edit"
                                    onClick={() => handleEditProduct(p)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn-action-delete"
                                    onClick={() => handleDeleteProduct(p.id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Form Add / Edit */}
                <aside className="management-form-col">
                  <div className="admin-card sticky-card">
                    <h3 className="card-title" style={{ marginBottom: '1.25rem' }}>
                      {editingId ? 'Edit Product' : 'Add Product'}
                    </h3>

                    <form onSubmit={handleSaveProduct}>
                      <div className="form-group">
                        <label className="form-label">Tên sản phẩm *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Ví dụ: Đèn thả trần Bát Tràng"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Danh mục *</label>
                        <select
                          className="form-input form-select"
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                        >
                          {categoriesList.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Giá bán (VNĐ) *</label>
                        <input
                          type="number"
                          className="form-input"
                          placeholder="500000"
                          value={formPrice}
                          onChange={(e) => setFormPrice(parseInt(e.target.value, 10) || 0)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                          Hình ảnh sản phẩm *
                        </label>
                        
                        {/* Hidden File Input */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          hidden
                          accept="image/*"
                          onChange={handleFileUpload}
                        />

                        {/* File Upload Button */}
                        <button
                          type="button"
                          className="btn btn-blue btn-full"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '0.65rem 1rem',
                            fontSize: '0.88rem',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '0.75rem',
                            cursor: 'pointer'
                          }}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                          📷 Bấm vào đây để chọn ảnh từ máy tính
                        </button>

                        {/* Visual Image Gallery / Quick Picker */}
                        <div style={{ marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', display: 'block', marginBottom: '0.4rem' }}>
                            Hoặc bấm chọn nhanh hình ảnh mẫu có sẵn:
                          </span>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
                            {SAMPLE_IMAGES.map((sample) => {
                              const isSelected = formImage === sample.url;
                              return (
                                <div
                                  key={sample.url}
                                  title={sample.label}
                                  onClick={() => setFormImage(sample.url)}
                                  style={{
                                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                    borderRadius: '6px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    padding: '2px',
                                    backgroundColor: isSelected ? '#ecfdf5' : '#fff',
                                    transition: 'all 0.2s ease',
                                  }}
                                >
                                  <img
                                    src={sample.url}
                                    alt={sample.label}
                                    style={{
                                      width: '100%',
                                      height: '42px',
                                      objectFit: 'cover',
                                      borderRadius: '4px',
                                      display: 'block',
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Toggle URL input */}
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                            Hoặc dán/nhập link URL ảnh trực tiếp:
                          </span>
                          <input
                            type="text"
                            className="form-input"
                            style={{ marginTop: '0.2rem', fontSize: '0.8rem' }}
                            placeholder="https://... hoặc /MiniShop_Assets/..."
                            value={formImage}
                            onChange={(e) => setFormImage(e.target.value)}
                          />
                        </div>

                        {/* Live Image Preview */}
                        {formImage && (
                          <div style={{ marginTop: '0.75rem', textAlign: 'center', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', textAlign: 'left', marginBottom: '0.4rem', color: 'var(--color-dark)' }}>
                              ✓ Hình ảnh đang chọn:
                            </span>
                            <img
                              src={formImage}
                              alt="Preview"
                              className="admin-preview-img"
                              style={{
                                width: '140px',
                                height: '140px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border)',
                                margin: '0 auto',
                                display: 'block',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                              }}
                              onError={(e) => {
                                (e.target as HTMLElement).setAttribute(
                                  'src',
                                  '/MiniShop_Assets/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp'
                                );
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Trạng thái</label>
                        <select
                          className="form-input form-select"
                          value={formStatus}
                          onChange={(e) => setFormStatus(e.target.value as any)}
                        >
                          <option value="active">Active (Đang bán)</option>
                          <option value="inactive">Inactive (Ẩn)</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Mô tả sản phẩm</label>
                        <textarea
                          className="form-input form-textarea"
                          placeholder="Mô tả chi tiết chất liệu, xuất xứ, tính năng sản phẩm..."
                          value={formDesc}
                          onChange={(e) => setFormDesc(e.target.value)}
                        />
                      </div>

                      <div className="form-buttons-row">
                        <button
                          type="submit"
                          className="btn btn-green btn-full"
                          disabled={saving}
                        >
                          {saving ? 'Đang lưu vào Supabase...' : editingId ? 'Cập nhật Supabase' : 'Thêm vào Supabase'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-gray btn-full"
                          onClick={resetForm}
                        >
                          Hủy / Đặt lại
                        </button>
                      </div>
                    </form>
                  </div>
                </aside>
              </div>
            </section>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <section className="admin-tab-view active">
              <div className="admin-card">
                <div className="card-header-row">
                  <h3 className="card-title">Order Management ({filteredOrders.length})</h3>
                  <select
                    className="admin-select-sm"
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Chờ xử lý (Pending)</option>
                    <option value="processing">Đang xử lý (Processing)</option>
                    <option value="completed">Hoàn thành (Completed)</option>
                    <option value="cancelled">Đã hủy (Cancelled)</option>
                  </select>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>Số điện thoại</th>
                        <th>Ngày đặt</th>
                        <th>Tổng tiền</th>
                        <th>Thanh toán</th>
                        <th>Trạng thái</th>
                        <th style={{ textAlign: 'right' }}>Cập nhật</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                            Chưa có đơn hàng nào trong hệ thống.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((o) => (
                          <tr key={o.rawId}>
                            <td>
                              <strong>#{o.id}</strong>
                            </td>
                            <td>{o.customer}</td>
                            <td>{o.phone}</td>
                            <td>{o.date}</td>
                            <td>
                              <strong>{formatVND(o.total)}</strong>
                            </td>
                            <td>{o.payment}</td>
                            <td>
                              <span className={`badge-status ${o.status === 'completed' ? 'active' : o.status === 'cancelled' ? 'inactive' : 'new'}`}>
                                • {o.status}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <select
                                className="admin-select-sm"
                                value={o.status}
                                onChange={(e) => handleUpdateOrderStatus(o.rawId, e.target.value)}
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 4: MESSAGES MANAGEMENT */}
          {activeTab === 'messages' && (
            <section className="admin-tab-view active">
              <div className="admin-card">
                <div className="card-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3>Tin Nhắn Tư Vấn & Hỗ Trợ Khách Hàng ({messagesList.length})</h3>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: 600 }}>Lọc trạng thái:</span>
                    <select
                      className="admin-select-sm"
                      value={messageFilter}
                      onChange={(e) => setMessageFilter(e.target.value)}
                    >
                      <option value="all">Tất cả ({messagesList.length})</option>
                      <option value="new">Tin mới chưa đọc ({messagesList.filter(m => m.status === 'new').length})</option>
                      <option value="read">Đã đọc ({messagesList.filter(m => m.status === 'read').length})</option>
                      <option value="replied">Đã phản hồi ({messagesList.filter(m => m.status === 'replied').length})</option>
                    </select>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Khách hàng</th>
                        <th>Email & Số điện thoại</th>
                        <th>Chủ đề tư vấn</th>
                        <th>Nội dung tin nhắn</th>
                        <th>Thời gian gửi</th>
                        <th>Trạng thái</th>
                        <th style={{ textAlign: 'right' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messagesList
                        .filter((m) => (messageFilter === 'all' ? true : m.status === messageFilter))
                        .length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                            Không tìm thấy tin nhắn hỗ trợ nào.
                          </td>
                        </tr>
                      ) : (
                        messagesList
                          .filter((m) => (messageFilter === 'all' ? true : m.status === messageFilter))
                          .map((msg) => (
                            <tr key={msg.id} style={{ backgroundColor: msg.status === 'new' ? '#fffdf5' : 'transparent' }}>
                              <td>
                                <strong>{msg.name}</strong>
                              </td>
                              <td>
                                <div style={{ fontSize: '0.88rem' }}>{msg.email}</div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--color-muted)' }}>{msg.phone}</div>
                              </td>
                              <td>
                                <span className="badge-cat">{msg.subject}</span>
                              </td>
                              <td style={{ maxWidth: '300px' }}>
                                <p style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-wrap' }}>
                                  {msg.message}
                                </p>
                              </td>
                              <td style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>{msg.date}</td>
                              <td>
                                <span className={`badge-status ${msg.status === 'replied' ? 'active' : msg.status === 'read' ? 'processing' : 'new'}`}>
                                  • {msg.status === 'new' ? 'Tin mới' : msg.status === 'read' ? 'Đã đọc' : 'Đã phản hồi'}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                  <a
                                    href={`mailto:${msg.email}?subject=Re: [Mini Shop Decor] ${encodeURIComponent(msg.subject)}`}
                                    className="btn btn-outline-gray btn-sm"
                                    title="Mở ứng dụng email để gửi thư phản hồi cho khách"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                                  >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                      <polyline points="22,6 12,13 2,6" />
                                    </svg>
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
                                    className="btn-icon danger"
                                    title="Xóa tin nhắn"
                                    onClick={() => handleDeleteMessage(msg.id)}
                                  >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                      <polyline points="3 6 5 6 21 6" />
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
