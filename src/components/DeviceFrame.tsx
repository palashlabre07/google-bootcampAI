import React, { useEffect, useState } from 'react';
import { ScreenId, SoundSession } from '../types';
import { Sun, CheckSquare, Headphones, ShoppingBag, User, Wifi, BatteryCharging, Sparkles } from 'lucide-react';

interface DeviceFrameProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  activeSession: SoundSession | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  cartCount: number;
  frameColor: 'titanium' | 'silver' | 'gold' | 'midnight';
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  currentScreen,
  onSelectScreen,
  activeSession,
  isPlaying,
  onTogglePlay,
  cartCount,
  frameColor,
  children,
}) => {
  const [timeStr, setTimeStr] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const frameBorders = {
    titanium: 'border-stone-700 bg-stone-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]',
    silver: 'border-stone-400/80 bg-stone-950 shadow-[0_25px_60px_-15px_rgba(200,200,200,0.15)]',
    gold: 'border-amber-600/70 bg-stone-950 shadow-[0_25px_60px_-15px_rgba(245,158,11,0.2)]',
    midnight: 'border-slate-800 bg-slate-950 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.9)]',
  };

  const navItems: { id: ScreenId; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'today', label: 'Today', icon: Sun },
    { id: 'habits', label: 'Habits', icon: CheckSquare },
    { id: 'explore', label: 'Audio', icon: Headphones },
    { id: 'shop', label: 'Shop', icon: ShoppingBag, badge: cartCount },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="relative mx-auto flex items-center justify-center p-2 sm:p-6 select-none">
      {/* Smartphone Chassis */}
      <div
        className={`relative w-[390px] h-[820px] max-h-[92vh] rounded-[52px] border-[10px] ${frameBorders[frameColor]} overflow-hidden flex flex-col transition-all duration-300 ring-1 ring-white/10`}
      >
        {/* Dynamic Island & Status Bar */}
        <div className="relative h-12 bg-stone-950 px-7 pt-2 flex items-center justify-between text-stone-200 z-30 shrink-0">
          {/* Time */}
          <span className="text-xs font-semibold tracking-tight font-mono tabular-nums">
            {timeStr}
          </span>

          {/* Dynamic Island */}
          <div
            onClick={activeSession ? onTogglePlay : undefined}
            className={`absolute left-1/2 -translate-x-1/2 top-2 h-7 rounded-full bg-black border border-stone-800/80 flex items-center px-3 gap-2 transition-all cursor-pointer ${
              activeSession && isPlaying
                ? 'w-48 justify-between shadow-sm shadow-amber-500/20'
                : 'w-28 justify-center'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-700/80" />
            {activeSession && isPlaying ? (
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[10px] text-amber-300 font-medium truncate max-w-[85px]">
                  {activeSession.title}
                </span>
                <span className="flex gap-0.5 items-end h-2.5">
                  <span className="w-0.5 h-2.5 bg-amber-400 animate-pulse" />
                  <span className="w-0.5 h-1.5 bg-amber-400 animate-pulse" />
                  <span className="w-0.5 h-2 bg-amber-400 animate-pulse" />
                </span>
              </div>
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-stone-800/80" />
            )}
          </div>

          {/* Indicators */}
          <div className="flex items-center gap-1.5 text-stone-300">
            <Wifi className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono font-bold">5G</span>
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Screen Viewport with Scrollable Body */}
        <div
          id="screen-scroll-container"
          className="flex-1 overflow-y-auto px-5 pt-3 pb-8 bg-stone-950 text-stone-100 scroll-smooth relative"
        >
          {children}
        </div>

        {/* Fixed Mobile Bottom Tab Bar */}
        <div className="h-18 bg-stone-950/95 backdrop-blur-xl border-t border-stone-800/80 px-3 flex items-center justify-around shrink-0 z-30">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectScreen(item.id);
                  const container = document.getElementById('screen-scroll-container');
                  if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative min-w-[48px] min-h-[48px] flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isActive ? 'text-amber-400' : 'text-stone-400 hover:text-stone-200'
                }`}
                aria-label={`Navigate to ${item.label}`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
                    }`}
                  />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[9px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 font-medium transition-colors ${
                    isActive ? 'text-amber-400 font-semibold' : 'text-stone-400'
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="h-4 bg-stone-950 flex items-center justify-center shrink-0">
          <div className="w-32 h-1 rounded-full bg-stone-700/80" />
        </div>
      </div>
    </div>
  );
};
