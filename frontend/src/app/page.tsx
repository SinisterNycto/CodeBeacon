"use client";

import { useEffect, useState } from 'react';
import StatsRow from '@/components/StatsRow';
import ReviewsTable from '@/components/ReviewsTable';
import ReviewDetail from '@/components/ReviewDetail';
import SeverityChart from '@/components/SeverityChart';
import { Review, Stats } from '@/types';
import { RefreshCw, Bot, Filter, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import SettingsPanel from '@/components/SettingsPanel';
import { ThemeToggle } from '@/components/ThemeToggle';
export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();
  const [githubUsername, setGithubUsername] = useState<string | null>(null);
  
  const [verdictFilter, setVerdictFilter] = useState('ALL');
  const [repoFilter, setRepoFilter] = useState('ALL');

  useEffect(() => {
    if (isSignedIn && user?.id) {
      fetch(`/api/users/${user.id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.githubUsername) {
            setGithubUsername(data.githubUsername);
          }
        });
    } else if (isLoaded && !isSignedIn) {
      setGithubUsername(null);
      setReviews([]);
      setStats(null);
    }
  }, [isSignedIn, user?.id, isLoaded]);

  const fetchData = async () => {
    if (!githubUsername) return;
    setIsRefreshing(true);
    try {
      const [reviewsRes, statsRes] = await Promise.all([
        fetch(`/api/reviews?author=${githubUsername}`),
        fetch(`/api/stats?author=${githubUsername}`)
      ]);
      
      if (reviewsRes.ok) setReviews(await reviewsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (githubUsername) {
      fetchData();
      const interval = setInterval(fetchData, 30000); // 30 seconds auto-refresh
      return () => clearInterval(interval);
    }
  }, [githubUsername]);

  const uniqueRepos = useMemo(() => {
    const repos = new Set(reviews.map(r => r.repoName));
    return Array.from(repos);
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchVerdict = verdictFilter === 'ALL' || r.verdict === verdictFilter;
      const matchRepo = repoFilter === 'ALL' || r.repoName === repoFilter;
      return matchVerdict && matchRepo;
    });
  }, [reviews, verdictFilter, repoFilter]);

  const filteredStats = useMemo(() => {
    return {
      totalReviews: filteredReviews.length,
      totalIssues: filteredReviews.reduce((acc, r) => acc + (r.issueCount || 0), 0),
      critical: filteredReviews.reduce((acc, r) => acc + (r.issues?.filter(i => i.severity?.toLowerCase() === 'critical').length || 0), 0),
      warning: filteredReviews.reduce((acc, r) => acc + (r.issues?.filter(i => i.severity?.toLowerCase() === 'warning').length || 0), 0),
      suggestion: filteredReviews.reduce((acc, r) => acc + (r.issues?.filter(i => i.severity?.toLowerCase() === 'suggestion').length || 0), 0)
    };
  }, [filteredReviews]);

  return (
    <main className="min-h-screen bg-transparent p-6 md:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between glass-panel px-8 py-6 rounded-3xl mb-2 gap-4"
        >
          <div className="flex items-center gap-5">
            <div className="p-3.5 bg-blue-500/20 rounded-2xl border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Bot className="w-9 h-9 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            </div>
            <div>
              <h1 className="text-4xl font-outfit font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400">AI PR Reviewer</h1>
              <p className="text-slate-600 dark:text-blue-100/60 mt-1 font-medium tracking-wide">Autonomous GitHub Code Review Agent</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {!isSignedIn && (
              <SignInButton mode="modal">
                <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  Sign In
                </button>
              </SignInButton>
            )}
            
            {isSignedIn && (
              <>
                <ThemeToggle />
                <button 
                  onClick={() => setShowSettings(true)}
                  className="p-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 rounded-xl transition-all shadow-sm active:scale-95"
                  title="Settings"
                >
                  <Settings className="w-5 h-5 text-slate-500 dark:text-blue-300" />
                </button>
                <button 
                  onClick={fetchData}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 dark:hover:border-white/20 rounded-xl transition-all text-sm font-semibold tracking-wide disabled:opacity-50 shadow-sm active:scale-95 text-slate-700 dark:text-white"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-500 dark:text-blue-400' : 'text-slate-500 dark:text-blue-300'}`} />
                  Refresh
                </button>
                <div className="bg-white dark:bg-white/5 p-1.5 rounded-full border border-slate-200 dark:border-white/10 shadow-sm">
                  <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9" } }} />
                </div>
              </>
            )}
          </div>
        </motion.header>

        <StatsRow stats={filteredStats} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Filters Panel */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col justify-center">
            <h3 className="text-lg font-outfit font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
              <Filter className="w-5 h-5 text-blue-500 dark:text-blue-400" /> Filters
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-slate-500 dark:text-slate-400 mb-1 block">Verdict</label>
                <select 
                  value={verdictFilter}
                  onChange={(e) => setVerdictFilter(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                >
                  <option value="ALL">All Verdicts</option>
                  <option value="APPROVE">Approved</option>
                  <option value="REQUEST_CHANGES">Request Changes</option>
                  <option value="COMMENT">Comment Only</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-500 dark:text-slate-400 mb-1 block">Repository</label>
                <select 
                  value={repoFilter}
                  onChange={(e) => setRepoFilter(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                >
                  <option value="ALL">All Repositories</option>
                  {uniqueRepos.map(repo => (
                    <option key={repo} value={repo}>{repo}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Chart Panel */}
          <div className="glass-panel p-6 rounded-3xl lg:col-span-2">
            <h3 className="text-lg font-outfit font-bold mb-4 text-slate-800 dark:text-white">Issue Severity Trends</h3>
            <SeverityChart reviews={filteredReviews} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <h2 className="text-xl font-outfit font-bold mb-5 flex items-center gap-3 text-slate-800 dark:text-white/90">
            Recent Reviews
            <span className="h-px flex-1 bg-gradient-to-r from-slate-200 dark:from-white/10 to-transparent"></span>
          </h2>
          <ReviewsTable reviews={filteredReviews} onSelectReview={setSelectedReview} />
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedReview && (
          <ReviewDetail 
            review={selectedReview} 
            onClose={() => setSelectedReview(null)} 
          />
        )}
        
        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}
