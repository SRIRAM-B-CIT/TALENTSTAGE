/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  ChevronRight, 
  Workflow, 
  ShieldCheck, 
  Zap, 
  Briefcase, 
  ArrowRight, 
  Sparkles, 
  DollarSign, 
  Calendar, 
  Clock 
} from 'lucide-react';
import { ActiveScreen } from '../types';

interface LandingPageProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  // Dynamic stats
  const [talentsCount, setTalentsCount] = useState(5475);
  const [latency, setLatency] = useState(232);
  const [sysNominal, setSysNominal] = useState(true);

  // Scoping Engine preview state
  const [briefInput, setBriefInput] = useState('');
  const [isScoping, setIsScoping] = useState(false);
  const [scopedResult, setScopedResult] = useState<any | null>(null);

  // Dynamic values updating interval
  useEffect(() => {
    const statsInterval = setInterval(() => {
      setTalentsCount(prev => prev + Math.floor(Math.random() * 5) - 2);
      setLatency(prev => {
        const delta = Math.floor(Math.random() * 20) - 10;
        const newVal = prev + delta;
        return newVal > 180 && newVal < 300 ? newVal : prev;
      });
      // Occasionally toggle system nominal visual state
      if (Math.random() > 0.95) {
        setSysNominal(false);
        setTimeout(() => setSysNominal(true), 2000);
      }
    }, 4000);

    return () => clearInterval(statsInterval);
  }, []);

  // Submit Scoping request
  const handleScopeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!briefInput.trim() || isScoping) return;

    setIsScoping(true);
    setScopedResult(null);

    try {
      const response = await fetch('/api/scope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief: briefInput }),
      });

      if (response.ok) {
        const data = await response.json();
        setScopedResult(data);
      } else {
        console.error('Scoping failed');
      }
    } catch (err) {
      console.error('Error during scope request:', err);
    } finally {
      setIsScoping(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface select-none">
      <main className="pt-28 pb-24 px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-24 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE INTELLIGENT STAGE FOR ELITE CREATORS</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-sans font-bold text-white mb-6 tracking-tighter leading-tight"
          >
            The Intelligent Stage for <span className="text-primary">Elite Creators</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed font-sans"
          >
            Precision-matched talent discovery powered by our proprietary Scoping Engine. Build the future with AI-verified professionals in the world&apos;s most curated creator economy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button
              onClick={() => onNavigate('onboarding')}
              className="bg-primary text-on-primary px-8 py-4 rounded-xl font-sans text-base font-bold hover:brightness-110 shadow-[0_0_20px_rgba(78,222,163,0.25)] hover:shadow-[0_0_35px_rgba(78,222,163,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started - Join Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('marketplace')}
              className="border border-outline-variant text-on-surface px-8 py-4 rounded-xl font-sans text-base hover:bg-surface-container-low transition-all active:scale-95 cursor-pointer"
            >
              Explore Open Projects
            </button>
          </motion.div>
        </section>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Live LPU Data Monitor (Span 4) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-4 bg-surface-container-lowest border border-border-dark p-bento-padding rounded-xl flex flex-col justify-between min-h-[300px] hover:border-zinc-700 transition-colors"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-primary w-4 h-4" />
                <span className="font-mono text-[11px] text-primary uppercase tracking-widest font-semibold">Live LPU Data</span>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="text-3xl font-sans font-bold text-white tracking-tight" id="talent-count">
                    {talentsCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-on-surface-variant">Verified Talents Online</div>
                </div>
                <div>
                  <div className="text-3xl font-sans font-bold text-primary tracking-tight">
                    {latency}ms
                  </div>
                  <div className="text-xs text-on-surface-variant">Avg Match Latency</div>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-border-dark">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${sysNominal ? 'bg-emerald-500 animate-ping' : 'bg-amber-400'}`} />
                <span className={`font-mono text-[10px] uppercase font-bold tracking-wider ${sysNominal ? 'text-emerald-500' : 'text-amber-400'}`}>
                  {sysNominal ? 'System Nominal' : 'Calibrating Sync'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Interactive AI Scoping Engine Preview (Span 8) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="md:col-span-8 bg-surface-container border border-border-dark p-bento-padding rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[340px] hover:border-zinc-700 transition-colors"
          >
            <div className="relative z-10 w-full">
              <span className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3 block font-bold">Engine Preview</span>
              <h3 className="text-xl font-bold text-white mb-2 font-sans tracking-tight">AI Scoping Engine</h3>
              <p className="text-xs text-on-surface-variant max-w-md mb-6 leading-relaxed">
                Input your crude brief or role concept below. Our AI decompiles unstructured notes into an authoritative technical proposal.
              </p>

              <form onSubmit={handleScopeSubmit} className="flex gap-2 max-w-2xl">
                <input
                  type="text"
                  value={briefInput}
                  onChange={(e) => setBriefInput(e.target.value)}
                  placeholder="e.g., Create a high-fidelity Ethereum validator dashboard with WebSockets"
                  className="flex-1 bg-surface-container-lowest text-on-surface border border-outline-variant rounded-lg px-4 py-3 placeholder:text-zinc-600 text-sm focus:outline-none focus:border-primary transition-all"
                />
                <button
                  type="submit"
                  disabled={isScoping || !briefInput.trim()}
                  className="bg-primary hover:brightness-110 text-on-primary font-bold px-5 rounded-lg text-sm transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isScoping ? (
                    <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Scope</span>
                      <Workflow className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Scoped Result Display */}
              <AnimatePresence mode="wait">
                {scopedResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 p-4 bg-surface-container-lowest border border-outline-variant rounded-lg font-sans w-full max-w-2xl animate-in fade-in"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded uppercase font-semibold">
                        {scopedResult.category}
                      </span>
                      <span className="text-[11px] font-mono text-on-surface-variant font-bold">
                        {scopedResult.level}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">{scopedResult.title}</h4>
                    <p className="text-[11px] text-zinc-400 mb-3">{scopedResult.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t border-border-dark">
                      <div>
                        <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider block mb-1">Estimated Budget</span>
                        <span className="text-primary font-mono font-bold">
                          ${scopedResult.estimateMin.toLocaleString()} - ${scopedResult.estimateMax.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider block mb-1">Proposed Timeline</span>
                        <span className="text-white font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary" /> {scopedResult.duration}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border-dark">
                      <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider block mb-2">Technical Deliverables</span>
                      <ul className="text-[11px] space-y-1 text-on-surface-variant">
                        {scopedResult.technicalRequirements?.map((req: string, idx: number) => (
                          <li key={idx} className="flex gap-2 items-start">
                            <span className="text-primary">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          </motion.div>

          {/* Feature Showcase: Automated Quality Audits (Span 6) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="md:col-span-6 bg-surface-container-lowest border border-border-dark p-bento-padding rounded-xl flex flex-col justify-between hover:border-zinc-700 transition-colors"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Automated Quality Audits</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Before code or milestones are finalized, our autonomous AI validation layer tests the deliverables against your predefined prompt boundaries.
              </p>
            </div>

            <div className="mt-6 p-4 bg-surface-container rounded-lg border border-outline-variant/60 font-mono text-[10px] text-emerald-500/90">
              <div className="flex justify-between items-center mb-2">
                <span className="animate-pulse">ANALYZING_PROJECT_X...</span>
                <span className="font-bold">COMPLETE</span>
              </div>
              <div className="w-full h-1 bg-surface-container-lowest rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          </motion.div>

          {/* Freelancer Console Card (Span 6) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="md:col-span-6 bg-surface-container border border-border-dark p-bento-padding rounded-xl flex flex-col justify-between relative overflow-hidden hover:border-zinc-700 transition-colors group"
          >
            <div className="space-y-4 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-primary">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Freelancer Console</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Managing a premium, independent creator business should not feel like administrative friction. Manage transactions, track ledger logs, and trigger automated audits.
              </p>
            </div>

            <div className="pt-8">
              <button
                onClick={() => onNavigate('freelancer-console')}
                className="bg-white hover:bg-neutral-200 text-background px-5 py-2.5 rounded-lg text-xs font-bold font-sans transition-all flex items-center gap-2 group-hover:scale-[1.02] cursor-pointer"
              >
                <span>View Dashboard Demo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl" />
          </motion.div>

        </div>
      </main>
    </div>
  );
}
