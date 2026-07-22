"use client";

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Terminal, Radio } from 'lucide-react';
import Link from 'next/link';
import { useAuth, SignInButton } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LandingPage() {
  const { userId, isLoaded } = useAuth();

  return (
    <main className="min-h-screen bg-[#F4F4F0] text-slate-900 font-sans dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300 overflow-x-hidden">
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#2A4D3E] to-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] dark:shadow-[0_0_20px_rgba(52,211,153,0.4)]">
            <Radio className="w-5 h-5 text-white animate-pulse" />
            <div className="absolute inset-0 rounded-xl bg-emerald-400/30 animate-ping" style={{ animationDuration: '3s' }}></div>
          </div>
          <span className="font-[family-name:var(--font-outfit)] font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white transition-all">
            Code<span className="text-[#2A4D3E] dark:text-emerald-400">Beacon</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <ThemeToggle />
          {isLoaded && userId ? (
            <Link href="/dashboard" className="text-sm font-semibold border-b-2 border-[#2A4D3E] dark:border-emerald-400 pb-1">Dashboard</Link>
          ) : (
            <span className="text-sm font-semibold text-slate-400 cursor-not-allowed">Dashboard</span>
          )}
          <a href="https://github.com/SinisterNycto/ReviewPilot" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2">
            Source Code
          </a>
        </div>

        {isLoaded && userId ? (
          <Link href="/dashboard" className="bg-[#2A4D3E] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1f3a2f] transition-all shadow-md flex items-center gap-2">
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <SignInButton mode="modal" signUpFallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
            <button className="bg-[#2A4D3E] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1f3a2f] transition-all shadow-md flex items-center gap-2">
              Sign In
            </button>
          </SignInButton>
        )}
      </nav>

      <section className="max-w-4xl mx-auto px-6 mt-20 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-[family-name:var(--font-outfit)] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
        >
          Ship cleaner code, faster. <br />
          Let AI <span className="font-[family-name:var(--font-playfair)] italic font-normal text-[#2A4D3E] dark:text-emerald-400">handle the review.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          CodeBeacon autonomously intercepts your pull requests via webhooks, using Gemini 2.5 Flash to instantly identify security flaws and architectural anti-patterns directly on GitHub.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {isLoaded && userId ? (
            <Link href="/dashboard" className="bg-[#2A4D3E] text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-[#1f3a2f] transition-all shadow-lg flex items-center gap-2">
              View Analytics Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <SignInButton mode="modal" signUpFallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
              <button className="bg-[#2A4D3E] text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-[#1f3a2f] transition-all shadow-lg flex items-center gap-2">
                Access Dashboard
              </button>
            </SignInButton>
          )}
          <a href={process.env.NEXT_PUBLIC_GITHUB_APP_URL || "https://github.com/apps/codebeacon-by-swastik"} target="_blank" rel="noreferrer" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-full text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
            Install GitHub App
          </a>
        </motion.div>

        {/* Live Webhook Interceptor Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 max-w-3xl mx-auto text-left"
        >
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Mock Window Header */}
            <div className="bg-slate-50 dark:bg-[#1e293b] px-4 py-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="mx-auto text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Terminal className="w-3 h-3" /> codebeacon-worker
              </div>
            </div>
            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <div className="text-emerald-600 dark:text-emerald-400">➜ <span className="text-blue-600 dark:text-blue-400 font-semibold">[CodeBeacon]</span> Listening for GitHub Webhooks on /api/webhook...</div>
              <div className="mt-2 text-slate-500 dark:text-slate-400">2026-07-06T14:32:01.002Z - Event received: pull_request.opened</div>
              <div className="mt-2 text-emerald-600 dark:text-emerald-400">➜ <span className="text-blue-600 dark:text-blue-400 font-semibold">[CodeBeacon]</span> Repository: SinisterNycto/upi-offline-mesh</div>
              <div className="mt-1">Extracting diff (3 files changed, +142 -12 lines)...</div>
              <div className="mt-2 flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <span className="animate-pulse">[SYSTEM]</span> Sending payload to Gemini 2.5 Flash API...
              </div>
              <div className="mt-4 border-l-2 border-orange-500 pl-4 py-1 text-orange-800 dark:text-orange-200 bg-orange-50 dark:bg-orange-500/10 rounded-r-md">
                <span className="font-bold text-orange-600 dark:text-orange-400">CRITICAL ALERT:</span> Zero-trust encryption payload vulnerability detected in `Encryption.ts` (Line 42). Missing authentication tag verification.
              </div>
              <div className="mt-4 text-emerald-600 dark:text-emerald-400">➜ <span className="text-blue-600 dark:text-blue-400 font-semibold">[CodeBeacon]</span> Injecting inline review comment into GitHub PR...</div>
              <div className="mt-1 text-green-600 dark:text-green-400 font-semibold">[SUCCESS] Review successfully posted in 1.4s. Analysis complete.</div>
            </div>
          </div>
        </motion.div>
      </section>

      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-4xl mx-auto px-6 mt-32 pb-24"
      >
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2A4D3E] dark:text-emerald-400">System Architecture</span>
          <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-outfit)] font-extrabold text-slate-900 dark:text-white mt-2">Data Flow Pipeline</h2>
        </div>
        
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#2A4D3E]/30 dark:via-emerald-500/30 to-transparent -translate-x-1/2"></div>
          
          <div className="flex flex-col gap-12">
            {/* Step 1 */}
            <div className="relative flex flex-col md:flex-row items-center w-full group">
              <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-[#2A4D3E] dark:bg-emerald-400 border-4 border-[#F4F4F0] dark:border-slate-950 -translate-x-1/2 z-10 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <div className="md:w-1/2 md:pr-12 pl-16 md:pl-0 w-full md:text-right">
                <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-transform group-hover:-translate-y-1 relative">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Step 1</span>
                  <h3 className="font-[family-name:var(--font-outfit)] font-bold text-xl mb-2 text-slate-900 dark:text-white">Webhook Interception</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Securely verifies HMAC-SHA256 signatures and extracts PR metadata in real-time from GitHub.</p>
                </div>
              </div>
              <div className="md:w-1/2 hidden md:block"></div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col md:flex-row-reverse items-center w-full group">
              <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-orange-500 border-4 border-[#F4F4F0] dark:border-slate-950 -translate-x-1/2 z-10 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
              <div className="md:w-1/2 md:pl-12 pl-16 md:pr-0 w-full text-left">
                <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-transform group-hover:-translate-y-1 relative">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-2 block">Step 2</span>
                  <h3 className="font-[family-name:var(--font-outfit)] font-bold text-xl mb-2 text-slate-900 dark:text-white">Semantic Analysis</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Streams diff chunks to Gemini 2.5 Flash for deep context-aware code review and vulnerability detection.</p>
                </div>
              </div>
              <div className="md:w-1/2 hidden md:block"></div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col md:flex-row items-center w-full group">
              <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-blue-500 border-4 border-[#F4F4F0] dark:border-slate-950 -translate-x-1/2 z-10 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              <div className="md:w-1/2 md:pr-12 pl-16 md:pl-0 w-full md:text-right">
                <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-transform group-hover:-translate-y-1 relative">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-2 block">Step 3</span>
                  <h3 className="font-[family-name:var(--font-outfit)] font-bold text-xl mb-2 text-slate-900 dark:text-white">Action & Integration</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Posts formatted inline comments back to GitHub, dispatches email alerts via Resend, and commits history to Postgres.</p>
                </div>
              </div>
              <div className="md:w-1/2 hidden md:block"></div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="mt-12 py-16 bg-white dark:bg-[#0b1121] border-t border-slate-200 dark:border-slate-800 text-center rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] transition-colors">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-8 opacity-80 hover:opacity-100 transition-opacity">
            <Radio className="w-5 h-5 text-[#2A4D3E] dark:text-emerald-400" />
            <span className="font-[family-name:var(--font-outfit)] font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              Code<span className="text-[#2A4D3E] dark:text-emerald-400">Beacon</span>
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-8">
            <a href="https://github.com/SinisterNycto/ReviewPilot" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">Documentation</a>
            <a href="mailto:swastik.negi2005@gmail.com" className="hover:text-slate-900 dark:hover:text-white transition-colors">Support</a>
            <a href="https://www.linkedin.com/in/swastik-negi/" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">Social</a>
          </div>

          <p className="text-[10px] font-medium tracking-wider uppercase text-slate-400 dark:text-slate-500">
            © 2026 CodeBeacon AI. Autonomous & Sophisticated Reviewing.
          </p>
        </div>
      </footer>
    </main>
  );
}
