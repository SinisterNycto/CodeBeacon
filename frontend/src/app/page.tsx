"use client";

import { useEffect, useState } from 'react';
import StatsRow from '@/components/StatsRow';
import ReviewsTable from '@/components/ReviewsTable';
import ReviewDetail from '@/components/ReviewDetail';
import { Review, Stats } from '@/types';
import { RefreshCw, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const [reviewsRes, statsRes] = await Promise.all([
        fetch('/api/reviews'),
        fetch('/api/stats')
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30 seconds auto-refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-transparent text-white p-6 md:p-12 font-sans selection:bg-blue-500/30">
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
              <h1 className="text-4xl font-outfit font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400">AI PR Reviewer</h1>
              <p className="text-blue-100/60 mt-1 font-medium tracking-wide">Autonomous GitHub Code Review Agent</p>
            </div>
          </div>
          <button 
            onClick={fetchData}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all text-sm font-semibold tracking-wide disabled:opacity-50 shadow-lg active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : 'text-blue-300'}`} />
            Refresh
          </button>
        </motion.header>

        <StatsRow stats={stats} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <h2 className="text-xl font-outfit font-bold mb-5 text-white/90 flex items-center gap-3">
            Recent Reviews
            <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></span>
          </h2>
          <ReviewsTable reviews={reviews} onSelectReview={setSelectedReview} />
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedReview && (
          <ReviewDetail 
            review={selectedReview} 
            onClose={() => setSelectedReview(null)} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}
