"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Waypoints } from "lucide-react";
import { login } from "./actions";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorStatus(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    
    if (result?.error) {
      setErrorStatus(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-background">
      {/* Background Liquid Light Orbs */}
      <div className="fixed top-0 right-[20%] w-[500px] h-[500px] rounded-full pointer-events-none z-0 blur-[80px] opacity-30 bg-primary/20 text-white will-change-transform transform-gpu" />
      <div className="fixed bottom-0 left-[10%] w-[600px] h-[600px] rounded-full pointer-events-none z-0 blur-[80px] opacity-20 bg-gradient-to-tr from-accent/20 to-primary/10 will-change-transform transform-gpu" />

      {/* Login Container */}
      <motion.main
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Card */}
        <div className="glass-panel border-border/50 rounded-[2.5rem] p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-6 shadow-lg shadow-primary/30">
              <Waypoints className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-heading font-extrabold text-3xl text-foreground tracking-tight mb-2 drop-shadow-sm">
              MarketPro
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold">Admin Portal</p>
          </div>

          {/* Login Form */}
          {errorStatus && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-center">
               <p className="text-xs text-destructive font-bold">{errorStatus}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1"
              >
                Work Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@marketpro.com"
                  className="w-full bg-white/50 border border-border/50 rounded-xl py-3.5 pl-11 pr-4 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); alert("Please contact IT support to reset your password."); }}
                  className="text-[10px] text-primary hover:text-primary/80 transition-colors font-bold uppercase tracking-wider"
                >
                  Recover Access
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/50 border border-border/50 rounded-xl py-3.5 pl-11 pr-11 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & SSO */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded-lg border border-border/50 bg-white/50 text-primary focus:ring-primary/20 focus:ring-offset-0 transition-all cursor-pointer"
                />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-medium">Stay signed in</span>
              </label>
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                  SSO Active
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="group w-full rounded-2xl bg-primary py-4 px-6 flex items-center justify-center space-x-3 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="font-heading font-extrabold text-sm text-primary-foreground relative z-10">
                  {isLoading ? "Validating Session..." : "Sign In to Portal"}
                </span>
                {!isLoading && (
                  <ArrowRight className="w-4 h-4 text-primary-foreground group-hover:translate-x-1 transition-transform relative z-10" />
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center border-t border-border/50 pt-6">
            <p className="text-xs text-muted-foreground font-medium">
              Require assistance?{" "}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); alert("IT Support: it@marketpro.com"); }}
                className="text-primary hover:text-primary/80 transition-colors font-bold"
              >
                Contact IT Support
              </button>
            </p>
            <div className="mt-4 flex items-center justify-center space-x-4 opacity-50">
              <div className="h-px flex-1 bg-border/50" />
              <span className="text-[10px] text-muted-foreground tracking-[0.3em] font-bold uppercase whitespace-nowrap">
                Secure Env v2.4
              </span>
              <div className="h-px flex-1 bg-border/50" />
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
