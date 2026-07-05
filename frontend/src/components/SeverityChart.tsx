"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from 'next-themes';

import { Review } from '@/types';

export default function SeverityChart({ reviews }: { reviews: Review[] }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Aggregate issue severities across all passed reviews
  const counts: Record<string, number> = {
    critical: 0,
    warning: 0,
    suggestion: 0
  };

  reviews.forEach(review => {
    if (review.issues && Array.isArray(review.issues)) {
      review.issues.forEach(issue => {
        const severity = issue.severity?.toLowerCase();
        if (counts[severity] !== undefined) {
          counts[severity]++;
        }
      });
    }
  });

  const data = [
    { name: 'Critical', count: counts.critical, color: '#f43f5e' }, // rose-500
    { name: 'Warning', count: counts.warning, color: '#f59e0b' },  // amber-500
    { name: 'Suggestion', count: counts.suggestion, color: '#3b82f6' } // blue-500
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-slate-900 dark:text-white font-medium">{payload[0].payload.name}</p>
          <p className="text-slate-600 dark:text-slate-300 text-sm">{payload[0].value} issues found</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke={isDark ? "#94a3b8" : "#64748b"} 
            tick={{ fill: isDark ? '#94a3b8' : '#64748b' }} 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis 
            stroke={isDark ? "#94a3b8" : "#64748b"} 
            tick={{ fill: isDark ? '#94a3b8' : '#64748b' }} 
            axisLine={false} 
            tickLine={false} 
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#1e293b' : '#f1f5f9' }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
