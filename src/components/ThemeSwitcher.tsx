import React from 'react';
import { Layers, Sparkles } from 'lucide-react';
import { INDUSTRY_THEMES, type ThemeId } from '../types/theme';

interface ThemeSwitcherProps {
  currentTheme: ThemeId;
  onThemeChange: (themeId: ThemeId) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  return (
    <aside
      aria-label="Industry Template Switcher"
      className="fixed bottom-6 right-6 z-50 bg-neutral-950/90 backdrop-blur-md text-white border border-white/20 shadow-2xl p-2 sm:p-2.5 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="flex items-center gap-1.5 pl-2 text-xs font-bold text-neutral-300">
        <Layers className="w-4 h-4 text-amber-400" />
        <span className="hidden sm:inline">Industry Template:</span>
      </div>

      <div className="flex items-center gap-1">
        {(Object.keys(INDUSTRY_THEMES) as ThemeId[]).map((id) => {
          const theme = INDUSTRY_THEMES[id];
          const isSelected = currentTheme === id;

          return (
            <button
              key={id}
              onClick={() => onThemeChange(id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-white text-black shadow-md font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {id === 'fashion' && 'Streetwear'}
              {id === 'tech' && 'Tech Hardware'}
              {id === 'beauty' && 'Skincare'}
              {id === 'coffee' && 'Coffee'}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
