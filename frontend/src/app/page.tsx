"use client";

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Terminal } from 'lucide-react';
import Link from 'next/link';
import { useAuth, SignInButton } from '@clerk/nextjs';

export default function LandingPage() {
  const { userId, isLoaded } = useAuth();

  return (
    <main className="min-h-screen bg-[#F4F4F0] text-slate-900 font-sans dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300 overflow-x-hidden">
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-outfit)] font-bold text-2xl tracking-tight text-[#2A4D3E] dark:text-emerald-400">CodeBeacon</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
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
              Sign In with GitHub
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
          <span className="text-[#2A4D3E] dark:text-emerald-400">Let AI handle the review.</span>
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
          <div className="bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
            {/* Mock Window Header */}
            <div className="bg-[#1e293b] px-4 py-3 flex items-center gap-2 border-b border-slate-800/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="mx-auto text-[11px] font-medium text-slate-400 flex items-center gap-2">
                <Terminal className="w-3 h-3" /> codebeacon-worker
              </div>
            </div>
            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm leading-relaxed text-slate-300">
              <div className="text-emerald-400">➜ <span className="text-blue-400 font-semibold">[CodeBeacon]</span> Listening for GitHub Webhooks on /api/webhook...</div>
              <div className="mt-2 text-slate-400">2026-07-06T14:32:01.002Z - Event received: pull_request.opened</div>
              <div className="mt-2 text-emerald-400">➜ <span className="text-blue-400 font-semibold">[CodeBeacon]</span> Repository: SinisterNycto/upi-offline-mesh</div>
              <div className="mt-1">Extracting diff (3 files changed, +142 -12 lines)...</div>
              <div className="mt-2 flex items-center gap-2 text-purple-400">
                <span className="animate-pulse">⚡</span> Sending payload to Gemini 2.5 Flash API...
              </div>
              <div className="mt-4 border-l-2 border-orange-500 pl-4 py-1 text-orange-200 bg-orange-500/10 rounded-r-md">
                <span className="font-bold text-orange-400">⚠️ Critical Alert:</span> Zero-trust encryption payload vulnerability detected in `Encryption.ts` (Line 42). Missing authentication tag verification.
              </div>
              <div className="mt-4 text-emerald-400">➜ <span className="text-blue-400 font-semibold">[CodeBeacon]</span> Injecting inline review comment into GitHub PR...</div>
              <div className="mt-1 text-green-400 font-semibold">✓ Review successfully posted in 1.4s. Analysis complete.</div>
            </div>
          </div>
        </motion.div>
      </section>

      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-5xl mx-auto px-6 mt-32 pb-24"
      >
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Architecture</span>
              <h2 className="text-3xl font-[family-name:var(--font-outfit)] font-bold text-slate-900 dark:text-white mt-1">Automated Pipeline</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 dark:bg-slate-800 -z-10 hidden md:block"></div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 relative">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Step 1</span>
                <CheckCircle2 className="w-5 h-5 text-[#2A4D3E] dark:text-emerald-400" />
              </div>
              <h3 className="font-[family-name:var(--font-outfit)] font-bold text-xl mb-2 text-slate-900 dark:text-white">Webhook Interception</h3>
              <p className="text-sm text-slate-500">Securely verifies HMAC-SHA256 signatures and extracts PR metadata in real-time.</p>
            </div>

            <div className="bg-[#fcfaf5] dark:bg-orange-950/20 p-6 rounded-2xl border border-[#e8dfc7] dark:border-orange-900/30 relative shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Step 2</span>
                <div className="w-5 h-5 rounded-full border-2 border-orange-400 border-t-transparent animate-spin"></div>
              </div>
              <h3 className="font-[family-name:var(--font-outfit)] font-bold text-xl mb-2 text-slate-900 dark:text-white">Semantic Analysis</h3>
              <p className="text-sm text-slate-500">Streams diff chunks to Gemini 2.5 Flash for deep context-aware code review.</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 relative">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Step 3</span>
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
              </div>
              <h3 className="font-[family-name:var(--font-outfit)] font-bold text-xl mb-2 text-slate-900 dark:text-white">GitHub Integration</h3>
              <p className="text-sm text-slate-500">Posts formatted inline comments and commits history to the Postgres dashboard.</p>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
