import React from 'react';
import type { IndustryTheme } from '../types/theme';
import { PlaceholderImage } from './PlaceholderImage';

interface EditorialSectionProps {
  theme: IndustryTheme;
}

export const EditorialSection: React.FC<EditorialSectionProps> = ({ theme }) => {
  return (
    <section className="border-t border-border/60 bg-neutral-950 text-white py-20 sm:py-24 my-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Blueprint Asset Frame */}
          <div className="relative w-full">
            <PlaceholderImage
              label="Brand Story Artwork"
              dimensions="1200 × 1500"
              aspect="aspect-[4/5]"
            />
          </div>

          {/* Editorial Story Text */}
          <div className="space-y-6">
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 font-semibold">
              The Philosophy
            </p>

            <h2 className={`${theme.fontClass} text-4xl sm:text-5xl font-normal tracking-tight text-white leading-tight`}>
              {theme.storyTitle} <br />
              <span className="italic">{theme.storySubtitle}</span>
            </h2>

            <p className="text-sm text-neutral-300 font-light leading-relaxed">
              {theme.storyDescription}
            </p>

            <div className="pt-4 grid grid-cols-2 gap-6 border-t border-white/10 text-xs">
              <div>
                <p className={`${theme.fontClass} text-2xl font-normal text-white`}>
                  {theme.stat1Number}
                </p>
                <p className="text-neutral-400 mt-1 uppercase tracking-wider text-[10px]">
                  {theme.stat1Label}
                </p>
              </div>
              <div>
                <p className={`${theme.fontClass} text-2xl font-normal text-white`}>
                  {theme.stat2Number}
                </p>
                <p className="text-neutral-400 mt-1 uppercase tracking-wider text-[10px]">
                  {theme.stat2Label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
