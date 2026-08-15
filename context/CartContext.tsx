'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/data/products';
import { getProductsFromSupabase, getProductByIdFromSupabase } from '@/utils/supabase/services';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  categoryName?: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getSubtotal: () => number;
  appliedCouponDiscount: number;
  applyCoupon: (code: string) => boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'mini_shop_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCouponDiscount, setAppliedCouponDiscount] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize cart with latest Supabase product prices on mount
  useEffect(() => {
    async function syncCartWithSupabase() {
      try {
        const data = localStorage.getItem(CART_STORAGE_KEY);
        if (!data) return;
        const localCart: CartItem[] = JSON.parse(data);
        if (!localCart || localCart.length === 0) return;

        // Fetch latest products from Supabase
        const freshProducts = await getProductsFromSupabase();
        if (!freshProducts || freshProducts.length === 0) {
          setCart(localCart);
          return;
        }

        // Update item prices and metadata in cart
        const syncedCart = localCart.map((item) => {
          const fresh = freshProducts.find((p) => p.id === item.id);
          if (fresh) {
            return {
              ...item,
              name: fresh.name,
              price: fresh.price,
              image: fresh.image,
              categoryName: fresh.categoryName,
            };
          }
          return item;
        });

        setCart(syncedCart);
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(syncedCart));
      } catch (e) {
        console.error('Error syncing cart with Supabase', e);
      }
    }

    syncCartWithSupabase();
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = async (productId: string, quantity = 1) => {
    const product = await getProductByIdFromSupabase(productId);
    if (!product) return;

    const existingIndex = cart.findIndex((item) => item.id === productId);
    let newCart = [...cart];

    if (existingIndex > -1) {
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        price: product.price,
        name: product.name,
        image: product.image,
        categoryName: product.categoryName,
        quantity: newCart[existingIndex].quantity + quantity,
      };
    } else {
      newCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        categoryName: product.categoryName,
        quantity: quantity,
      });
    }

    saveCart(newCart);
    showToast(`Đã thêm ${quantity} "${product.name}" vào giỏ hàng!`);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    const newCart = cart.map((item) => (item.id === productId ? { ...item, quantity } : item));
    saveCart(newCart);
  };

  const removeItem = (productId: string) => {
    const newCart = cart.filter((item) => item.id !== productId);
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
    setAppliedCouponDiscount(0);
  };

  const getTotalCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'MINISHOP') {
      setAppliedCouponDiscount(50000);
      showToast('Đã áp dụng mã giảm giá MINISHOP (-50.000đ)!');
      return true;
    } else if (cleanCode === '') {
      setAppliedCouponDiscount(0);
      return true;
    }
    return false;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        getTotalCount,
        getSubtotal,
        appliedCouponDiscount,
        applyCoupon,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
