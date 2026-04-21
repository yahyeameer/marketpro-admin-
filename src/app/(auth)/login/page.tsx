"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Waypoints } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Supabase auth integration
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-[#080818]">
      {/* Ambient Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(138, 76, 252, 0.4) 0%, rgba(12, 12, 29, 0) 70%)" }}
      />
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(64, 206, 237, 0.3) 0%, rgba(12, 12, 29, 0) 70%)" }}
      />
      <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] rounded-full blur-[80px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(250, 83, 164, 0.3) 0%, rgba(12, 12, 29, 0) 70%)" }}
      />

      {/* Login Container */}
      <motion.main
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Glassmorphism Card */}
        <div className="bg-white/[0.03] backdrop-blur-[40px] border border-[#474659]/20 rounded-[2rem] p-10 shadow-[0_0_60px_rgba(138,76,252,0.08)]">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.05] border border-[#474659]/15 mb-6 shadow-[0_0_30px_rgba(189,157,255,0.15)]">
              <Waypoints className="w-8 h-8 text-[#bd9dff]" />
            </div>
            <h1 className="font-heading font-bold text-3xl text-[#e6e3fb] tracking-tight mb-2">
              MarketPro
            </h1>
            <p className="text-sm text-[#aba9bf]">Admin Portal</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-medium text-[#aba9bf] uppercase tracking-wider"
              >
                Work Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-[#aba9bf] group-focus-within:text-[#bd9dff] transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@marketpro.com"
                  className="w-full bg-[#111124] border border-[#474659]/30 rounded-xl py-3.5 pl-11 pr-4 text-sm text-[#e6e3fb] placeholder-[#aba9bf]/50 focus:outline-none focus:border-[#53ddfc] focus:ring-1 focus:ring-[#53ddfc]/50 focus:shadow-[0_0_15px_rgba(83,221,252,0.2)] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-[#aba9bf] uppercase tracking-wider"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-[#bd9dff] hover:text-[#ff6daf] transition-colors"
                >
                  Recover Access
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-[#aba9bf] group-focus-within:text-[#bd9dff] transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#111124] border border-[#474659]/30 rounded-xl py-3.5 pl-11 pr-11 text-sm text-[#e6e3fb] placeholder-[#aba9bf]/50 focus:outline-none focus:border-[#53ddfc] focus:ring-1 focus:ring-[#53ddfc]/50 focus:shadow-[0_0_15px_rgba(83,221,252,0.2)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#aba9bf] hover:text-[#e6e3fb]"
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
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border border-[#474659]/40 bg-[#111124] text-[#bd9dff] focus:ring-[#bd9dff]/30 focus:ring-offset-0"
                />
                <span className="text-sm text-[#aba9bf]">Stay signed in</span>
              </label>
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#53ddfc]/10 border border-[#53ddfc]/20">
                <div className="w-1.5 h-1.5 rounded-full bg-[#53ddfc] animate-pulse" />
                <span className="text-[10px] text-[#53ddfc] font-medium uppercase tracking-wider">
                  SSO Active
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#bd9dff] via-[#ff6daf] to-[#53ddfc] p-[1px] group transition-all duration-300 hover:shadow-[0_0_25px_rgba(189,157,255,0.4)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#bd9dff] via-[#ff6daf] to-[#53ddfc] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-full bg-[#0c0c1d]/80 backdrop-blur-md rounded-[11px] py-3.5 px-6 flex items-center justify-center space-x-2 group-hover:bg-transparent transition-colors duration-300">
                  <span className="font-heading font-bold text-sm text-[#e6e3fb] group-hover:text-[#0c0c1d] transition-colors duration-300">
                    {isLoading ? "Signing in..." : "Sign In"}
                  </span>
                  {!isLoading && (
                    <ArrowRight className="w-4 h-4 text-[#e6e3fb] group-hover:text-[#0c0c1d] transition-colors duration-300" />
                  )}
                </div>
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center border-t border-[#474659]/10 pt-6">
            <p className="text-xs text-[#aba9bf]">
              Require assistance?{" "}
              <a
                href="#"
                className="text-[#bd9dff] hover:text-[#b28cff] transition-colors"
              >
                Contact IT Support
              </a>
            </p>
            <div className="mt-4 flex items-center justify-center space-x-4 opacity-50">
              <div className="h-4 border-r border-[#474659]" />
              <span className="text-[10px] text-[#aba9bf] tracking-widest uppercase">
                Secure Env v2.4
              </span>
              <div className="h-4 border-r border-[#474659]" />
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
