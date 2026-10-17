import React, { useState, useEffect } from 'react';
import { ScreenId, PresentationMode, HabitItem, SoundSession, ShopProduct, CartItem } from './types';
import { INITIAL_HABITS, SOUND_SESSIONS, SHOP_PRODUCTS } from './data/mockData';
import { ambientAudio } from './utils/audio';
import { HeaderBar } from './components/HeaderBar';
import { DeviceFrame } from './components/DeviceFrame';
import { CanvasOverview } from './components/CanvasOverview';
import { ScreenToday } from './components/ScreenToday';
import { ScreenHabits } from './components/ScreenHabits';
import { ScreenExplore } from './components/ScreenExplore';
import { ScreenShop } from './components/ScreenShop';
import { ScreenProfile } from './components/ScreenProfile';
import { CartDrawer } from './components/CartDrawer';
import { Smartphone, LayoutGrid, Monitor, Volume2, Sparkles, SlidersHorizontal, Sun, Activity, Headphones, ShoppingBag, User } from 'lucide-react';

export default function App() {
  const [presentationMode, setPresentationMode] = useState<PresentationMode>('simulator');
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('today');
  const [frameColor, setFrameColor] = useState<'titanium' | 'silver' | 'gold' | 'midnight'>('titanium');

  // Habits state
  const [habits, setHabits] = useState<HabitItem[]>(INITIAL_HABITS);
  const [waterIntake, setWaterIntake] = useState<number>(1750);

  // Audio sessions state
  const [sessions, setSessions] = useState<SoundSession[]>(SOUND_SESSIONS);
  const [activeSession, setActiveSession] = useState<SoundSession | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.65);

  // Shop & Cart state
  const [products] = useState<ShopProduct[]>(SHOP_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: SHOP_PRODUCTS[0],
      selectedOption: '100 ml / 3.4 fl oz',
      quantity: 1,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Audio volume sync
  useEffect(() => {
    ambientAudio.setVolume(volume);
  }, [volume]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      ambientAudio.stop();
    };
  }, []);

  const handleToggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const nextCompleted = !h.completed;
          return {
            ...h,
            completed: nextCompleted,
            streak: nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1),
          };
        }
        return h;
      })
    );
  };

  const handleAddHabit = (newHabit: HabitItem) => {
    setHabits((prev) => [newHabit, ...prev]);
  };

  const handleDeleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const handleUpdateWater = (delta: number) => {
    setWaterIntake((prev) => Math.max(0, prev + delta));
  };

  const handlePlaySession = (session: SoundSession) => {
    if (activeSession?.id === session.id && isPlaying) {
      ambientAudio.stop();
      setIsPlaying(false);
    } else {
      setActiveSession(session);
      ambientAudio.play(session.soundType);
      setIsPlaying(true);
    }
  };

  const handleTogglePlay = () => {
    if (!activeSession) {
      if (sessions.length > 0) {
        handlePlaySession(sessions[0]);
      }
      return;
    }
    if (isPlaying) {
      ambientAudio.stop();
      setIsPlaying(false);
    } else {
      ambientAudio.play(activeSession.soundType);
      setIsPlaying(true);
    }
  };

  const handleToggleBookmark = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isBookmarked: !s.isBookmarked } : s))
    );
  };

  const handleAddToCart = (product: ShopProduct, option: string) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.selectedOption === option
      );
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.selectedOption === option
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, selectedOption: option, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, option: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => {
          if (i.product.id === productId && i.selectedOption === option) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: string, option: string) => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.product.id === productId && i.selectedOption === option))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleExportReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Protocol,Category,Streak (Days),Status\n' +
      habits.map((h) => `"${h.title}","${h.category}",${h.streak},"${h.completed ? 'Completed' : 'Pending'}"`).join('\n') +
      `\n\nDaily Hydration,${waterIntake} ml,Goal: 2500 ml\n` +
      `Mindfulness Minutes,355 min/week\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aura_biometric_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Render active screen for simulator or responsive
  const renderCurrentScreenContent = () => {
    switch (currentScreen) {
      case 'today':
        return (
          <ScreenToday
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onPlaySession={handlePlaySession}
            activeSession={activeSession}
            isPlaying={isPlaying}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        );
      case 'habits':
        return (
          <ScreenHabits
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onAddHabit={handleAddHabit}
            onDeleteHabit={handleDeleteHabit}
            waterIntake={waterIntake}
            onUpdateWater={handleUpdateWater}
          />
        );
      case 'explore':
        return (
          <ScreenExplore
            sessions={sessions}
            activeSession={activeSession}
            isPlaying={isPlaying}
            onPlaySession={handlePlaySession}
            onTogglePlay={handleTogglePlay}
            onToggleBookmark={handleToggleBookmark}
            volume={volume}
            onVolumeChange={setVolume}
          />
        );
      case 'shop':
        return (
          <ScreenShop
            products={products}
            onAddToCart={handleAddToCart}
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
          />
        );
      case 'profile':
        return <ScreenProfile onExportReport={handleExportReport} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* 3-Zone Top Bar Contract */}
      <HeaderBar
        currentScreen={currentScreen}
        onSelectScreen={(s) => {
          setCurrentScreen(s);
          if (presentationMode === 'canvas') setPresentationMode('simulator');
        }}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Secondary Workspace Toolbar (Mode Switcher & Finish) */}
      <div className="border-b border-stone-800/80 bg-stone-900/50 backdrop-blur-sm px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Presentation View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-stone-950 rounded-xl border border-stone-800">
          <button
            onClick={() => setPresentationMode('simulator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              presentationMode === 'simulator'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Device Simulator</span>
          </button>

          <button
            onClick={() => setPresentationMode('canvas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              presentationMode === 'canvas'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All 5 Screens Canvas</span>
          </button>

          <button
            onClick={() => setPresentationMode('responsive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              presentationMode === 'responsive'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Expanded Desktop</span>
          </button>
        </div>

        {/* Chassis Finish Selector (only in simulator mode) */}
        {presentationMode === 'simulator' && (
          <div className="flex items-center gap-2">
            <span className="text-stone-500 text-[11px] hidden sm:inline">Chassis:</span>
            <div className="flex items-center gap-1 p-1 bg-stone-950 rounded-xl border border-stone-800">
              {(['titanium', 'silver', 'gold', 'midnight'] as const).map((clr) => (
                <button
                  key={clr}
                  onClick={() => setFrameColor(clr)}
                  className={`px-2.5 py-1 rounded-lg capitalize text-[11px] transition-colors cursor-pointer ${
                    frameColor === clr
                      ? 'bg-stone-800 text-stone-100 font-semibold shadow-xs'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {clr}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ambient Sound status badge */}
        {activeSession && (
          <div className="flex items-center gap-2 text-stone-400">
            <button
              onClick={handleTogglePlay}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-amber-300 hover:border-amber-500/50 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="truncate max-w-[120px]">{activeSession.title}</span>
              <span className="font-mono text-[10px] text-stone-400">
                {isPlaying ? 'Playing' : 'Paused'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area based on mode */}
      <main className="flex-1 flex flex-col justify-center">
        {presentationMode === 'simulator' && (
          <div className="py-4">
            <DeviceFrame
              currentScreen={currentScreen}
              onSelectScreen={(s) => setCurrentScreen(s)}
              activeSession={activeSession}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              cartCount={totalCartCount}
              frameColor={frameColor}
            >
              {renderCurrentScreenContent()}
            </DeviceFrame>
          </div>
        )}

        {presentationMode === 'canvas' && (
          <CanvasOverview
            onSelectScreenToSimulate={(scr) => {
              setCurrentScreen(scr);
              setPresentationMode('simulator');
            }}
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onAddHabit={handleAddHabit}
            onDeleteHabit={handleDeleteHabit}
            waterIntake={waterIntake}
            onUpdateWater={handleUpdateWater}
            sessions={sessions}
            activeSession={activeSession}
            isPlaying={isPlaying}
            onPlaySession={handlePlaySession}
            onTogglePlay={handleTogglePlay}
            onToggleBookmark={handleToggleBookmark}
            volume={volume}
            onVolumeChange={setVolume}
            products={products}
            onAddToCart={handleAddToCart}
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
            onExportReport={handleExportReport}
          />
        )}

        {presentationMode === 'responsive' && (
          <div className="max-w-6xl mx-auto w-full py-8 px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-3 bg-stone-900/60 border border-stone-800 rounded-3xl p-5 space-y-4">
              <div>
                <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                  Navigation
                </div>
                <h3 className="text-base font-bold text-stone-100 font-display mt-0.5">
                  Studio Hub
                </h3>
              </div>

              <div className="space-y-1">
                {[
                  { id: 'today', label: 'Today & Rituals', icon: Sun },
                  { id: 'habits', label: 'Habit Protocols', icon: Activity },
                  { id: 'explore', label: 'Audio & Breath', icon: Headphones },
                  { id: 'shop', label: 'Botanical Store', icon: ShoppingBag, badge: totalCartCount },
                  { id: 'profile', label: 'Biometric Profile', icon: User },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentScreen(item.id as ScreenId)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'text-stone-300 hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="w-5 h-5 rounded-full bg-stone-950 text-amber-400 text-[10px] flex items-center justify-center font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick stats mini card */}
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800/80 space-y-2">
                <div className="text-[11px] font-medium text-stone-400">Circadian Streak</div>
                <div className="text-xl font-bold font-display text-amber-300 tabular-nums">
                  18 Days
                </div>
                <div className="text-[10px] text-stone-500">
                  Target: 21 days for neural myelination
                </div>
              </div>
            </aside>

            {/* Active Screen View */}
            <section className="lg:col-span-9 bg-stone-900/40 border border-stone-800 rounded-3xl p-6 sm:p-8 min-h-[700px]">
              {renderCurrentScreenContent()}
            </section>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
