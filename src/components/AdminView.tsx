import React, { useState, useEffect } from 'react';
import { DollarSign, Package, ShoppingCart, RefreshCw, CheckCircle, LogOut, ShieldCheck } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import type { Order } from '../types';
import { AdminLogin } from './AdminLogin';

export const AdminView: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<{ email: string } | null>(null);

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

  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  // Check auth session on load
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth/me');
      if (res.ok) {
        const data = await res.json<{ authenticated: boolean; user?: { email: string } }>();
        if (data.authenticated && data.user) {
          setIsAuthenticated(true);
          setAdminUser(data.user);
          fetchOverview();
          return;
        }
      }
      setIsAuthenticated(false);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const fetchOverview = async () => {
    try {
      const res = await fetch('/api/admin/overview');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load admin overview', err);
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
        fetchOverview();
      }
    } catch (err) {
      console.error('Seed error', err);
    } finally {
      setSeeding(false);
    }
  };

  // If loading session check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono animate-pulse">
          Verifying Edge Session...
        </p>
      </div>
    );
  }

  // If not authenticated, render Login Screen
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={(user) => {
          setIsAuthenticated(true);
          setAdminUser(user);
          fetchOverview();
        }}
      />
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in">
      {/* Header */}
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
          <span>Cloudflare D1 database successfully seeded with 6 sample catalog items and categories!</span>
        </div>
      )}

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
          <div className="text-3xl font-black text-foreground">{stats.totalProducts}</div>
          <span className="text-[11px] text-muted-foreground">Variants & inventory synchronized</span>
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
  );
};
