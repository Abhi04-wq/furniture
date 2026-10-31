import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: string;
  price: number;
  currency: string;
  rating: number;
  reviewsCount: number;
  dimensions: {
    width?: string;
    depth?: string;
    height?: string;
    weight?: string;
    seatHeight?: string;
    diameter?: string;
  };
  materials: string[];
  features: string[];
  inStock: boolean;
  leadTime: string;
  heroHighlight: boolean;
  image: string;
  gallery: string[];
  story: string;
  collection?: string;
  collectionSlug?: string;
  badge?: string;
  colors?: { name: string; hex: string }[];
}

export type CameraMode = 'cinematic' | 'top' | 'front' | 'detail';

interface FurnitureStoreState {
  scrollProgress: number; // 0.0 to 1.0
  activeStage: number; // 1 to 5
  setScrollProgress: (progress: number) => void;
  
  cameraMode: CameraMode;
  setCameraMode: (mode: CameraMode) => void;

  soundEnabled: boolean;
  toggleSound: () => void;

  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartItems: { product: Product; quantity: number }[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;

  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Manual scrub override (if user drags slider or clicks stage)
  isScrubbing: boolean;
  setIsScrubbing: (scrubbing: boolean) => void;

  // Hero section scrolled past state (for navbar and global transitions)
  isHeroPast: boolean;
  setIsHeroPast: (past: boolean) => void;
}

export const useFurnitureStore = create<FurnitureStoreState>((set) => ({
  scrollProgress: 0,
  activeStage: 1,
  isHeroPast: false,
  setIsHeroPast: (past) => set({ isHeroPast: past }),
  setScrollProgress: (progress) => {
    const clamped = Math.max(0, Math.min(1, progress));
    let stage = 1;
    if (clamped < 0.15) stage = 1;
    else if (clamped < 0.30) stage = 2;
    else if (clamped < 0.50) stage = 3;
    else if (clamped < 0.74) stage = 4;
    else stage = 5;

    set({ scrollProgress: clamped, activeStage: stage });
  },

  cameraMode: 'cinematic',
  setCameraMode: (mode) => set({ cameraMode: mode }),

  soundEnabled: false,
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  cartItems: [],
  addToCart: (product) =>
    set((state) => {
      const existing = state.cartItems.find((item) => item.product.id === product.id);
      if (existing) {
        return {
          cartItems: state.cartItems.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
          isCartOpen: true,
        };
      }
      return {
        cartItems: [...state.cartItems, { product, quantity: 1 }],
        isCartOpen: true,
      };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.product.id !== productId),
    })),

  quickViewProduct: null,
  setQuickViewProduct: (product) => set({ quickViewProduct: product }),

  isScrubbing: false,
  setIsScrubbing: (isScrubbing) => set({ isScrubbing }),
}));
