import React, { useState } from 'react';
import { ScreenId, SoundSession, HabitItem, ShopProduct } from '../types';
import { ScreenToday } from './ScreenToday';
import { ScreenHabits } from './ScreenHabits';
import { ScreenExplore } from './ScreenExplore';
import { ScreenShop } from './ScreenShop';
import { ScreenProfile } from './ScreenProfile';
import { ZoomIn, ZoomOut, Maximize2, Sparkles, Smartphone, Eye } from 'lucide-react';

interface CanvasOverviewProps {
  onSelectScreenToSimulate: (screen: ScreenId) => void;
  habits: HabitItem[];
  onToggleHabit: (id: string) => void;
  onAddHabit: (habit: HabitItem) => void;
  onDeleteHabit: (id: string) => void;
  waterIntake: number;
  onUpdateWater: (delta: number) => void;
  sessions: SoundSession[];
  activeSession: SoundSession | null;
  isPlaying: boolean;
  onPlaySession: (session: SoundSession) => void;
  onTogglePlay: () => void;
  onToggleBookmark: (id: string) => void;
  volume: number;
  onVolumeChange: (val: number) => void;
  products: ShopProduct[];
  onAddToCart: (product: ShopProduct, option: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onExportReport: () => void;
}

export const CanvasOverview: React.FC<CanvasOverviewProps> = ({
  onSelectScreenToSimulate,
  habits,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
  waterIntake,
  onUpdateWater,
  sessions,
  activeSession,
  isPlaying,
  onPlaySession,
  onTogglePlay,
  onToggleBookmark,
  volume,
  onVolumeChange,
  products,
  onAddToCart,
  cartCount,
  onOpenCart,
  onExportReport,
}) => {
  const [scale, setScale] = useState<number>(0.85);

  const screens: {
    id: ScreenId;
    title: string;
    subtitle: string;
    component: React.ReactNode;
  }[] = [
    {
      id: 'today',
      title: '01. Today & Circadian Rituals',
      subtitle: 'Morning sunlight exposure, routine checklist & mood check-in',
      component: (
        <ScreenToday
          habits={habits}
          onToggleHabit={onToggleHabit}
          onPlaySession={onPlaySession}
          activeSession={activeSession}
          isPlaying={isPlaying}
          onNavigate={(s) => onSelectScreenToSimulate(s)}
        />
      ),
    },
    {
      id: 'habits',
      title: '02. Vital Habits & Daily Rhythm',
      subtitle: '7-day calendar, cellular hydration logger & movement protocols',
      component: (
        <ScreenHabits
          habits={habits}
          onToggleHabit={onToggleHabit}
          onAddHabit={onAddHabit}
          onDeleteHabit={onDeleteHabit}
          waterIntake={waterIntake}
          onUpdateWater={onUpdateWater}
        />
      ),
    },
    {
      id: 'explore',
      title: '03. Acoustic Soundscapes & Breath',
      subtitle: 'Binaural river currents, 432Hz crystal bowls & active player',
      component: (
        <ScreenExplore
          sessions={sessions}
          activeSession={activeSession}
          isPlaying={isPlaying}
          onPlaySession={onPlaySession}
          onTogglePlay={onTogglePlay}
          onToggleBookmark={onToggleBookmark}
          volume={volume}
          onVolumeChange={onVolumeChange}
        />
      ),
    },
    {
      id: 'shop',
      title: '04. Botanical Apothecary & Living',
      subtitle: 'Cold-pressed wild rose infusion, stoneware & wellness essentials',
      component: (
        <ScreenShop
          products={products}
          onAddToCart={onAddToCart}
          cartCount={cartCount}
          onOpenCart={onOpenCart}
        />
      ),
    },
    {
      id: 'profile',
      title: '05. Biometric Rhythm & Profile',
      subtitle: 'Weekly consistency bar chart, achievements & studio settings',
      component: <ScreenProfile onExportReport={onExportReport} />,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 py-6 px-4 max-w-[1700px] mx-auto">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-900/90 border border-stone-800 backdrop-blur-md">
        <div>
          <div className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
            Interactive Multi-Screen Architecture
          </div>
          <h2 className="text-xl font-bold text-stone-100 font-display">
            Aura Flagship Application Canvas
          </h2>
          <div className="text-xs text-stone-400 mt-0.5">
            Compare all 5 live application views simultaneously or click "Simulate" to interact within a titanium phone frame.
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-stone-950 border border-stone-800 rounded-xl p-1">
            <button
              onClick={() => setScale((s) => Math.max(0.65, Number((s - 0.1).toFixed(2))))}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-mono font-medium text-stone-300 tabular-nums">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((s) => Math.min(1.1, Number((s + 0.1).toFixed(2))))}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setScale(0.85)}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Multi-Screen Horizontal Carousel / Grid */}
      <div
        className="w-full overflow-x-auto pb-8 pt-2 scrollbar-thin transition-all flex gap-8 items-start justify-start xl:justify-center"
        style={{ transformOrigin: 'top center' }}
      >
        {screens.map((scr, idx) => (
          <div
            key={scr.id}
            className="flex flex-col items-center shrink-0 transition-transform duration-200"
            style={{ width: `${380 * scale}px` }}
          >
            {/* Screen Header Label */}
            <div className="w-full mb-3 flex items-start justify-between px-2">
              <div>
                <h3 className="text-xs font-bold text-stone-200 font-display">
                  {scr.title}
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">
                  {scr.subtitle}
                </p>
              </div>
              <button
                onClick={() => onSelectScreenToSimulate(scr.id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-stone-950 text-[10px] font-semibold border border-amber-500/30 transition-colors cursor-pointer shrink-0 ml-2"
              >
                <Smartphone className="w-3 h-3" />
                <span>Simulate</span>
              </button>
            </div>

            {/* Scaled Device Container */}
            <div
              style={{
                width: '380px',
                height: '780px',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
              className="rounded-[44px] border-[8px] border-stone-800 bg-stone-950 shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-white/10"
            >
              {/* Fake Status bar */}
              <div className="h-10 bg-stone-950 px-6 flex items-center justify-between text-stone-400 text-[11px] font-mono shrink-0">
                <span className="font-semibold text-stone-300">09:41</span>
                <div className="w-20 h-4 rounded-full bg-black border border-stone-800 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-stone-800" />
                </div>
                <span>5G · 100%</span>
              </div>

              {/* Scrollable screen content */}
              <div className="flex-1 overflow-y-auto px-4 py-3 bg-stone-950 text-stone-100">
                {scr.component}
              </div>

              {/* Bottom mini indicator */}
              <div className="h-4 bg-stone-950 flex items-center justify-center shrink-0 border-t border-stone-900">
                <div className="w-24 h-1 rounded-full bg-stone-700" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
