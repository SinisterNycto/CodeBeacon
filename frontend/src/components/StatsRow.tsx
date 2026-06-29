import { Stats } from '@/types';
import { ShieldAlert, AlertTriangle, Lightbulb, GitPullRequest, Bug } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatsRow({ stats }: { stats: Stats | null }) {
  if (!stats) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
    >
      <StatCard 
        title="PRs Reviewed" 
        value={stats.totalReviews} 
        icon={<GitPullRequest className="w-6 h-6 text-blue-400" />} 
        gradient="from-blue-400 to-indigo-500"
      />
      <StatCard 
        title="Issues Found" 
        value={stats.totalIssues} 
        icon={<Bug className="w-6 h-6 text-purple-400" />} 
        gradient="from-purple-400 to-fuchsia-500"
      />
      <StatCard 
        title="Critical" 
        value={stats.critical} 
        icon={<ShieldAlert className="w-6 h-6 text-rose-400" />} 
        gradient="from-rose-400 to-red-500"
      />
      <StatCard 
        title="Warnings" 
        value={stats.warning} 
        icon={<AlertTriangle className="w-6 h-6 text-amber-400" />} 
        gradient="from-amber-400 to-orange-500"
      />
      <StatCard 
        title="Suggestions" 
        value={stats.suggestion} 
        icon={<Lightbulb className="w-6 h-6 text-cyan-400" />} 
        gradient="from-cyan-400 to-blue-500"
      />
    </motion.div>
  );
}

function StatCard({ title, value, icon, gradient }: { title: string, value: number, icon: React.ReactNode, gradient: string }) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={item}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-panel rounded-2xl p-5 flex items-center justify-between transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:border-white/20"
    >
      <div>
        <p className="text-xs text-gray-400 font-medium tracking-wider uppercase mb-1">{title}</p>
        <p className={`text-4xl font-outfit font-bold text-gradient bg-gradient-to-r ${gradient}`}>
          {value}
        </p>
      </div>
      <div className="p-3 bg-white/5 rounded-xl border border-white/10 shadow-inner">
        {icon}
      </div>
    </motion.div>
  );
}
