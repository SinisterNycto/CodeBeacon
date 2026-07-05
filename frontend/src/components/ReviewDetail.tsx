import { Review, Issue } from '@/types';
import { X, ExternalLink, ShieldAlert, AlertTriangle, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReviewDetail({ 
  review, 
  onClose 
}: { 
  review: Review, 
  onClose: () => void 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/20 dark:bg-black/40 backdrop-blur-md" 
      onClick={onClose}
    >
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-2xl glass-panel h-full overflow-y-auto border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 border-b border-slate-200 dark:border-white/10 flex justify-between items-start bg-slate-50/80 dark:bg-slate-950/40 sticky top-0 z-10 backdrop-blur-xl">
          <div>
            <h2 className="text-3xl font-outfit font-bold text-slate-900 dark:text-white">#{review.prNumber} {review.prTitle}</h2>
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <span className="text-blue-600 dark:text-blue-300">{review.repoName}</span>
              <span className="text-slate-300 dark:text-white/20">•</span>
              <span>by <span className="text-slate-700 dark:text-slate-200">{review.prAuthor}</span></span>
              <span className="text-slate-300 dark:text-white/20">•</span>
              <a 
                href={`https://github.com/${review.repoName}/pull/${review.prNumber}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-500/20"
              >
                View on GitHub <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border border-transparent dark:hover:border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 flex-1">
          <div className="mb-10">
            <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse"></div>
              AI Summary
            </h3>
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl text-slate-700 dark:text-slate-300 text-sm leading-relaxed shadow-sm dark:shadow-inner">
              {review.summary || "No summary provided."}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
              <span>Issues Found</span>
              <span className="bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white px-3 py-1 rounded-full text-xs font-bold">
                {review.issues.length}
              </span>
            </h3>
            
            <div className="space-y-4">
              {review.issues.length === 0 ? (
                <div className="text-center py-16 text-slate-500 dark:text-slate-500 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 border-dashed shadow-sm">
                  <div className="text-4xl mb-4">✨</div>
                  <p className="font-outfit text-lg">No issues found in this PR!</p>
                </div>
              ) : (
                review.issues.map((issue, index) => (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <IssueCard issue={issue} />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function IssueCard({ issue }: { issue: Issue }) {
  let icon = <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
  let colorClass = 'border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-800 dark:text-blue-400 shadow-sm dark:shadow-[0_4px_20px_rgba(59,130,246,0.15)]';
  
  if (issue.severity === 'critical') {
    icon = <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-500" />;
    colorClass = 'border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-400 shadow-sm dark:shadow-[0_4px_20px_rgba(239,68,68,0.15)]';
  } else if (issue.severity === 'warning') {
    icon = <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-yellow-500" />;
    colorClass = 'border-amber-200 dark:border-yellow-500/30 bg-amber-50 dark:bg-yellow-500/10 text-amber-800 dark:text-yellow-400 shadow-sm dark:shadow-[0_4px_20px_rgba(234,179,8,0.15)]';
  }

  return (
    <div className={`border rounded-2xl p-5 backdrop-blur-sm transition-transform hover:-translate-y-1 ${colorClass}`}>
      <div className="flex items-start gap-4">
        <div className="mt-0.5 p-2 bg-white dark:bg-white/5 rounded-xl border border-slate-200/50 dark:border-white/10 shadow-sm">{icon}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-3">
            <div className="font-mono text-xs opacity-90 break-all bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md border border-slate-200 dark:border-transparent">
              {issue.file} <span className="opacity-50 mx-1">|</span> <span className="text-slate-800 dark:text-white/80 font-bold">line {issue.line}</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-90 bg-white/50 dark:bg-white/10 px-2 py-1 rounded-md border border-slate-200 dark:border-transparent">
              {issue.severity}
            </span>
          </div>
          <p className="text-sm text-slate-700 dark:text-gray-200 leading-relaxed font-medium">
            {issue.message}
          </p>
        </div>
      </div>
    </div>
  );
}
