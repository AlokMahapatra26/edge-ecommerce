import React from 'react';
import { ShoppingBag, Search, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  activeView: 'store' | 'admin';
  setActiveView: (view: 'store' | 'admin') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  searchQuery,
  setSearchQuery,
}) => {
  const { itemCount, toggleCart } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveView('store')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-lg shadow-sm">
              E
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight">EDGE COMMERCE</span>
              <span className="text-xs block text-muted-foreground font-medium -mt-1 tracking-wider uppercase">
                Online Store
              </span>
            </div>
          </button>
        </div>

        {/* Search Bar (Storefront only) */}
        {activeView === 'store' && (
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products (sneakers, watch, hoodie)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/60 hover:bg-secondary focus:bg-background border border-border/60 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        )}

        {/* Right Nav Actions */}
        <div className="flex items-center gap-3">
          {/* Admin Switcher */}
          <button
            onClick={() => setActiveView(activeView === 'store' ? 'admin' : 'store')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-border bg-secondary/50 hover:bg-secondary text-foreground transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{activeView === 'store' ? 'Admin Panel' : 'Storefront'}</span>
          </button>

          {/* Cart Trigger Button */}
          {activeView === 'store' && (
            <button
              onClick={toggleCart}
              aria-label="Open Shopping Cart"
              className="relative p-2.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center shadow-md animate-in fade-in zoom-in">
                  {itemCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
