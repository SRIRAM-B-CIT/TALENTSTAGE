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
    <div className="bg-transparent font-sans text-on-surface select-none">
      <main className="pb-24 max-w-7xl mx-auto">
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
                          ₹{scopedResult.estimateMin.toLocaleString()} - ₹{scopedResult.estimateMax.toLocaleString()}
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

        {/* Section: AI Telemetry & Activity Indicator Ticker */}
        <section className="mt-16 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <span className="font-mono text-[10px] text-primary flex items-center gap-1.5 uppercase font-bold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>AI Core Operations Ticker</span>
            </span>
            <span className="text-zinc-500 font-mono text-[11px]">AUTONOMOUS STAGE ENGAGEMENT</span>
          </div>
          <div className="space-y-3 font-mono text-[11.5px] text-zinc-400">
            <div className="flex gap-2 items-start py-1 border-b border-zinc-800/60 leading-normal">
              <span className="text-primary">[11:42 AM]</span>
              <span className="text-zinc-300">Intelligent Scoping Engine drafted a Web3 Infrastructure proposal with 3 milestones (98% match).</span>
            </div>
            <div className="flex gap-2 items-start py-1 border-b border-zinc-800/60 leading-normal">
              <span className="text-primary">[11:30 AM]</span>
              <span className="text-zinc-300">Dynamic credentials verification audit evaluated Priya Nair for crypto multisig smart contract safety.</span>
            </div>
            <div className="flex gap-2 items-start py-1 leading-normal">
              <span className="text-primary">[11:15 AM]</span>
              <span className="text-zinc-300">Simulated secure Escrow contract #TS-2026-642 funded with 10% platform fee deduction logged.</span>
            </div>
          </div>
        </section>

        {/* Section: Featured Elite Creative Talents */}
        <section className="mt-20">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <span className="font-mono text-[10px] text-primary block uppercase font-bold tracking-widest mb-1">CURATED NETWORK</span>
              <h2 className="text-2xl font-bold text-white tracking-tight font-sans">Featured Elite Creators</h2>
            </div>
            <button 
              onClick={() => onNavigate('marketplace')}
              className="text-xs text-primary font-mono hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Explore Marketplace</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white">
                  RS
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-none">Rohan Sharma</h3>
                  <span className="text-[10px] text-primary font-mono uppercase tracking-tight block mt-1">Sr. AI Architecture Lead</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Specialized in deep neural network optimization, unsloth parameter configurations, and secure prompt execution matrices.
              </p>
              <div className="flex gap-1.5 flex-wrap">
                <span className="text-[9px] font-mono bg-zinc-950 text-zinc-400 border border-zinc-805 px-2 py-0.5 rounded">PyTorch</span>
                <span className="text-[9px] font-mono bg-zinc-950 text-zinc-400 border border-zinc-805 px-2 py-0.5 rounded">Model Tuning</span>
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white">
                  AP
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-none">Aarav Patel</h3>
                  <span className="text-[10px] text-primary font-mono uppercase tracking-tight block mt-1">Frontend Systems Designer</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Specialized in hardware-accelerated layouts, micro-interaction components, and responsive modular design systems.
              </p>
              <div className="flex gap-1.5 flex-wrap">
                <span className="text-[9px] font-mono bg-zinc-950 text-zinc-400 border border-zinc-805 px-2 py-0.5 rounded">React</span>
                <span className="text-[9px] font-mono bg-zinc-950 text-zinc-400 border border-zinc-805 px-2 py-0.5 rounded">Design Systems</span>
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white">
                  PN
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-none">Priya Nair</h3>
                  <span className="text-[10px] text-primary font-mono uppercase tracking-tight block mt-1">Smart Contract Auditor</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Specialized in EVM security audits, multi-sig smart contract protection parameters, and reentrancy exploit auditing.
              </p>
              <div className="flex gap-1.5 flex-wrap">
                <span className="text-[9px] font-mono bg-zinc-950 text-zinc-400 border border-zinc-805 px-2 py-0.5 rounded">Solidity</span>
                <span className="text-[9px] font-mono bg-zinc-950 text-zinc-400 border border-zinc-805 px-2 py-0.5 rounded">Multisig</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Premium Enterprise Hiring call to action */}
        <section className="mt-20 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-805 rounded-2xl p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <span className="font-mono text-[10px] text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-flex items-center gap-1 uppercase font-bold tracking-widest">
              <Zap className="w-3 h-3 text-primary" />
              <span>TalentStage Enterprise Hub</span>
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-sans tracking-tight leading-snug">
              Secure elite creators with automated AI compliance pipelines.
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Integrate custom milestone contracts, cryptographic ledger matching, and automated candidate auditing inside your corporate workflow pipelines.
            </p>
            <div className="pt-4">
              <button 
                onClick={() => onNavigate('onboarding')}
                className="px-6 py-3 bg-primary hover:brightness-110 text-zinc-950 text-xs font-bold rounded-lg transition-all cursor-pointer font-sans"
              >
                Assemble Enterprise Workspace
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
