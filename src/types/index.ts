export type ScreenId = 'today' | 'habits' | 'explore' | 'shop' | 'profile';

export type PresentationMode = 'simulator' | 'canvas' | 'responsive';

export type ThemeMode = 'dark' | 'light';

export interface HabitItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'mind' | 'body' | 'sleep' | 'hydration';
  completed: boolean;
  streak: number;
  timeTarget?: string;
  currentValue?: number;
  targetValue?: number;
  unit?: string;
}

export interface SoundSession {
  id: string;
  title: string;
  instructor: string;
  category: 'Breath' | 'Soundscapes' | 'Movement' | 'Sleep';
  durationMin: number;
  image: string;
  soundType: 'river' | 'forest' | 'bowl' | 'theta';
  isBookmarked: boolean;
  playsCount: number;
  description: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  features: string[];
  volumeOrSize: string[];
  inStock: boolean;
}

export interface CartItem {
  product: ShopProduct;
  selectedOption: string;
  quantity: number;
}
