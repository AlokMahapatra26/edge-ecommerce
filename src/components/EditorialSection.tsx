import React from 'react';
import { ArrowRight } from 'lucide-react';

export const EditorialSection: React.FC = () => {
  return (
    <section className="border-t border-border/60 bg-neutral-950 text-white py-20 sm:py-28 my-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Editorial Image */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
              alt="Atelier Craftsmanship"
              className="w-full h-full object-cover object-center brightness-90"
            />
            <div className="absolute inset-0 border border-white/10 pointer-events-none" />
          </div>

          {/* Editorial Story Text */}
          <div className="space-y-6">
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 font-semibold">
              The Philosophy
            </p>

            <h2 className="font-editorial text-4xl sm:text-5xl font-normal tracking-tight text-white leading-tight">
              Crafted Without Compromise. <br />
              <span className="italic">Built to Last Generations.</span>
            </h2>

            <p className="text-sm text-neutral-300 font-light leading-relaxed">
              Every piece in our catalog is engineered through meticulous prototyping. We source custom-milled French terry cotton, aerospace-grade titanium, and vegetable-tanned leather to produce garments and gear that age with dignity.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-6 border-t border-white/10 text-xs">
              <div>
                <p className="font-editorial text-2xl font-normal text-white">100%</p>
                <p className="text-neutral-400 mt-1 uppercase tracking-wider text-[10px]">
                  Organic Materials
                </p>
              </div>
              <div>
                <p className="font-editorial text-2xl font-normal text-white">0-Waste</p>
                <p className="text-neutral-400 mt-1 uppercase tracking-wider text-[10px]">
                  Pattern Engineering
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
