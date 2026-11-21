import React from 'react';
import { ShoppingBag, Search, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { IndustryTheme } from '../types/theme';

interface NavbarProps {
  activeView: 'store' | 'admin';
  setActiveView: (view: 'store' | 'admin') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectCategory?: (slug: string) => void;
  theme: IndustryTheme;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  searchQuery,
  setSearchQuery,
  onSelectCategory,
  theme,
}) => {
  const { itemCount, toggleCart } = useCart();

  return (
    <>
      {/* Top Luxury Announcement Ticker */}
      <div className="w-full bg-neutral-950 text-neutral-300 text-[11px] font-medium tracking-[0.2em] uppercase py-2 px-4 text-center border-b border-white/10">
        <span>Complimentary Express Shipping On Orders Over $150 • Worldwide Delivery</span>
      </div>

      {/* Main Luxury Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveView('store')}
              className="flex items-center gap-2 group text-left"
            >
              <span className={`${theme.fontClass} text-2xl sm:text-3xl font-bold tracking-tight text-foreground`}>
                {theme.brandName}
              </span>
            </button>

            {/* Editorial Category Links (Desktop) */}
            {activeView === 'store' && (
              <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                <button
                  onClick={() => onSelectCategory && onSelectCategory('all')}
                  className="hover:text-foreground transition-colors"
                >
                  All
                </button>
                {theme.categories.map((c) => (
                  <button
                    key={c.title}
                    onClick={() => onSelectCategory && onSelectCategory(c.slug)}
                    className="hover:text-foreground transition-colors"
                  >
                    {c.title}
                  </button>
                ))}
              </nav>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4">
            {/* Search Input */}
            {activeView === 'store' && (
              <div className="relative hidden sm:block w-44 lg:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary/50 hover:bg-secondary focus:bg-background border border-border/50 rounded-none pl-9 pr-3 py-1.5 text-xs tracking-wide focus:outline-none focus:border-foreground transition-all"
                />
              </div>
            )}

            {/* Admin Switcher */}
            <button
              onClick={() => setActiveView(activeView === 'store' ? 'admin' : 'store')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold border border-border bg-secondary/40 hover:bg-secondary text-foreground transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{activeView === 'store' ? 'Admin' : 'Store'}</span>
            </button>

            {/* Shopping Bag Trigger */}
            {activeView === 'store' && (
              <button
                onClick={toggleCart}
                aria-label="Open Shopping Bag"
                className="relative p-2 text-foreground hover:opacity-75 transition-opacity flex items-center justify-center"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
