'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, formatVND } from '@/data/products';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const liked = isInWishlist(product.id);

  const getBadgeClass = (badge?: string) => {
    if (!badge) return '';
    if (badge.includes('%')) return 'badge-sale';
    if (badge === 'Hot') return 'badge-hot';
    return 'badge-new';
  };

  return (
    <article
      className="product-card"
      data-category={product.category}
      data-price={product.price}
    >
      <div className="product-img-wrapper">
        {product.badge && (
          <span className={`product-card-badge ${getBadgeClass(product.badge)}`}>
            {product.badge}
          </span>
        )}
        <button
          className={`wishlist-btn ${liked ? 'active' : ''}`}
          title={liked ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
          aria-label="Yêu thích"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id, product.name);
          }}
        >
          <svg viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <Link href={`/products/${product.id}`}>
          <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
        </Link>
      </div>

      <div className="product-info">
        <h3 className="product-name">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="product-price">{formatVND(product.price)}</div>
        {product.stock && <span className="stock-tag">{product.stock}</span>}
        <p className="product-desc">{product.desc}</p>
        <Link href={`/products/${product.id}`} className="btn-detail">
          Xem chi tiết
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </article>
  );
};
