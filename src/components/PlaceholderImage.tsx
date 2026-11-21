import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface PlaceholderImageProps {
  label: string;
  dimensions?: string;
  aspect?: string;
  className?: string;
}

export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  label,
  dimensions = '800 × 1000',
  aspect = 'aspect-[3/4]',
  className = '',
}) => {
  return (
    <div
      className={`relative w-full ${aspect} bg-neutral-900/60 dark:bg-neutral-900 border border-neutral-800/80 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden group ${className}`}
    >
      {/* Subtle blueprint grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Wireframe Crosshairs */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/20" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/20" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/20" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/20" />

      {/* Center Icon & Blueprint Metadata */}
      <div className="relative z-10 flex flex-col items-center space-y-2 text-neutral-400 group-hover:text-neutral-200 transition-colors">
        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
          <ImageIcon className="w-4 h-4 stroke-[1.5]" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
          {label}
        </p>
        <span className="text-[10px] tracking-widest text-neutral-500 font-mono">
          [{dimensions}]
        </span>
      </div>
    </div>
  );
};
