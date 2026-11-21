import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryShowcase } from './components/CategoryShowcase';
import { EditorialSection } from './components/EditorialSection';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminView } from './components/AdminView';
import { Footer } from './components/Footer';
import { CartProvider } from './context/CartContext';
import type { Product, Category } from './types';
import { PackageOpen } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [activeView, setActiveView] = useState<'store' | 'admin'>('store');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch categories from D1
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/products/categories');
      if (res.ok) {
        const data = await res.json<{ categories: Category[] }>();
        setCategories(data.categories || []);
      }
    } catch {
      setCategories([]);
    }
  };

  // Fetch products from D1
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
        setProducts(data.products || []);
      } else {
        setProducts([]);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    const catalogEl = document.getElementById('catalog');
    catalogEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={handleCategorySelect}
      />

      {activeView === 'admin' ? (
        <main className="flex-1">
          <AdminView />
        </main>
      ) : (
        <main className="flex-1">
          {/* Flagship Editorial Hero */}
          <Hero
            onExplore={() => {
              const el = document.getElementById('catalog');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Category Showcase Tiles */}
          <CategoryShowcase onSelectCategory={handleCategorySelect} />

          {/* Catalog Section */}
          <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            {/* Catalog Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-border/50">
              <div>
                <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-muted-foreground mb-1">
                  Catalog Inventory
                </p>
                <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-foreground tracking-tight">
                  {selectedCategory === 'all'
                    ? 'All Items'
                    : categories.find((c) => c.slug === selectedCategory)?.name || 'Collection'}
                </h2>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`transition-colors shrink-0 ${
                    selectedCategory === 'all'
                      ? 'text-foreground underline underline-offset-8 decoration-2'
                      : 'hover:text-foreground'
                  }`}
                >
                  All ({products.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`transition-colors shrink-0 ${
                      selectedCategory === cat.slug
                        ? 'text-foreground underline underline-offset-8 decoration-2'
                        : 'hover:text-foreground'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid or Clean Empty State */}
            <div className="mt-10">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-3 animate-pulse">
                      <div className="aspect-[3/4] w-full bg-secondary/50" />
                      <div className="h-4 bg-secondary/60 rounded w-2/3" />
                      <div className="h-3 bg-secondary/40 rounded w-1/3" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-24 space-y-4">
                  <div className="w-16 h-16 bg-secondary/40 border border-border flex items-center justify-center mx-auto text-muted-foreground">
                    <PackageOpen className="w-7 h-7" />
                  </div>
                  <h3 className="font-editorial text-2xl font-normal text-foreground">
                    No Pieces in D1 Database
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto font-light leading-relaxed">
                    The store database is clean and empty. Switch to the <strong>Admin Panel</strong> to add items or seed sample products to Cloudflare D1.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
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

          {/* Editorial Brand Story */}
          <EditorialSection />
        </main>
      )}

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Footer */}
      <Footer />
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
