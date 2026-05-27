/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BadgeCheck, 
  ShieldAlert, 
  Lock, 
  ArrowRight, 
  RefreshCw, 
  Sparkles, 
  HelpCircle, 
  Building2, 
  User 
} from 'lucide-react';
import { ProfileCore, ActiveScreen } from '../types';
import { DEFAULT_PROFILE } from '../data';

interface OnboardingProps {
  onSave: (formData: ProfileCore) => void;
}

export default function Onboarding({ onSave }: OnboardingProps) {
  // Populate form with default design standard data
  const [formData, setFormData] = useState<ProfileCore>(DEFAULT_PROFILE);
  const [submitting, setSubmitting] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  const handleChange = (field: keyof ProfileCore, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setShowStatus(true);
      onSave(formData);
    }, 1500);
  };

  return (
    <div className="flex-1 font-sans text-on-surface bg-transparent">
      <div className="max-w-3xl mx-auto">
        
        {/* Progress Tracker (Screen 2 Progress Bar) */}
        <div className="mb-10 w-full animate-in fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center w-full justify-between mb-8">
            
            {/* Step 1: Active */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center font-bold mb-2 shadow-[0_0_15px_rgba(78,222,163,0.4)]">
                1
              </div>
              <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest whitespace-nowrap">Profile Core</span>
            </div>

            {/* Connector */}
            <div className="flex-1 h-[1px] bg-zinc-800 mx-4" />

            {/* Step 2: Upcoming */}
            <div className="flex flex-col items-center opacity-40">
              <div className="w-8 h-8 rounded-full bg-surface-container border border-border-dark flex items-center justify-center text-on-surface font-bold mb-2">
                2
              </div>
              <span className="text-[10px] font-mono text-on-surface-variant font-medium uppercase tracking-widest whitespace-nowrap">Assets</span>
            </div>

            {/* Connector */}
            <div className="flex-1 h-[1px] bg-zinc-800 mx-4" />

            {/* Step 3: Upcoming */}
            <div className="flex flex-col items-center opacity-40">
              <div className="w-8 h-8 rounded-full bg-surface-container border border-border-dark flex items-center justify-center text-on-surface font-bold mb-2">
                3
              </div>
              <span className="text-[10px] font-mono text-on-surface-variant font-medium uppercase tracking-widest whitespace-nowrap">Review</span>
            </div>

          </div>
        </div>

        {/* Form headers */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-sans font-bold text-white mb-2 tracking-tight">Setup your Hybrid Profile</h1>
          <p className="text-sm text-on-surface-variant max-w-xl leading-relaxed">
            Configure both sides of your professional identity. Your talent profile will be visible to hirers, while your company details will be used for hiring others.
          </p>
        </div>

        {/* Submission notification popover */}
        <AnimatePresence>
          {showStatus && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary text-xs font-semibold flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4" />
                <span>Onboarding profile synchronized successfully! Active as both Creator and Enterprise Client.</span>
              </div>
              <button 
                onClick={() => setShowStatus(false)}
                className="text-primary hover:text-white font-mono uppercase font-black tracking-widest text-[9px]"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Core Bento Card form container */}
        <div className="bg-surface-container/60 border border-outline-variant rounded-xl overflow-hidden shadow-xl">
          <form onSubmit={handleSubmit} className="divide-y divide-outline-variant">
            
            {/* Section 1: Freelancer Details */}
            <div className="p-bento-padding space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Freelancer Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-on-surface-variant font-bold uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="e.g. Alex Sterling"
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors focus:ring-0"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-on-surface-variant font-bold uppercase tracking-wider block">Specialized Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g. Senior Creative Technologist"
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors focus:ring-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-on-surface-variant font-bold uppercase tracking-wider block">Hourly Rate (INR)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-semibold">₹</span>
                    <input
                      type="number"
                      required
                      value={formData.hourlyRate || ''}
                      onChange={(e) => handleChange('hourlyRate', Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full bg-surface-container border border-outline-variant rounded-lg pl-8 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors focus:ring-0"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-on-surface-variant font-bold uppercase tracking-wider block">Skills (Comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={formData.skills}
                    onChange={(e) => handleChange('skills', e.target.value)}
                    placeholder="React, Node.js, WebGL..."
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Company Details */}
            <div className="p-bento-padding space-y-4 bg-surface-container-low/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Company / Client Profile Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-on-surface-variant font-bold uppercase tracking-wider block">Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    placeholder="e.g. Sterling Creative Labs"
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors focus:ring-0"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-on-surface-variant font-bold uppercase tracking-wider block">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleChange('industry', e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors focus:ring-0 appearance-none cursor-pointer"
                  >
                    <option value="Technology &amp; SaaS">Technology &amp; SaaS</option>
                    <option value="Design &amp; Creative">Design &amp; Creative</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="E-commerce">E-commerce</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-on-surface-variant font-bold uppercase tracking-wider block">Website URL</label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => handleChange('websiteUrl', e.target.value)}
                  placeholder="https://yourcompany.com"
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors focus:ring-0"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-on-surface-variant font-bold uppercase tracking-wider block">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  placeholder="Describe your company scope and standard contracts you hire..."
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors focus:ring-0 resize-none"
                />
              </div>
            </div>

            {/* Action Area */}
            <div className="p-bento-padding flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                <Lock className="w-4 h-4 text-primary" />
                <span>Your data is secured with AES-256 escrow encryption blocks.</span>
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-neutral-200 text-background font-bold rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Setup...</span>
                  </>
                ) : (
                  <>
                    <span>Submit &amp; Onboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
