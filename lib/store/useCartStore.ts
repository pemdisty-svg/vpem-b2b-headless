import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  slug: string;
  title: string;
  image: string;
  sku: string;
  b2b_price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  toggleCart: (open?: boolean) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find(item => item.slug === newItem.slug);
        if (existingItem) {
          return {
            items: state.items.map(item => 
              item.slug === newItem.slug 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            )
          };
        }
        return { items: [...state.items, { ...newItem, quantity: 1 }] };
      }),
      removeItem: (slug) => set((state) => ({
        items: state.items.filter(item => item.slug !== slug)
      })),
      updateQuantity: (slug, quantity) => set((state) => ({
        items: state.items.map(item => 
          item.slug === slug ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),
      toggleCart: (open) => set((state) => ({ 
        isOpen: open !== undefined ? open : !state.isOpen 
      })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'vpem-b2b-cart', // Tên lưu trong LocalStorage
    }
  )
);