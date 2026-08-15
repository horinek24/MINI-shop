'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { getTotalCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const { wishlist } = useWishlist();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = getTotalCount();

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const firstName = user?.name ? user.name.split(' ').pop() : 'Bạn';

  return (
    <header id="site-header" className={`site-header ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="container">
        <div className="header-inner">
          {/* Logo */}
          <Link href="/" className="brand-logo" title="Mini Shop Decor Trang Chủ">
            <svg viewBox="0 0 24 24">
              <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h6v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z" />
            </svg>
            Mini Shop Decor
          </Link>

          {/* Navigation Menu */}
          <ul className="nav-menu">
            <li>
              <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className={`nav-link ${pathname.startsWith('/products') ? 'active' : ''}`}
              >
                Products
              </Link>
            </li>
            <li>
              <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`}>
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>
                Contact
              </Link>
            </li>
            <li>
              <Link href="/faq" className={`nav-link ${pathname === '/faq' ? 'active' : ''}`}>
                FAQ
              </Link>
            </li>
          </ul>

          {/* Search Bar */}
          <div className="header-search">
            <input
              type="text"
              id="global-search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <span className="search-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </div>

          {/* Cart & Wishlist Buttons & User Actions */}
          <div className="header-actions">
            <Link
              href="/wishlist"
              className={`header-cart-link ${pathname === '/wishlist' ? 'active' : ''}`}
              title="Sản phẩm yêu thích"
              style={{ marginRight: '0.35rem' }}
            >
              <svg viewBox="0 0 24 24" fill={wishlist.length > 0 ? '#ef4444' : 'none'} stroke={wishlist.length > 0 ? '#ef4444' : 'currentColor'} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="cart-badge" style={{ backgroundColor: '#ef4444' }}>
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className={`header-cart-link ${pathname === '/cart' ? 'active' : ''}`}
              title="Giỏ hàng"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="cart-badge" id="cart-badge-count">
                {cartCount}
              </span>
            </Link>

            {!user ? (
              <>
                <Link href="/login" className="btn btn-outline-gray">
                  Đăng nhập
                </Link>
                <Link href="/register" className="btn btn-blue">
                  Đăng ký
                </Link>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Link href="/admin" className="btn btn-outline-green">
                    Quản trị
                  </Link>
                )}
                <div className="header-user-menu" style={{ position: 'relative' }}>
                  <button
                    className="btn btn-outline-gray header-user-btn"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {firstName}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="header-user-dropdown open" id="user-dropdown">
                      <div className="user-dropdown-info">
                        <div className="user-dropdown-name">{user.name}</div>
                        <div className="user-dropdown-role">{isAdmin ? 'Quản trị viên' : 'Khách hàng'}</div>
                      </div>
                      <Link href="/" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                        Trang chủ
                      </Link>
                      <Link href="/profile" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                        Hồ sơ cá nhân
                      </Link>
                      <Link href="/my-orders" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                        Đơn hàng của tôi
                      </Link>
                      <Link href="/wishlist" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                        Sản phẩm yêu thích ({wishlist.length})
                      </Link>
                      <Link href="/cart" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                        Giỏ hàng
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                          Khu quản trị
                        </Link>
                      )}
                      <button
                        className="user-dropdown-item user-dropdown-logout"
                        onClick={async () => {
                          await logout();
                          setDropdownOpen(false);
                          router.push('/');
                        }}
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
