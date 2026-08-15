'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PRODUCTS_DATA, Product, formatVND } from '@/data/products';
import { useAuth } from '@/context/AuthContext';

interface OrderItem {
  id: string;
  customer: string;
  phone: string;
  date: string;
  total: number;
  payment: string;
  status: 'new' | 'processing' | 'completed' | 'cancelled';
}

export default function AdminPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [ordersList, setOrdersList] = useState<OrderItem[]>([]);
  const [orderFilter, setOrderFilter] = useState<string>('all');

  // Form State for Product Add / Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('noi-that-gia-dung');
  const [formPrice, setFormPrice] = useState<number>(100000);
  const [formImage, setFormImage] = useState<string>(
    '/MiniShop_Assets/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp'
  );
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [formDesc, setFormDesc] = useState<string>('');

  useEffect(() => {
    setProductsList(JSON.parse(JSON.stringify(PRODUCTS_DATA)));
    setOrdersList([
      {
        id: 'MS948102',
        customer: 'Nguyễn Văn An',
        phone: '0912 345 678',
        date: '14/08/2026 15:30',
        total: 1680000,
        payment: 'COD',
        status: 'new',
      },
      {
        id: 'MS948101',
        customer: 'Trần Thị Mai',
        phone: '0988 123 456',
        date: '14/08/2026 11:20',
        total: 2990000,
        payment: 'Ví MoMo',
        status: 'processing',
      },
      {
        id: 'MS948099',
        customer: 'Lê Hoàng Nam',
        phone: '0905 678 910',
        date: '13/08/2026 18:45',
        total: 450000,
        payment: 'Chuyển khoản',
        status: 'completed',
      },
      {
        id: 'MS948095',
        customer: 'Phạm Minh Đức',
        phone: '0934 567 890',
        date: '12/08/2026 09:15',
        total: 820000,
        payment: 'COD',
        status: 'completed',
      },
      {
        id: 'MS948090',
        customer: 'Vũ Thị Hồng',
        phone: '0977 222 333',
        date: '11/08/2026 14:10',
        total: 1250000,
        payment: 'COD',
        status: 'cancelled',
      },
    ]);
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormName('');
    setFormCategory('noi-that-gia-dung');
    setFormPrice(100000);
    setFormImage('/MiniShop_Assets/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp');
    setFormStatus('active');
    setFormDesc('');
  };

  const handleEditProduct = (prod: Product) => {
    setActiveTab('products');
    setEditingId(prod.id);
    setFormName(prod.name);
    setFormCategory(prod.category || 'noi-that-gia-dung');
    setFormPrice(prod.price);
    setFormImage(prod.image);
    setFormStatus(prod.status || 'active');
    setFormDesc(prod.desc || '');
  };

  const handleDeleteProduct = (productId: string) => {
    const prod = productsList.find((p) => p.id === productId);
    if (prod && confirm(`Bạn có chắc muốn xóa sản phẩm "${prod.name}"?`)) {
      setProductsList(productsList.filter((p) => p.id !== productId));
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formPrice <= 0) {
      alert('Vui lòng nhập tên sản phẩm và giá hợp lệ.');
      return;
    }

    const categoryMap: Record<string, string> = {
      'noi-that-gia-dung': 'Nội thất & Gia dụng',
      'do-my-nghe': 'Đồ mỹ nghệ',
      'do-thu-cong': 'Đồ thủ công',
      'luu-tru': 'Lưu trữ & Sắp xếp',
    };

    if (editingId) {
      // Edit
      setProductsList(
        productsList.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: formName,
                category: formCategory,
                categoryName: categoryMap[formCategory] || formCategory,
                price: formPrice,
                image: formImage,
                status: formStatus,
                desc: formDesc,
              }
            : p
        )
      );
      alert('Đã cập nhật sản phẩm thành công!');
    } else {
      // Add
      const newProd: Product = {
        id: 'prod-' + Date.now(),
        name: formName,
        category: formCategory,
        categoryName: categoryMap[formCategory] || formCategory,
        price: formPrice,
        image: formImage,
        status: formStatus,
        desc: formDesc || 'Sản phẩm thủ công cao cấp.',
        stock: 'Còn hàng',
      };
      setProductsList([newProd, ...productsList]);
      alert('Đã thêm sản phẩm mới thành công!');
    }
    resetForm();
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: any) => {
    setOrdersList(
      ordersList.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const filteredOrders =
    orderFilter === 'all'
      ? ordersList
      : ordersList.filter((o) => o.status === orderFilter);

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

        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            Dashboard
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            Products
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Orders
            <span className="nav-badge" id="admin-orders-badge">
              {ordersList.length}
            </span>
          </button>
        </nav>

        <div className="sidebar-summary-card">
          <h4 className="summary-card-title">Quick Summary</h4>
          <div className="summary-card-row">
            <span>Sản phẩm</span>
            <strong>{productsList.length}</strong>
          </div>
          <div className="summary-card-row">
            <span>Danh mục</span>
            <strong>4</strong>
          </div>
          <div className="summary-card-row">
            <span>Đơn hàng</span>
            <strong>{ordersList.length}</strong>
          </div>
        </div>

        <div className="sidebar-logout">
          <button
            className="btn-sidebar-logout"
            onClick={() => {
              if (confirm('Bạn có chắc muốn đăng xuất?')) {
                logout();
                router.push('/');
              }
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT */}
      <div className="admin-content-wrapper">
        <header className="admin-topbar">
          <div className="topbar-left">
            <h1 className="topbar-title">
              {activeTab === 'dashboard'
                ? 'Dashboard'
                : activeTab === 'products'
                ? 'Product Management'
                : 'Order Management'}
            </h1>
          </div>
          <div className="topbar-right">
            <div className="admin-user-profile">
              <div className="user-avatar">A</div>
              <span className="user-name">Admin</span>
            </div>
          </div>
        </header>

        <main className="admin-main-container">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <section className="admin-tab-view active">
              <div className="stat-cards-grid">
                <div className="stat-card">
                  <div className="stat-card-info">
                    <span className="stat-label">Total products</span>
                    <h3 className="stat-value">{productsList.length}</h3>
                    <span className="stat-sub">All products in store</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-info">
                    <span className="stat-label">Categories</span>
                    <h3 className="stat-value">4</h3>
                    <span className="stat-sub">Product categories</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-info">
                    <span className="stat-label">Visible products</span>
                    <h3 className="stat-value">
                      {productsList.filter((p) => p.status !== 'inactive').length}
                    </h3>
                    <span className="stat-sub">Currently visible</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-info">
                    <span className="stat-label">Low stock</span>
                    <h3 className="stat-value">
                      {productsList.filter((p) => p.price > 1000000).length}
                    </h3>
                    <span className="stat-sub">Products low on stock</span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Sales Overview & Recent Products */}
              <div className="dashboard-middle-grid">
                <div className="admin-card">
                  <div className="card-header-row">
                    <h3 className="card-title">Sales overview</h3>
                  </div>
                  <div className="chart-container">
                    <svg viewBox="0 0 600 220" className="sales-chart-svg">
                      <line x1="40" y1="30" x2="570" y2="30" stroke="#f1f5f9" strokeDasharray="4" />
                      <line x1="40" y1="80" x2="570" y2="80" stroke="#f1f5f9" strokeDasharray="4" />
                      <line x1="40" y1="130" x2="570" y2="130" stroke="#f1f5f9" strokeDasharray="4" />
                      <line x1="40" y1="180" x2="570" y2="180" stroke="#e2e8f0" />
                      <path d="M 60 140 Q 140 100 220 120 T 380 90 T 540 50" fill="none" stroke="#2563eb" strokeWidth="3" />
                      <circle cx="300" cy="80" r="6" fill="#2563eb" stroke="#ffffff" strokeWidth="3" />
                    </svg>
                  </div>
                </div>

                <div className="admin-card">
                  <div className="card-header-row">
                    <h3 className="card-title">Recent products</h3>
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
                          <th>Product</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productsList.slice(0, 5).map((p) => (
                          <tr key={p.id}>
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
                      <h3 className="card-title">Products</h3>
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
                                <img src={p.image} alt={p.name} className="table-thumb" />
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
                        <label className="form-label">Product name *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Category *</label>
                        <select
                          className="form-input form-select"
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                        >
                          <option value="noi-that-gia-dung">Nội thất & Gia dụng</option>
                          <option value="do-my-nghe">Đồ mỹ nghệ</option>
                          <option value="do-thu-cong">Đồ thủ công</option>
                          <option value="luu-tru">Lưu trữ & Sắp xếp</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Price (VND) *</label>
                        <input
                          type="number"
                          className="form-input"
                          value={formPrice}
                          onChange={(e) => setFormPrice(parseInt(e.target.value, 10) || 0)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Sample Image</label>
                        <select
                          className="form-input form-select"
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                        >
                          <option value="/MiniShop_Assets/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp">
                            Bình gốm trang trí
                          </option>
                          <option value="/MiniShop_Assets/assets/images/products/noi-that-gia-dung/sofa-phong-khach.webp">
                            Sofa phòng khách
                          </option>
                          <option value="/MiniShop_Assets/assets/images/products/noi-that-gia-dung/bo-ban-an-go.webp">
                            Bộ bàn ăn gỗ
                          </option>
                          <option value="/MiniShop_Assets/assets/images/products/do-my-nghe/den-tre-thu-cong.webp">
                            Đèn tre thủ công
                          </option>
                          <option value="/MiniShop_Assets/assets/images/products/do-thu-cong/gio-may-dan.webp">
                            Giỏ mây đan
                          </option>
                        </select>
                        <img
                          src={formImage}
                          alt="Preview"
                          style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover',
                            marginTop: '0.5rem',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Status</label>
                        <select
                          className="form-input form-select"
                          value={formStatus}
                          onChange={(e) => setFormStatus(e.target.value as any)}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-input form-textarea"
                          value={formDesc}
                          onChange={(e) => setFormDesc(e.target.value)}
                        />
                      </div>

                      <div className="form-buttons-row">
                        <button type="submit" className="btn btn-green btn-full">
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-gray btn-full"
                          onClick={resetForm}
                        >
                          Cancel
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
                  <h3 className="card-title">Order Management</h3>
                  <select
                    className="admin-select-sm"
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="new">Mới</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
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
                      {filteredOrders.map((o) => (
                        <tr key={o.id}>
                          <td>
                            <strong>#{o.id}</strong>
                          </td>
                          <td>{o.customer}</td>
                          <td>{o.phone}</td>
                          <td>{o.date}</td>
                          <td>
                            <strong style={{ color: 'var(--color-primary)' }}>
                              {formatVND(o.total)}
                            </strong>
                          </td>
                          <td>
                            <span className="badge-payment">{o.payment}</span>
                          </td>
                          <td>
                            <span
                              className={`badge-status ${
                                o.status === 'completed'
                                  ? 'active'
                                  : o.status === 'processing'
                                  ? 'info'
                                  : o.status === 'new'
                                  ? 'warning'
                                  : 'inactive'
                              }`}
                            >
                              •{' '}
                              {o.status === 'completed'
                                ? 'Hoàn thành'
                                : o.status === 'processing'
                                ? 'Đang xử lý'
                                : o.status === 'new'
                                ? 'Đơn mới'
                                : 'Đã hủy'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <select
                              className="admin-select-sm"
                              value={o.status}
                              onChange={(e) =>
                                handleUpdateOrderStatus(o.id, e.target.value)
                              }
                            >
                              <option value="new">Mới</option>
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
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
