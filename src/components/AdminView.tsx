import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Package,
  ShoppingCart,
  RefreshCw,
  CheckCircle,
  LogOut,
  Plus,
  Trash2,
  FolderTree,
  X,
  Loader2,
  Layers,
} from 'lucide-react';
import { formatPrice } from '../lib/utils';
import type { Order, Product, Category } from '../types';
import { AdminLogin } from './AdminLogin';

type AdminTab = 'overview' | 'products' | 'categories';

export const AdminView: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<{ email: string; name?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Overview stats
  const [stats, setStats] = useState<{
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    recentOrders: Order[];
  }>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    recentOrders: [],
  });

  // Products and Categories lists
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  // Add Product Form State
  const [prodTitle, setProdTitle] = useState('');
  const [prodPriceDollars, setProdPriceDollars] = useState('');
  const [prodComparePriceDollars, setProdComparePriceDollars] = useState('');
  const [prodCategoryId, setProdCategoryId] = useState<number | ''>('');
  const [prodImage, setProdImage] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodFeatured, setProdFeatured] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  // Add Category Form State
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  // Seeding state
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  // Check auth session on load
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth/me');
      if (res.ok) {
        const data = await res.json<{ authenticated: boolean; user?: { email: string; name?: string } }>();
        if (data.authenticated && data.user) {
          setIsAuthenticated(true);
          setAdminUser(data.user);
          loadAllData();
          return;
        }
      }
      setIsAuthenticated(false);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const loadAllData = async () => {
    fetchOverview();
    fetchProducts();
    fetchCategories();
  };

  const fetchOverview = async () => {
    try {
      const res = await fetch('/api/admin/overview');
      if (res.ok) {
        const data = await res.json<{
          totalRevenue: number;
          totalOrders: number;
          totalProducts: number;
          recentOrders: Order[];
        }>();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load admin overview', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json<{ products: Product[] }>();
        setProductsList(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json<{ categories: Category[] }>();
        setCategoriesList(data.categories || []);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } finally {
      setIsAuthenticated(false);
      setAdminUser(null);
    }
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    setSeedSuccess(false);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      if (res.ok) {
        setSeedSuccess(true);
        loadAllData();
      }
    } catch (err) {
      console.error('Seed error', err);
    } finally {
      setSeeding(false);
    }
  };

  // Add Product Submit Handler
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle || !prodPriceDollars) return;

    setSavingProduct(true);
    try {
      const basePrice = Math.round(parseFloat(prodPriceDollars) * 100);
      const compareAtPrice = prodComparePriceDollars
        ? Math.round(parseFloat(prodComparePriceDollars) * 100)
        : null;

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: prodTitle,
          basePrice,
          compareAtPrice,
          categoryId: prodCategoryId ? Number(prodCategoryId) : null,
          primaryImage: prodImage || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
          description: prodDescription,
          featured: prodFeatured,
        }),
      });

      if (res.ok) {
        setShowAddProductModal(false);
        // Reset form
        setProdTitle('');
        setProdPriceDollars('');
        setProdComparePriceDollars('');
        setProdCategoryId('');
        setProdImage('');
        setProdDescription('');
        setProdFeatured(false);
        // Refresh data
        loadAllData();
      } else {
        alert('Failed to save product to Cloudflare D1');
      }
    } catch (err) {
      console.error('Error adding product', err);
    } finally {
      setSavingProduct(false);
    }
  };

  // Delete Product Handler
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product from Cloudflare D1?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadAllData();
      }
    } catch (err) {
      console.error('Delete product error', err);
    }
  };

  // Add Category Submit Handler
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;

    setSavingCategory(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: catName,
          description: catDescription,
        }),
      });

      if (res.ok) {
        setShowAddCategoryModal(false);
        setCatName('');
        setCatDescription('');
        loadAllData();
      } else {
        alert('Failed to save category');
      }
    } catch (err) {
      console.error('Error adding category', err);
    } finally {
      setSavingCategory(false);
    }
  };

  // Delete Category Handler
  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to remove this category?')) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadAllData();
      }
    } catch (err) {
      console.error('Delete category error', err);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono animate-pulse">
          Verifying Edge Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={(user) => {
          setIsAuthenticated(true);
          setAdminUser(user);
          loadAllData();
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-mono tracking-wider text-muted-foreground uppercase">
              Authenticated: {adminUser?.email}
            </span>
          </div>
          <h1 className="font-editorial text-3xl font-normal text-foreground tracking-tight">
            Store Backoffice
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="flex items-center gap-2 px-4 py-2 rounded-none bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs uppercase tracking-wider border border-border transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
            <span>{seeding ? 'Seeding D1...' : 'Seed Catalog to D1'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-none bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-xs uppercase tracking-wider border border-red-500/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {seedSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>Cloudflare D1 database successfully seeded with sample products & categories!</span>
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-px">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Overview & Orders</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'products'
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products ({productsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'categories'
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Categories ({categoriesList.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & RECENT ORDERS */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 border border-border/60 bg-card shadow-sm space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-black text-foreground">
                {formatPrice(stats.totalRevenue)}
              </div>
              <span className="text-[11px] text-muted-foreground">Settled through Stripe edge webhook</span>
            </div>

            <div className="p-6 border border-border/60 bg-card shadow-sm space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                <ShoppingCart className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-3xl font-black text-foreground">{stats.totalOrders}</div>
              <span className="text-[11px] text-muted-foreground">Logged in Cloudflare D1 tables</span>
            </div>

            <div className="p-6 border border-border/60 bg-card shadow-sm space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold uppercase tracking-wider">Active Products</span>
                <Package className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-3xl font-black text-foreground">{productsList.length}</div>
              <span className="text-[11px] text-muted-foreground">Saved in SQLite D1</span>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="border border-border/60 bg-card overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border/50">
              <h3 className="font-bold text-base text-foreground">Recent Customer Orders</h3>
              <p className="text-xs text-muted-foreground">Live transactions saved in SQLite at the edge</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/40 text-muted-foreground font-bold uppercase tracking-wider border-b border-border/40">
                  <tr>
                    <th className="px-6 py-3">Order Number</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Payment</th>
                    <th className="px-6 py-3">Fulfillment</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-medium">
                  {stats.recentOrders && stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4 font-bold text-foreground">{order.orderNumber}</td>
                        <td className="px-6 py-4">{order.customerName}</td>
                        <td className="px-6 py-4 font-black text-foreground">{formatPrice(order.totalAmount)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase ${
                            order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase bg-secondary text-foreground">
                            {order.fulfillmentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                        No orders logged in D1 yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CATALOG MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg text-foreground">Product Catalog</h2>
              <p className="text-xs text-muted-foreground">Manage your store's items, pricing, and categories</p>
            </div>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-foreground text-background font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="border border-border/60 bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/40 text-muted-foreground font-bold uppercase tracking-wider border-b border-border/40">
                  <tr>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-medium">
                  {productsList.length > 0 ? (
                    productsList.map((prod) => {
                      const cat = categoriesList.find((c) => c.id === prod.categoryId);
                      return (
                        <tr key={prod.id} className="hover:bg-secondary/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.primaryImage}
                                alt={prod.title}
                                className="w-10 h-10 object-cover bg-secondary border border-border"
                              />
                              <div>
                                <p className="font-bold text-foreground">{prod.title}</p>
                                <p className="text-[11px] text-muted-foreground font-mono">/{prod.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {cat ? cat.name : 'Unassigned'}
                          </td>
                          <td className="px-6 py-4 font-bold text-foreground">
                            {formatPrice(prod.basePrice)}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 font-bold text-[10px] uppercase">
                              Active
                            </span>
                            {prod.featured && (
                              <span className="ml-2 px-2 py-0.5 bg-amber-500/10 text-amber-600 font-bold text-[10px] uppercase">
                                Featured
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground space-y-2">
                        <Package className="w-8 h-8 mx-auto text-muted-foreground/50" />
                        <p className="font-bold">No products created yet</p>
                        <p className="text-xs">Click "Add New Product" to create your first item in Cloudflare D1.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg text-foreground">Product Categories</h2>
              <p className="text-xs text-muted-foreground">Group your products into catalog departments</p>
            </div>

            <button
              onClick={() => setShowAddCategoryModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-foreground text-background font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="border border-border/60 bg-card overflow-hidden shadow-sm max-w-3xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 text-muted-foreground font-bold uppercase tracking-wider border-b border-border/40">
                <tr>
                  <th className="px-6 py-3">Category Name</th>
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium">
                {categoriesList.length > 0 ? (
                  categoriesList.map((cat) => (
                    <tr key={cat.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4 font-bold text-foreground">{cat.name}</td>
                      <td className="px-6 py-4 font-mono text-muted-foreground">/{cat.slug}</td>
                      <td className="px-6 py-4 text-muted-foreground">{cat.description || '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground space-y-2">
                      <FolderTree className="w-8 h-8 mx-auto text-muted-foreground/50" />
                      <p className="font-bold">No categories created yet</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddProductModal(false)} />

          <div className="relative w-full max-w-xl bg-card border border-border p-6 sm:p-8 shadow-2xl z-10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-editorial text-2xl font-normal text-foreground">Add New Product</h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="p-1 hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-muted-foreground block">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heavyweight Loopback Hoodie"
                  value={prodTitle}
                  onChange={(e) => setProdTitle(e.target.value)}
                  className="w-full bg-secondary/50 border border-border px-3 py-2 text-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-muted-foreground block">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="98.00"
                    value={prodPriceDollars}
                    onChange={(e) => setProdPriceDollars(e.target.value)}
                    className="w-full bg-secondary/50 border border-border px-3 py-2 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-muted-foreground block">
                    Compare Price (Sale)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="120.00"
                    value={prodComparePriceDollars}
                    onChange={(e) => setProdComparePriceDollars(e.target.value)}
                    className="w-full bg-secondary/50 border border-border px-3 py-2 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-muted-foreground block">
                  Category
                </label>
                <select
                  value={prodCategoryId}
                  onChange={(e) => setProdCategoryId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-secondary/50 border border-border px-3 py-2 text-foreground focus:outline-none focus:border-foreground"
                >
                  <option value="">Select a Category</option>
                  {categoriesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-muted-foreground block">
                  Primary Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full bg-secondary/50 border border-border px-3 py-2 text-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-muted-foreground block">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe materials, sizing, and details..."
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  className="w-full bg-secondary/50 border border-border px-3 py-2 text-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={prodFeatured}
                  onChange={(e) => setProdFeatured(e.target.checked)}
                  className="w-4 h-4 accent-foreground"
                />
                <label htmlFor="featuredToggle" className="font-semibold text-foreground cursor-pointer">
                  Feature this item on homepage
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 border border-border text-muted-foreground hover:text-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-6 py-2 bg-foreground text-background font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  {savingProduct && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save to D1</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CATEGORY */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddCategoryModal(false)} />

          <div className="relative w-full max-w-md bg-card border border-border p-6 sm:p-8 shadow-2xl z-10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-editorial text-2xl font-normal text-foreground">Add Category</h3>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="p-1 hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-muted-foreground block">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Outerwear"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full bg-secondary/50 border border-border px-3 py-2 text-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-muted-foreground block">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weatherproof jackets and coats"
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  className="w-full bg-secondary/50 border border-border px-3 py-2 text-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 border border-border text-muted-foreground hover:text-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="px-6 py-2 bg-foreground text-background font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  {savingCategory && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save to D1</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
