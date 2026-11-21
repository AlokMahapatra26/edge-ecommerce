import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: { email: string }) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json<{ success?: boolean; user?: { email: string }; error?: string }>();

      if (res.ok && data.user) {
        onLoginSuccess(data.user);
      } else {
        setError(data.error || 'Invalid admin credentials');
      }
    } catch {
      setError('Unable to authenticate with Edge Worker. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-none shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-neutral-950 text-white flex items-center justify-center mx-auto mb-4 border border-white/20">
            <Lock className="w-5 h-5 stroke-[1.5]" />
          </div>
          <h2 className="font-editorial text-3xl font-normal text-foreground tracking-tight">
            Admin Authentication
          </h2>
          <p className="text-xs text-muted-foreground font-light">
            Enter your credentials to access store backoffice and Cloudflare D1
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground block">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="admin@edgecommerce.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-none pl-9 pr-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground block">
              Master Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-none pl-9 pr-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-foreground text-background font-bold text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Edge Worker...</span>
              </>
            ) : (
              <>
                <span>Enter Backoffice</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Footer Note */}
        <div className="pt-4 border-t border-border/50 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>HttpOnly Cookie Session • Protected by Web Crypto</span>
          </div>
        </div>
      </div>
    </div>
  );
};
