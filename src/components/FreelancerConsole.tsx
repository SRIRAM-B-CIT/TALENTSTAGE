/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, 
  Upload, 
  HelpCircle, 
  LogOut, 
  Grid, 
  PlusCircle, 
  Briefcase, 
  TrendingUp, 
  Brain, 
  Download, 
  DollarSign, 
  AlertTriangle, 
  Check, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { DEFAULT_PROFILE } from '../data';

interface FreelancerConsoleProps {
  onUpgradeTrigger?: () => void;
}

export default function FreelancerConsole({ onUpgradeTrigger }: FreelancerConsoleProps) {
  // Local finances state
  const [netFunds, setNetFunds] = useState(11250);
  const [withdrawing, setWithdrawing] = useState(false);
  const [hasWithdrawn, setHasWithdrawn] = useState(false);

  // Drag and drop uploading state
  const [droppedV1Name, setDroppedV1Name] = useState<string | null>(null);
  const [droppedInvoiceName, setDroppedInvoiceName] = useState<string | null>(null);
  const [isV1Hovered, setIsV1Hovered] = useState(false);
  const [isInvoiceHovered, setIsInvoiceHovered] = useState(false);

  const fileInputV1Ref = useRef<HTMLInputElement>(null);
  const fileInputInvoiceRef = useRef<HTMLInputElement>(null);

  // Auditor States
  const [integrityScore, setIntegrityScore] = useState(85);
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any | null>(null);

  // Simulated CSV Export
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Transaction Type,Details,Amount\n"
      + "Gross Billings,5 Active Contracts,12500.00\n"
      + "Commission,10% Platform Fee,-1250.00\n"
      + "Net Funds,Ready for Payout," + netFunds + "\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "talentstage_ledger_q3_2024.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Withdraw simulation
  const handleWithdraw = () => {
    if (netFunds === 0 || withdrawing) return;
    setWithdrawing(true);
    setTimeout(() => {
      setNetFunds(0);
      setWithdrawing(false);
      setHasWithdrawn(true);
      setTimeout(() => setHasWithdrawn(false), 5000);
    }, 1500);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropV1 = (e: React.DragEvent) => {
    e.preventDefault();
    setIsV1Hovered(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setDroppedV1Name(e.dataTransfer.files[0].name);
    }
  };

  const handleDropInvoice = (e: React.DragEvent) => {
    e.preventDefault();
    setIsInvoiceHovered(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setDroppedInvoiceName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileSelectV1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDroppedV1Name(e.target.files[0].name);
    }
  };

  const handleFileSelectInvoice = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDroppedInvoiceName(e.target.files[0].name);
    }
  };

  // Real API Profile Audit Triggering
  const runProfileAudit = async () => {
    setAuditing(true);
    setAuditResult(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(DEFAULT_PROFILE),
      });

      if (response.ok) {
        const data = await response.json();
        setAuditResult(data);
        if (data.score) {
          setIntegrityScore(data.score);
        }
      } else {
        console.error('Audit api error');
      }
    } catch (err) {
      console.error('Internal audit fail:', err);
    } finally {
      setAuditing(false);
    }
  };

  return (
    <div className="flex-1 font-sans text-on-surface bg-surface min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-sans font-bold text-white tracking-tight mb-2">Overview / Workspace</h1>
        <p className="text-sm md:text-base text-on-surface-variant max-w-xl">
          Welcome back, your AI auditor has found <span className="text-primary font-bold">2 optimization opportunities</span>.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Completeness Circular Ring (Span 4) */}
        <div className="lg:col-span-4 bg-surface-container-lowest border border-border-dark p-bento-padding rounded-xl flex flex-col items-center justify-center text-center bento-card">
          <div className="relative w-32 h-32 mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-zinc-800" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeWidth="6" />
              <motion.circle 
                className="text-primary" 
                cx="64" 
                cy="64" 
                fill="transparent" 
                r="56" 
                stroke="currentColor" 
                strokeWidth="6" 
                strokeDasharray={351.8}
                initial={{ strokeDashoffset: 351.8 }}
                animate={{ strokeDashoffset: 351.8 - (351.8 * integrityScore) / 100 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-sans font-black text-white">{integrityScore}%</span>
              <span className="text-[10px] font-mono text-on-surface-variant font-bold uppercase tracking-wider">integrity</span>
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-white mb-2">Profile Integrity</h3>
          <p className="text-xs text-on-surface-variant mb-4 px-4 leading-relaxed">
            High integrity results in direct elite invitations from Fintech &amp; Web3 enterprise briefs.
          </p>

          <div className="bg-primary/10 border border-primary/20 p-3.5 rounded-lg text-left w-full">
            <p className="text-primary font-bold text-xs flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5" /> RECOMMENDATION
            </p>
            <p className="text-white text-xs mt-1 leading-normal font-medium">Add results to Project 3 (+15% score)</p>
          </div>
        </div>

        {/* Ledger Hub (Span 8) */}
        <div className="lg:col-span-8 bg-surface-container border border-border-dark p-bento-padding rounded-xl flex flex-col justify-between bento-card">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white tracking-tight">Ledger Hub</h3>
              <span className="text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded font-bold uppercase">Q3 2024</span>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left font-mono text-xs text-on-surface whitespace-nowrap">
                <thead className="text-on-surface-variant border-b border-border-dark">
                  <tr>
                    <th className="pb-3 font-medium">Transaction Type</th>
                    <th className="pb-3 font-medium text-right">Details</th>
                    <th className="pb-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-dark/50">
                  <tr>
                    <td className="py-4 font-sans text-sm font-semibold text-white">Gross Billings</td>
                    <td className="py-4 text-right text-on-surface-variant">5 Active Contracts</td>
                    <td className="py-4 text-right font-bold text-white">$12,500.00</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-sans text-sm font-semibold text-white">Commission</td>
                    <td className="py-4 text-right text-on-surface-variant">10% Platform Fee</td>
                    <td className="py-4 text-right font-bold text-red-400">-$1,250.00</td>
                  </tr>
                  <tr className="border-t-2 border-border-dark">
                    <td className="py-4 font-sans text-sm font-black text-white">Net Funds</td>
                    <td className="py-4 text-right text-zinc-400 font-sans italic">Ready for Payout</td>
                    <td className="py-4 text-right text-primary font-black text-lg">
                      ${netFunds.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-6 border-t border-border-dark flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleExportCSV}
              className="flex-1 hover:bg-surface-container-high text-on-surface border border-border-dark py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button 
              onClick={handleWithdraw}
              disabled={netFunds === 0 || withdrawing}
              className="flex-1 bg-white hover:bg-neutral-200 text-zinc-950 disabled:opacity-40 disabled:cursor-not-allowed py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {withdrawing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Withdraw Funds</span>
                </>
              )}
            </button>
          </div>

          {/* Toast Notification Receipt */}
          <AnimatePresence>
            {hasWithdrawn && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 text-xs font-medium text-center flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Withdrawal submitted successfully. Funds routed to your standard ledger account.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Drag & Drop Contract Timeline (Span 7) */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-border-dark p-bento-padding rounded-xl bento-card flex flex-col justify-between">
          <h3 className="text-xl font-bold text-white tracking-tight mb-6">Contract Timeline</h3>
          <div className="space-y-6">
            
            <div className="relative pl-8 border-l border-zinc-800">
              {/* Indicator Dot */}
              <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/20" />
              
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">Brand Identity - Solaris AI</h4>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">Due in 4 days</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 border border-primary/25 px-2 py-0.5 rounded uppercase tracking-wider">
                  Active
                </span>
              </div>

              {/* Advanced Drag & Drop / Click Upload Area */}
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                
                {/* File Drop Area V1 Assets */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={() => setIsV1Hovered(false)}
                  onDragEnter={() => setIsV1Hovered(true)}
                  onDrop={handleDropV1}
                  onClick={() => fileInputV1Ref.current?.click()}
                  className={`flex-1 border-2 border-dashed border-border-dark rounded-lg p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 transition-all ${
                    isV1Hovered ? 'bg-primary/5 border-primary' : 'bg-surface-container/30'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputV1Ref} 
                    onChange={handleFileSelectV1} 
                    className="hidden" 
                  />
                  <Upload className={`w-5 h-5 mb-1 ${droppedV1Name ? 'text-primary' : 'text-zinc-500'}`} />
                  <span className="text-[10px] font-bold text-white block">
                    {droppedV1Name ? 'V1 Uploaded' : 'Drop V1 Assets'}
                  </span>
                  <span className="text-[9px] text-on-surface-variant truncate max-w-[120px]">
                    {droppedV1Name ? droppedV1Name : 'or click to browse'}
                  </span>
                </div>

                {/* File Drop Area Invoice */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={() => setIsInvoiceHovered(false)}
                  onDragEnter={() => setIsInvoiceHovered(true)}
                  onDrop={handleDropInvoice}
                  onClick={() => fileInputInvoiceRef.current?.click()}
                  className={`flex-1 border-2 border-dashed border-border-dark rounded-lg p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 transition-all ${
                    isInvoiceHovered ? 'bg-primary/5 border-primary' : 'bg-surface-container/30'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputInvoiceRef} 
                    onChange={handleFileSelectInvoice} 
                    className="hidden" 
                  />
                  <Upload className={`w-5 h-5 mb-1 ${droppedInvoiceName ? 'text-primary' : 'text-zinc-500'}`} />
                  <span className="text-[10px] font-bold text-white block">
                    {droppedInvoiceName ? 'Invoice Uploaded' : 'Drop Invoice'}
                  </span>
                  <span className="text-[9px] text-on-surface-variant truncate max-w-[120px]">
                    {droppedInvoiceName ? droppedInvoiceName : 'or click to browse'}
                  </span>
                </div>

              </div>
            </div>

            <div className="relative pl-8 border-l border-zinc-800">
              {/* In Review Dot */}
              <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-tertiary-container" />
              
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">UX Audit - FinStream</h4>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">Submitted 12h ago</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-tertiary-container bg-tertiary-container/10 border border-tertiary-container/20 px-2 py-0.5 rounded uppercase tracking-wider">
                  In Review
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-3 italic leading-relaxed">
                Waiting for client feedback on initial wireframes.
              </p>
            </div>

          </div>
        </div>

        {/* AI Portfolio Auditor sidebar (Span 5) */}
        <div className="lg:col-span-5 bg-surface-container border border-primary/10 p-bento-padding rounded-xl flex flex-col justify-between ai-glow relative overflow-hidden bento-card">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/20 p-2.5 rounded-lg border border-primary/20 flex items-center justify-center text-primary">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">Portfolio Auditor</h3>
                <p className="text-[9px] font-mono text-primary uppercase tracking-widest font-semibold mt-0.5">Real-time analysis</p>
              </div>
            </div>

            <div className="bg-background/60 border border-border-dark rounded-lg p-4 min-h-[170px]">
              {/* Initial display */}
              {!auditResult && !auditing && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-500 font-mono text-[10px] uppercase font-bold tracking-wider">System Ready</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 opacity-65 text-xs text-on-surface-variant">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Bio length optimization verified</span>
                    </div>
                    <div className="flex items-start gap-2 opacity-65 text-xs text-on-surface-variant">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Skill tag verification checklist complete</span>
                    </div>
                  </div>
                </div>
              )}

              {auditing && (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                  <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                  <span className="text-xs text-on-surface-variant font-mono animate-pulse">Conducting deep Gemini analysis...</span>
                </div>
              )}

              {/* Real Audit Results */}
              <AnimatePresence>
                {auditResult && !auditing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4 animate-in fade-in"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-primary">Calculated Score:</span>
                      <span className="bg-primary/15 text-primary border border-primary/30 text-xs px-2 py-0.5 rounded font-mono font-bold">
                        {auditResult.score}% Completion
                      </span>
                    </div>

                    {/* Passed Checks */}
                    {auditResult.passedChecks?.length > 0 && (
                      <div>
                        <span className="text-[10px] text-zinc-500 font-mono uppercase font-bold tracking-widest block mb-1.5">Optimized Areas</span>
                        <div className="space-y-1">
                          {auditResult.passedChecks.slice(0, 2).map((check: string, idx: number) => (
                            <div key={idx} className="flex gap-2 text-xs text-white items-start">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{check}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Warnings / Bottlenecks */}
                    {auditResult.warnings?.length > 0 && (
                      <div>
                        <span className="text-[10px] text-amber-400 font-mono uppercase font-bold tracking-widest block mb-1.5">Recommendations ({auditResult.warnings.length})</span>
                        <div className="space-y-1.5">
                          {auditResult.suggestions.slice(0, 2).map((sug: any, idx: number) => (
                            <div key={idx} className="bg-surface-container-high border border-outline-variant p-2 rounded text-[11px] leading-snug">
                              <span className="font-bold text-white block mb-0.5 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                {sug.title}
                              </span>
                              <span className="text-zinc-400">{sug.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border-dark">
            <button 
              onClick={runProfileAudit}
              disabled={auditing}
              className="w-full bg-primary hover:brightness-110 text-on-primary py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(78,222,163,0.15)] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${auditing ? 'animate-spin' : ''}`} />
              <span>{auditing ? 'Auditing Portfolio...' : 'Run Profile Audit'}</span>
            </button>
            <p className="text-[10px] text-zinc-500 font-mono uppercase text-center mt-3 tracking-wider">
              AI verification increases system placements by 42%.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
