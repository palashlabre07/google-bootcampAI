import React, { useState } from 'react';
import { SoundSession } from '../types';
import { Play, Pause, Bookmark, Volume2, Sparkles, Sliders, RefreshCw } from 'lucide-react';

interface ScreenExploreProps {
  sessions: SoundSession[];
  activeSession: SoundSession | null;
  isPlaying: boolean;
  onPlaySession: (session: SoundSession) => void;
  onTogglePlay: () => void;
  onToggleBookmark: (id: string) => void;
  volume: number;
  onVolumeChange: (val: number) => void;
}

export const ScreenExplore: React.FC<ScreenExploreProps> = ({
  sessions,
  activeSession,
  isPlaying,
  onPlaySession,
  onTogglePlay,
  onToggleBookmark,
  volume,
  onVolumeChange,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Soundscapes', 'Breath', 'Sleep', 'Movement'];

  const filteredSessions = sessions.filter((s) => {
    const matchesCat = selectedFilter === 'All' || s.category === selectedFilter;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 pb-28 text-stone-100">
      {/* Header */}
      <div>
        <div className="text-xs font-medium text-stone-400">Acoustic Neuro-Attunement</div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-100 font-display mt-0.5">
          Soundscapes & Breath
        </h1>
        <div className="text-xs text-stone-400 mt-1">
          Binaural acoustic textures engineered to lower heart-rate variability friction.
        </div>
      </div>

      {/* Persistent Now Playing Bar if active */}
      {activeSession && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 backdrop-blur-md shadow-lg flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[11px] font-semibold tracking-wider text-amber-300 uppercase">
                Acoustic Frequency Active
              </span>
            </div>
            <span className="text-xs font-mono text-stone-400 tabular-nums">
              {activeSession.durationMin}:00
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-800 shrink-0 border border-amber-500/30">
              <img
                src={activeSession.image}
                alt={activeSession.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-stone-100 truncate">
                {activeSession.title}
              </div>
              <div className="text-[11px] text-stone-400 truncate">
                {activeSession.instructor}
              </div>
            </div>
            <button
              onClick={onTogglePlay}
              className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer shadow-md"
              aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-stone-950" />
              ) : (
                <Play className="w-4 h-4 fill-stone-950 translate-x-0.5" />
              )}
            </button>
          </div>

          {/* Volume slider */}
          <div className="flex items-center gap-3 pt-2 border-t border-amber-500/20">
            <Volume2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              aria-label="Volume slider"
            />
            <span className="text-[10px] font-mono text-stone-400 tabular-nums w-8 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search soundscapes, frequencies, or guides..."
          className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              selectedFilter === cat
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 gap-3.5">
        {filteredSessions.map((session) => {
          const isCurrentActive = activeSession?.id === session.id;
          return (
            <div
              key={session.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                isCurrentActive
                  ? 'bg-stone-900 border-amber-500/60 shadow-md'
                  : 'bg-stone-900/60 border-stone-800/80 hover:border-stone-700'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-950 shrink-0 border border-stone-800">
                  <img
                    src={session.image}
                    alt={session.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-stone-950/20" />
                  <button
                    onClick={() => onPlaySession(session)}
                    className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-stone-900/90 hover:bg-amber-500 hover:text-stone-950 text-stone-100 flex items-center justify-center transition-all shadow-md cursor-pointer"
                    aria-label={`Play ${session.title}`}
                  >
                    {isCurrentActive && isPlaying ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5 translate-x-0.5 fill-current" />
                    )}
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-amber-400 tracking-wider">
                        {session.category}
                      </span>
                      <h3 className="text-xs font-bold text-stone-100 truncate mt-0.5 font-display">
                        {session.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => onToggleBookmark(session.id)}
                      className={`p-1 text-stone-500 hover:text-stone-300 transition-colors cursor-pointer ${
                        session.isBookmarked ? 'text-amber-400' : ''
                      }`}
                      aria-label="Bookmark session"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          session.isBookmarked ? 'fill-amber-400' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-[11px] text-stone-400 line-clamp-2 mt-1">
                    {session.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2 pt-2 border-t border-stone-800/60">
                    <span className="truncate">{session.instructor}</span>
                    <span className="tabular-nums font-mono shrink-0 ml-2">
                      {session.durationMin}m · {session.playsCount} plays
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
