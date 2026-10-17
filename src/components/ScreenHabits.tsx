import React, { useState } from 'react';
import { HabitItem } from '../types';
import { Check, Plus, Droplets, Activity, Moon, Sun, Trash2 } from 'lucide-react';

interface ScreenHabitsProps {
  habits: HabitItem[];
  onToggleHabit: (id: string) => void;
  onAddHabit: (habit: HabitItem) => void;
  onDeleteHabit: (id: string) => void;
  waterIntake: number;
  onUpdateWater: (delta: number) => void;
}

export const ScreenHabits: React.FC<ScreenHabitsProps> = ({
  habits,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
  waterIntake,
  onUpdateWater,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(17);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'mind' | 'body' | 'hydration' | 'sleep'>('all');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'mind' | 'body' | 'hydration' | 'sleep'>('mind');
  const [newTarget, setNewTarget] = useState<string>('Morning ritual');

  const daysOfWeek = [
    { dayName: 'M', dayNumber: 12 },
    { dayName: 'T', dayNumber: 13 },
    { dayName: 'W', dayNumber: 14 },
    { dayName: 'T', dayNumber: 15 },
    { dayName: 'F', dayNumber: 16 },
    { dayName: 'S', dayNumber: 17, isToday: true },
    { dayName: 'S', dayNumber: 18 },
  ];

  const filteredHabits = habits.filter((h) => {
    if (selectedCategory === 'all') return true;
    return h.category === selectedCategory;
  });

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newHabit: HabitItem = {
      id: `habit-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newTarget,
      category: newCategory,
      completed: false,
      streak: 1,
      timeTarget: newTarget,
    };
    onAddHabit(newHabit);
    setNewTitle('');
    setShowAddForm(false);
  };

  const waterTarget = 2500;
  const waterPercent = Math.min(100, Math.round((waterIntake / waterTarget) * 100));

  return (
    <div className="flex flex-col gap-6 pb-20 text-stone-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium text-stone-400">Circadian Protocols</div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-100 font-display">
            Daily Habits & Rhythm
          </h1>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold shadow-sm transition-transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Horizontal Date Scroller */}
      <div className="flex items-center justify-between gap-1 p-1.5 rounded-2xl bg-stone-900/90 border border-stone-800">
        {daysOfWeek.map((d) => {
          const isSelected = selectedDay === d.dayNumber;
          return (
            <button
              key={d.dayNumber}
              onClick={() => setSelectedDay(d.dayNumber)}
              className={`flex-1 py-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-stone-100 text-stone-950 shadow-md font-semibold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider">{d.dayName}</span>
              <span className="text-sm font-bold tabular-nums mt-0.5">{d.dayNumber}</span>
              {d.isToday && (
                <span
                  className={`w-1 h-1 rounded-full mt-1 ${
                    isSelected ? 'bg-amber-600' : 'bg-amber-400'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Vital Metric Cards: Hydration & Movement */}
      <div className="grid grid-cols-2 gap-3">
        {/* Hydration Tracker */}
        <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-300">Hydration</span>
            <Droplets className="w-4 h-4 text-sky-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold tracking-tight text-stone-100 font-display tabular-nums">
              {(waterIntake / 1000).toFixed(2)}
              <span className="text-xs font-normal text-stone-400 ml-1">L</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              Goal: {(waterTarget / 1000).toFixed(1)}L · {waterPercent}%
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden mb-3">
            <div
              className="h-full bg-sky-400 rounded-full transition-all duration-300"
              style={{ width: `${waterPercent}%` }}
            />
          </div>
          {/* Quick Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onUpdateWater(-250)}
              className="flex-1 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors cursor-pointer"
            >
              -250ml
            </button>
            <button
              onClick={() => onUpdateWater(250)}
              className="flex-1 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-medium border border-sky-500/30 transition-colors cursor-pointer"
            >
              +250ml
            </button>
          </div>
        </div>

        {/* Movement Tracker */}
        <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-300">Movement</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold tracking-tight text-stone-100 font-display tabular-nums">
              42
              <span className="text-xs font-normal text-stone-400 ml-1">min</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Target: 60 min · 70%</div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden mb-3">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: '70%' }} />
          </div>
          <div className="text-[11px] text-stone-400 flex items-center justify-between py-1">
            <span>Pilates & Barre</span>
            <span className="text-emerald-400 font-medium">On Track</span>
          </div>
        </div>
      </div>

      {/* Visual Feature Card: Studio Movement */}
      <div className="rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 relative">
        <div className="h-32 w-full overflow-hidden relative">
          <img
            src="/src/assets/images/fitness_movement_session_1792230965837.jpg"
            alt="Pilates rib stall decompression"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />
        </div>
        <div className="p-3.5">
          <div className="text-[11px] font-medium text-amber-400">Featured Movement Protocol</div>
          <div className="text-sm font-bold text-stone-100 mt-0.5">
            Thoracic Spine & Stall Bar Mobility
          </div>
          <div className="text-xs text-stone-400 mt-1">
            Improves natural diaphragm expansion for deep belly breathing.
          </div>
        </div>
      </div>

      {/* Add Habit Form Modal/Drawer */}
      {showAddForm && (
        <form
          onSubmit={handleCreateHabit}
          className="p-4 rounded-2xl bg-stone-900 border border-amber-500/40 flex flex-col gap-3 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-100 font-display">
              Create Custom Protocol
            </span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-stone-400 hover:text-stone-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Habit title (e.g. 10m Cold Splash, Journaling)..."
            className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
            autoFocus
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={newCategory}
              onChange={(e) =>
                setNewCategory(e.target.value as 'mind' | 'body' | 'hydration' | 'sleep')
              }
              className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-300 focus:outline-none"
            >
              <option value="mind">Mind & Breath</option>
              <option value="body">Body Movement</option>
              <option value="hydration">Hydration</option>
              <option value="sleep">Rest & Sleep</option>
            </select>
            <input
              type="text"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              placeholder="Target (e.g. 15 min, 08:00 AM)"
              className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-colors cursor-pointer"
          >
            Save Habit Protocol
          </button>
        </form>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-stone-900 rounded-xl border border-stone-800 overflow-x-auto">
        {(['all', 'mind', 'body', 'hydration', 'sleep'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-stone-800 text-stone-100 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Habits List */}
      <div className="flex flex-col gap-2.5">
        {filteredHabits.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800/80 hover:border-stone-700 transition-colors group"
          >
            <button
              onClick={() => onToggleHabit(habit.id)}
              className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer"
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-all ${
                  habit.completed
                    ? 'bg-amber-500 border-amber-400 text-stone-950'
                    : 'border-stone-700 bg-stone-800/80 text-transparent group-hover:border-stone-500'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-xs font-semibold truncate ${
                    habit.completed ? 'text-stone-500 line-through' : 'text-stone-100'
                  }`}
                >
                  {habit.title}
                </div>
                <div className="text-[11px] text-stone-500 truncate mt-0.5">
                  {habit.timeTarget || habit.subtitle}
                </div>
              </div>
            </button>

            <div className="flex items-center gap-2.5 shrink-0 pl-2">
              <span className="text-xs font-mono tabular-nums text-stone-400">
                {habit.streak}d streak
              </span>
              <button
                onClick={() => onDeleteHabit(habit.id)}
                className="opacity-0 group-hover:opacity-100 text-stone-500 hover:text-rose-400 transition-opacity p-1 cursor-pointer"
                aria-label={`Delete ${habit.title}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
