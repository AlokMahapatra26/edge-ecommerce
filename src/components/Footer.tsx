import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/70 bg-background text-foreground pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border/50">
          {/* Brand Info */}
          <div className="space-y-4">
            <span className="font-editorial text-2xl font-bold tracking-tight">
              EDGE COMMERCE
            </span>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Timeless everyday luxury engineered for motion, silence, and durability.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              Collections
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground font-light">
              <li className="hover:text-foreground cursor-pointer">Footwear</li>
              <li className="hover:text-foreground cursor-pointer">Apparel</li>
              <li className="hover:text-foreground cursor-pointer">Timepieces</li>
              <li className="hover:text-foreground cursor-pointer">Studio Acoustics</li>
            </ul>
          </div>

          {/* Client Services */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              Client Care
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground font-light">
              <li className="hover:text-foreground cursor-pointer">Order Tracking</li>
              <li className="hover:text-foreground cursor-pointer">Shipping & Returns</li>
              <li className="hover:text-foreground cursor-pointer">Sustainability</li>
              <li className="hover:text-foreground cursor-pointer">Contact Atelier</li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              Private Access
            </p>
            <p className="text-xs text-muted-foreground font-light">
              Subscribe to unlock private drops and private showroom invites.
            </p>
            <div className="flex items-center border border-border">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent px-3 py-2 text-xs focus:outline-none"
              />
              <button
                aria-label="Subscribe"
                className="p-2.5 bg-foreground text-background hover:opacity-80 transition-opacity"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <p>© 2026 EDGE COMMERCE. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="hover:underline cursor-pointer">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
