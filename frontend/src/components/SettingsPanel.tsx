"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { X, Save, User, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { user } = useUser();
  const [githubUsername, setGithubUsername] = useState('');
  const [alertEmail, setAlertEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/users?clerkId=${user.id}&t=${Date.now()}`, { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data && data.githubUsername) setGithubUsername(data.githubUsername);
          if (data && data.alertEmail) {
            setAlertEmail(data.alertEmail);
          } else {
            setAlertEmail(user.primaryEmailAddress?.emailAddress || '');
          }
        })
        .catch(err => console.error("Failed to load user preferences", err));
    }
  }, [user?.id]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user?.id,
          githubUsername: githubUsername.trim(),
          alertEmail: alertEmail.trim()
        })
      });
      if (res.ok) {
        setSaveStatus('success');
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/20 dark:bg-slate-950/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-3xl shadow-xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-outfit font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Alert Settings
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl">
            <p className="text-sm text-blue-800 dark:text-blue-200/80 leading-relaxed">
              Link your GitHub username to automatically route PR alerts to your preferred email address.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              GitHub Username
            </label>
            <input 
              type="text"
              placeholder="e.g. SinisterNycto"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              Alert Email Address
            </label>
            <input 
              type="email"
              value={alertEmail}
              onChange={(e) => setAlertEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || !githubUsername || !alertEmail}
            className="mt-2 w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:shadow-none"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                {saveStatus === 'success' ? 'Saved Successfully!' : 'Save Preferences'}
              </>
            )}
          </button>
          
          {saveStatus === 'error' && (
            <p className="text-rose-400 text-sm text-center">Failed to save preferences. Please try again.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
