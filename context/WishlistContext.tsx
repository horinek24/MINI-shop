'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCart } from './CartContext';

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (productId: string, productName?: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'mini_shop_wishlist';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { showToast } = useCart();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (raw) {
        setWishlist(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Error loading wishlist from localStorage', e);
    }
  }, []);

  const saveWishlist = (list: string[]) => {
    setWishlist(list);
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving wishlist to localStorage', e);
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const toggleWishlist = (productId: string, productName?: string) => {
    const isAdded = isInWishlist(productId);
    let updated: string[];
    if (isAdded) {
      updated = wishlist.filter((id) => id !== productId);
      showToast(`Đã bỏ "${productName || 'sản phẩm'}" khỏi danh sách yêu thích.`);
    } else {
      updated = [...wishlist, productId];
      showToast(`Đã thêm "${productName || 'sản phẩm'}" vào danh sách yêu thích!`);
    }
    saveWishlist(updated);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
