import React, { useState } from 'react';
import { Award, Bell, Shield, Download, Sparkles, Moon, Sun, CheckCircle2 } from 'lucide-react';

interface ScreenProfileProps {
  onExportReport: () => void;
}

export const ScreenProfile: React.FC<ScreenProfileProps> = ({ onExportReport }) => {
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(true);
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(true);
  const [reportDownloaded, setReportDownloaded] = useState<boolean>(false);

  const weeklyData = [
    { day: 'Mon', minutes: 45, height: '65%' },
    { day: 'Tue', minutes: 55, height: '80%' },
    { day: 'Wed', minutes: 40, height: '60%' },
    { day: 'Thu', minutes: 60, height: '90%' },
    { day: 'Fri', minutes: 50, height: '75%' },
    { day: 'Sat', minutes: 70, height: '100%' },
    { day: 'Sun', minutes: 35, height: '50%' },
  ];

  const handleExport = () => {
    onExportReport();
    setReportDownloaded(true);
    setTimeout(() => setReportDownloaded(false), 2800);
  };

  return (
    <div className="flex flex-col gap-6 pb-24 text-stone-100">
      {/* Profile Header */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gradient-to-tr from-amber-500 to-amber-200 p-0.5 shrink-0">
          <div className="w-full h-full rounded-full bg-stone-900 flex items-center justify-center text-amber-300 font-display font-bold text-lg">
            ER
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-stone-100 truncate font-display">
              Elena Rostova
            </h1>
            <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">
              Founding Member
            </span>
          </div>
          <div className="text-xs text-stone-400 truncate mt-0.5">
            Circadian Rhythm Protocol · Kyoto &amp; Paris
          </div>
          <div className="text-[11px] text-stone-500 mt-1 tabular-nums">
            Member for 142 days · 18d Current Streak
          </div>
        </div>
      </div>

      {/* Weekly Rhythm Analytics */}
      <div className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-stone-200">
              Weekly Mindfulness Minutes
            </div>
            <div className="text-[11px] text-stone-400">Target: 300 min/week</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-amber-400 font-display tabular-nums">
              355<span className="text-xs font-normal text-stone-400 ml-1">min</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-medium">+18% vs last week</div>
          </div>
        </div>

        {/* Tabular Bar Chart */}
        <div className="h-28 flex items-end justify-between gap-2 pt-4 px-1">
          {weeklyData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <span className="text-[10px] font-mono tabular-nums text-stone-400">
                {d.minutes}m
              </span>
              <div className="w-full bg-stone-800 rounded-t-md h-full flex items-end overflow-hidden max-h-16">
                <div
                  className="w-full bg-amber-500/80 hover:bg-amber-400 transition-all rounded-t-md"
                  style={{ height: d.height }}
                />
              </div>
              <span className="text-[10px] text-stone-400 uppercase">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Milestone Badges */}
      <div className="flex flex-col gap-2.5">
        <h2 className="text-xs font-semibold text-stone-300">Achieved Milestones</h2>
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col items-center text-center">
            <Award className="w-5 h-5 text-amber-400 mb-1" />
            <div className="text-[11px] font-bold text-stone-200">Dawn Pioneer</div>
            <div className="text-[9px] text-stone-400 mt-0.5">14 Sunrises Logged</div>
          </div>
          <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col items-center text-center">
            <CheckCircle2 className="w-5 h-5 text-sky-400 mb-1" />
            <div className="text-[11px] font-bold text-stone-200">Pure Hydration</div>
            <div className="text-[9px] text-stone-400 mt-0.5">50L Logged</div>
          </div>
          <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col items-center text-center">
            <Sparkles className="w-5 h-5 text-emerald-400 mb-1" />
            <div className="text-[11px] font-bold text-stone-200">432Hz Attuned</div>
            <div className="text-[9px] text-stone-400 mt-0.5">25 Soundscapes</div>
          </div>
        </div>
      </div>

      {/* Preferences & Toggles */}
      <div className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800 flex flex-col gap-3">
        <h3 className="text-xs font-semibold text-stone-300">Studio Preferences</h3>

        <div className="flex items-center justify-between py-2 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-stone-400" />
            <div>
              <div className="text-xs font-medium text-stone-200">Circadian Gentle Reminders</div>
              <div className="text-[10px] text-stone-400">Dawn sunlight &amp; evening blue light</div>
            </div>
          </div>
          <button
            onClick={() => setRemindersEnabled(!remindersEnabled)}
            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
              remindersEnabled ? 'bg-amber-500' : 'bg-stone-700'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-stone-950 transition-transform ${
                remindersEnabled ? 'left-5' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-stone-400" />
            <div>
              <div className="text-xs font-medium text-stone-200">Haptic Tap Feedback</div>
              <div className="text-[10px] text-stone-400">Tactile response on ritual check-off</div>
            </div>
          </div>
          <button
            onClick={() => setHapticEnabled(!hapticEnabled)}
            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
              hapticEnabled ? 'bg-amber-500' : 'bg-stone-700'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-stone-950 transition-transform ${
                hapticEnabled ? 'left-5' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Export Data */}
        <div className="pt-2">
          <button
            onClick={handleExport}
            className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{reportDownloaded ? 'Summary Report Exported!' : 'Export Biometric & Ritual Log'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
