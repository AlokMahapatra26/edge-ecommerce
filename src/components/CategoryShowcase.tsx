import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CategoryShowcaseProps {
  onSelectCategory: (slug: string) => void;
}

const CATEGORY_TILES = [
  {
    title: 'Footwear',
    slug: 'footwear',
    subtitle: 'Carbon Plate Performance',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Apparel',
    slug: 'apparel',
    subtitle: '500 GSM Heavy Loopback',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Timepieces',
    slug: 'accessories',
    subtitle: 'Mechanical Precision',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Studio Audio',
    slug: 'tech',
    subtitle: 'Beryllium Acoustics',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
  },
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
            Explore by Category
          </h2>
        </div>
        <p className="text-xs text-muted-foreground max-w-xs mt-2 md:mt-0 font-light">
          Each capsule is developed through extensive material research and precision craftsmanship.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORY_TILES.map((tile) => (
          <div
            key={tile.slug}
            onClick={() => onSelectCategory(tile.slug)}
            className="group relative h-96 rounded-none overflow-hidden cursor-pointer bg-neutral-900"
          >
            <img
              src={tile.image}
              alt={tile.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 brightness-[0.8] group-hover:brightness-[0.9]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-300 font-semibold mb-1">
                  {tile.subtitle}
                </p>
                <h3 className="font-editorial text-2xl font-normal tracking-wide">
                  {tile.title}
                </h3>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
