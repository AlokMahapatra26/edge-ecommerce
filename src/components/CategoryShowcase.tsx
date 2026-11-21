import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PlaceholderImage } from './PlaceholderImage';

interface CategoryShowcaseProps {
  onSelectCategory: (slug: string) => void;
}

const CATEGORIES = [
  { title: 'Footwear', slug: 'footwear', label: 'Carbon Plate Series', specs: '800 × 1060' },
  { title: 'Apparel', slug: 'apparel', label: '500 GSM Heavy Loopback', specs: '800 × 1060' },
  { title: 'Timepieces', slug: 'accessories', label: 'Automatic Mechanical', specs: '800 × 1060' },
  { title: 'Studio Audio', slug: 'tech', label: 'Beryllium Acoustics', specs: '800 × 1060' },
];

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onSelectCategory }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-muted-foreground mb-1">
            Curated Lines
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl text-foreground font-normal tracking-tight">
            Explore by Department
          </h2>
        </div>
        <p className="text-xs text-muted-foreground max-w-xs mt-2 md:mt-0 font-light">
          Each capsule is developed through extensive material research and precision craftsmanship.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.title}
            onClick={() => onSelectCategory(cat.slug)}
            className="group relative rounded-none overflow-hidden cursor-pointer border border-border/60 hover:border-foreground/40 transition-colors"
          >
            <PlaceholderImage
              label={cat.title}
              dimensions={cat.specs}
              aspect="aspect-[3/4]"
            />

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between bg-background/85 backdrop-blur-sm p-3 border border-border/50">
              <div>
                <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-semibold">
                  {cat.label}
                </p>
                <h3 className="font-bold text-sm text-foreground tracking-tight">
                  {cat.title}
                </h3>
              </div>
              <div className="w-7 h-7 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
