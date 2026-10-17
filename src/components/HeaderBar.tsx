import React from 'react';
import { ScreenId } from '../types';
import { ShoppingBag } from 'lucide-react';

interface HeaderBarProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentScreen,
  onSelectScreen,
  cartCount,
  onOpenCart,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-stone-800 bg-stone-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Brand Wordmark (Single text element) */}
      <button
        onClick={() => onSelectScreen('today')}
        className="text-lg font-bold tracking-tight text-stone-100 whitespace-nowrap shrink-0 font-display hover:text-amber-400 transition-colors cursor-pointer"
      >
        Aura Studio
      </button>

      {/* Zone 2: 4-5 concise single-line nav links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-stone-400">
        <button
          onClick={() => onSelectScreen('today')}
          className={`hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentScreen === 'today' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Today
        </button>
        <button
          onClick={() => onSelectScreen('habits')}
          className={`hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentScreen === 'habits' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Habits
        </button>
        <button
          onClick={() => onSelectScreen('explore')}
          className={`hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentScreen === 'explore' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Audio
        </button>
        <button
          onClick={() => onSelectScreen('shop')}
          className={`hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentScreen === 'shop' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Apothecary
        </button>
        <button
          onClick={() => onSelectScreen('profile')}
          className={`hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentScreen === 'profile' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Insights
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenCart}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-transform active:scale-95 whitespace-nowrap shrink-0 cursor-pointer shadow-sm shadow-amber-400/20"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Bag {cartCount > 0 ? `(${cartCount})` : ''}</span>
        </button>
      </div>
    </header>
  );
};
