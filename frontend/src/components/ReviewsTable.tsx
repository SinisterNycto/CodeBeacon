import { Review } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export default function ReviewsTable({ 
  reviews, 
  onSelectReview 
}: { 
  reviews: Review[], 
  onSelectReview: (r: Review) => void 
}) {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-sm border-b border-white/10 uppercase tracking-wider font-semibold">
              <th className="py-4 px-6 font-medium">PR Title</th>
              <th className="py-4 px-6 font-medium">Repository</th>
              <th className="py-4 px-6 font-medium">Author</th>
              <th className="py-4 px-6 font-medium">Verdict</th>
              <th className="py-4 px-6 font-medium">Issues</th>
              <th className="py-4 px-6 font-medium">Reviewed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {reviews.map((review) => (
              <tr 
                key={review.id} 
                onClick={() => onSelectReview(review)}
                className="hover:bg-white/5 cursor-pointer transition-all duration-200 group"
              >
                <td className="py-4 px-6 text-white font-medium truncate max-w-[250px] group-hover:text-blue-300 transition-colors" title={review.prTitle}>
                  #{review.prNumber} {review.prTitle}
                </td>
                <td className="py-4 px-6 text-gray-400">{review.repoName}</td>
                <td className="py-4 px-6 text-gray-400">{review.prAuthor}</td>
                <td className="py-4 px-6">
                  <VerdictBadge verdict={review.verdict} />
                </td>
                <td className="py-4 px-6 text-gray-400">
                  {review.issueCount}
                </td>
                <td className="py-4 px-6 text-gray-400 whitespace-nowrap text-sm">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  No PR reviews found yet. Waiting for webhooks...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VerdictBadge({ verdict }: { verdict: string }) {
  let color = 'bg-gray-500/10 text-gray-400 border-gray-500/30 shadow-[0_0_10px_rgba(107,114,128,0.2)]';
  
  if (verdict === 'APPROVE') {
    color = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
  } else if (verdict === 'REQUEST_CHANGES') {
    color = 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]';
  } else if (verdict === 'COMMENT') {
    color = 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
  }

  return (
    <span className={`px-3 py-1.5 text-xs font-bold tracking-wide rounded-full border backdrop-blur-md transition-all ${color}`}>
      {verdict.replace('_', ' ')}
    </span>
  );
}
