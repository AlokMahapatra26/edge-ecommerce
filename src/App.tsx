import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminView } from './components/AdminView';
import { CartProvider } from './context/CartContext';
import { SEED_PRODUCTS, SEED_CATEGORIES } from './db/seed-data';
import type { Product, Category } from './types';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [activeView, setActiveView] = useState<'store' | 'admin'>('store');
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS as any);
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch products from Edge API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = new URL('/api/products', window.location.origin);
      if (selectedCategory !== 'all') {
        url.searchParams.set('category', selectedCategory);
      }
      if (searchQuery) {
        url.searchParams.set('search', searchQuery);
      }

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json<{ products: Product[] }>();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else if (selectedCategory === 'all' && !searchQuery) {
          // If D1 is empty on initial run, fall back to seed data
          setProducts(SEED_PRODUCTS as any);
        } else {
          setProducts([]);
        }
      }
    } catch {
      // In offline/initial dev mode, fallback to SEED_PRODUCTS
      let filtered = SEED_PRODUCTS as any;
      if (selectedCategory !== 'all') {
        const cat = SEED_CATEGORIES.find((c) => c.slug === selectedCategory);
        if (cat) filtered = filtered.filter((p: any) => p.categoryId === cat.id);
      }
      if (searchQuery) {
        filtered = filtered.filter((p: any) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {activeView === 'admin' ? (
        <main className="flex-1">
          <AdminView />
        </main>
      ) : (
        <main className="flex-1">
          {/* Hero Section */}
          <Hero
            onExplore={() => {
              const el = document.getElementById('catalog');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Catalog Section */}
          <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            {/* Category Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-border/50">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  Featured Collection
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Curated minimalist drops • Edge distributed across 300+ PoPs
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                    selectedCategory === 'all'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All Items
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                      selectedCategory === cat.slug
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="mt-8">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-border/40 p-4 space-y-4 animate-pulse bg-secondary/20"
                    >
                      <div className="aspect-square w-full rounded-xl bg-secondary/50" />
                      <div className="h-4 bg-secondary/60 rounded w-3/4" />
                      <div className="h-3 bg-secondary/40 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto text-xl">
                    🔍
                  </div>
                  <h3 className="font-bold text-base text-foreground">No matching products found</h3>
                  <p className="text-xs text-muted-foreground">
                    Try adjusting your category filter or search keywords.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      )}

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Product Quick View Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Global Footer */}
      <footer className="border-t border-border/50 bg-secondary/20 py-10 mt-16 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-foreground">
            Lumina Commerce — 100% Cloudflare Native Turnkey E-Commerce
          </p>
          <p>
            Powered by Cloudflare Workers • D1 SQLite Database • R2 Storage • Stripe Checkout
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
