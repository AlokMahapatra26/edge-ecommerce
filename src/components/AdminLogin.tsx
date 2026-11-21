import React, { useState, useEffect } from 'react';
import { Lock, Mail, User, ArrowRight, ShieldCheck, AlertCircle, Loader2, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: { email: string; name?: string }) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [isSetupMode, setIsSetupMode] = useState<boolean | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check whether a Master Admin already exists in Cloudflare D1
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/admin/auth/status');
        if (res.ok) {
          const data = await res.json<{ hasAdmin: boolean }>();
          setIsSetupMode(!data.hasAdmin);
        } else {
          setIsSetupMode(false);
        }
      } catch {
        setIsSetupMode(false);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate confirmation in setup mode
    if (isSetupMode && password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isSetupMode ? '/api/admin/auth/setup' : '/api/admin/auth/login';
      const body = isSetupMode ? { name, email, password } : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json<{ success?: boolean; user?: { email: string; name?: string }; error?: string }>();

      if (res.ok && data.user) {
        onLoginSuccess(data.user);
      } else {
        setError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setError('Connection to Cloudflare Edge Worker failed.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono animate-pulse">
          Connecting to Cloudflare D1...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-none shadow-2xl space-y-6 animate-in fade-in">
        {/* Header Badge */}
        <div className="text-center space-y-2">
          {isSetupMode ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>First-Time Store Setup</span>
            </div>
          ) : (
            <div className="w-12 h-12 bg-neutral-950 text-white flex items-center justify-center mx-auto mb-4 border border-white/20">
              <Lock className="w-5 h-5 stroke-[1.5]" />
            </div>
          )}

          <h2 className="font-editorial text-3xl font-normal text-foreground tracking-tight">
            {isSetupMode ? 'Create Master Admin' : 'Admin Authentication'}
          </h2>
          <p className="text-xs text-muted-foreground font-light">
            {isSetupMode
              ? 'Initialize your new store by creating the primary owner account. This will be securely hashed in Cloudflare D1.'
              : 'Sign in to access your store backoffice, catalog, and live transactions.'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Only in Setup Mode) */}
          {isSetupMode && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-none pl-9 pr-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground block">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="owner@yourstore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-none pl-9 pr-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground block">
              {isSetupMode ? 'Create Password (min 6 chars)' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-none pl-9 pr-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
          </div>

          {/* Confirm Password (Only in Setup Mode) */}
          {isSetupMode && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground block">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-none pl-9 pr-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-foreground text-background font-bold text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Cloudflare D1...</span>
              </>
            ) : (
              <>
                <span>{isSetupMode ? 'Initialize Master Admin' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Footer Note */}
        <div className="pt-4 border-t border-border/50 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>100,000 PBKDF2 Iterations • Stored in SQLite D1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
