import React, { useState } from 'react';
import { HabitItem, SoundSession } from '../types';
import { Check, Flame, Play, Volume2, Sparkles, Plus, Clock } from 'lucide-react';

interface ScreenTodayProps {
  habits: HabitItem[];
  onToggleHabit: (id: string) => void;
  onPlaySession: (session: SoundSession) => void;
  activeSession: SoundSession | null;
  isPlaying: boolean;
  onNavigate: (screen: 'habits' | 'explore') => void;
}

export const ScreenToday: React.FC<ScreenTodayProps> = ({
  habits,
  onToggleHabit,
  onPlaySession,
  activeSession,
  isPlaying,
  onNavigate,
}) => {
  const [selectedMood, setSelectedMood] = useState<string>('Grounded');
  const [reflectionText, setReflectionText] = useState<string>('');
  const [savedReflection, setSavedReflection] = useState<boolean>(false);

  const moods = [
    { label: 'Calm', subtitle: 'Serene & centered' },
    { label: 'Grounded', subtitle: 'Stable & present' },
    { label: 'Energized', subtitle: 'Vibrant & clear' },
    { label: 'Reflective', subtitle: 'Pensive & soft' },
  ];

  const completedCount = habits.filter((h) => h.completed).length;
  const progressPercent = Math.round((completedCount / habits.length) * 100);

  const heroSession: SoundSession = {
    id: 'hero-session-today',
    title: 'Ethereal River Basin',
    instructor: 'Julian Vance · Acoustic Resonance',
    category: 'Soundscapes',
    durationMin: 24,
    image: '/src/assets/images/meditation_soundscape_1792230964874.jpg',
    soundType: 'river',
    isBookmarked: true,
    playsCount: 1420,
    description: 'Binaural river currents filtered over weathered river stones.',
  };

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;
    setSavedReflection(true);
    setTimeout(() => setSavedReflection(false), 2400);
  };

  return (
    <div className="flex flex-col gap-6 pb-20 text-stone-100">
      {/* Top Greeting & Date */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-stone-400 tracking-wide">
            Saturday · October 17
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-100 mt-1 font-display">
            Good morning, Elena
          </h1>
          <div className="text-xs text-stone-400 mt-0.5">
            Your body clock is attuned to sunrise.
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800/80 border border-stone-700/60 text-xs font-medium text-amber-300">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="tabular-nums font-semibold">18 Days</span>
        </div>
      </div>

      {/* Hero Visual Card: Travertine Living Sanctuary */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 group shadow-lg">
        <div className="relative h-44 w-full overflow-hidden bg-stone-950">
          <img
            src="/src/assets/images/hero_wellness_morning_1792230964468.jpg"
            alt="Morning sunlight in mindful living studio"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="text-xs font-medium text-amber-400 tracking-wider">
            Morning Sanctuary
          </div>
          <h2 className="text-lg font-bold text-stone-100 font-display mt-0.5">
            Circadian Alignment Ritual
          </h2>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-800/80 text-xs text-stone-300">
            <span className="text-stone-400">15 min sunlight · 500ml water</span>
            <button
              onClick={() => onNavigate('habits')}
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
            >
              Begin Session →
            </button>
          </div>
        </div>
      </div>

      {/* Routine Progress Card */}
      <div className="p-4 rounded-2xl bg-stone-800/50 border border-stone-800 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-stone-200">Today’s Ritual Completion</span>
          <span className="text-stone-400 tabular-nums">
            {completedCount} of {habits.length} rituals · {progressPercent}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-stone-700/60 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Quick Check list */}
        <div className="flex flex-col gap-2 mt-1">
          {habits.slice(0, 3).map((habit) => (
            <button
              key={habit.id}
              onClick={() => onToggleHabit(habit.id)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/60 hover:bg-stone-900 border border-stone-800/70 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                    habit.completed
                      ? 'bg-amber-500 border-amber-400 text-stone-950 font-bold'
                      : 'border-stone-700 bg-stone-800 group-hover:border-stone-500 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <div
                    className={`text-xs font-medium transition-colors ${
                      habit.completed ? 'text-stone-400 line-through' : 'text-stone-200'
                    }`}
                  >
                    {habit.title}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {habit.timeTarget || habit.subtitle}
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-stone-500 tabular-nums font-mono">
                {habit.streak}d streak
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mood & Energy Check-in */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-stone-300">
            Somatic State & Presence
          </h3>
          <span className="text-[11px] text-stone-500">Selected: {selectedMood}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {moods.map((m) => (
            <button
              key={m.label}
              onClick={() => setSelectedMood(m.label)}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                selectedMood === m.label
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-200'
                  : 'bg-stone-900/70 border-stone-800 hover:border-stone-700 text-stone-400'
              }`}
            >
              <div className="text-xs font-semibold text-stone-200">{m.label}</div>
              <div className="text-[10px] text-stone-400 mt-0.5">{m.subtitle}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Audio Session */}
      <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
            <Volume2 className="w-4 h-4" />
            <span>Recommended Soundscape</span>
          </div>
          <span className="text-xs text-stone-500 tabular-nums">24 min</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-800 shrink-0 border border-stone-700">
            <img
              src={heroSession.image}
              alt={heroSession.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-stone-100 truncate">
              {heroSession.title}
            </h4>
            <div className="text-[11px] text-stone-400 truncate mt-0.5">
              {heroSession.instructor}
            </div>
            <div className="text-[10px] text-stone-500 mt-1">
              Binaural river currents · 432 Hz resonance
            </div>
          </div>
          <button
            onClick={() => onPlaySession(heroSession)}
            className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-md shadow-amber-500/20 cursor-pointer"
            aria-label="Play recommended session"
          >
            {isPlaying && activeSession?.id === heroSession.id ? (
              <span className="flex gap-0.5 h-3 items-end">
                <span className="w-1 bg-stone-950 h-3 animate-pulse" />
                <span className="w-1 bg-stone-950 h-2 animate-pulse" />
                <span className="w-1 bg-stone-950 h-3 animate-pulse" />
              </span>
            ) : (
              <Play className="w-4 h-4 fill-stone-950 translate-x-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Intention Journal note */}
      <form onSubmit={handleSaveReflection} className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="intention" className="font-semibold text-stone-300">
            Daily Intention Note
          </label>
          {savedReflection && (
            <span className="text-emerald-400 text-[11px]">Saved to journal</span>
          )}
        </div>
        <div className="relative">
          <input
            id="intention"
            type="text"
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="e.g. Move with quiet precision and patient breath..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/60 pr-16"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-[11px] font-medium text-stone-200 transition-colors cursor-pointer"
          >
            Record
          </button>
        </div>
      </form>
    </div>
  );
};
