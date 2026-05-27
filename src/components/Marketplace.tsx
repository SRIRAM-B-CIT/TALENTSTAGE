/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  ChevronDown, 
  Search, 
  CheckCircle, 
  Clock, 
  Award, 
  Bookmark, 
  Share2, 
  Sparkles, 
  BookOpen, 
  Cpu, 
  Terminal, 
  Globe 
} from 'lucide-react';
import { ProjectProposal } from '../types';
import { INITIAL_PROPOSALS } from '../data';

interface MarketplaceProps {
  onProposalTrigger?: (proposal: ProjectProposal) => void;
}

export default function Marketplace({ onProposalTrigger }: MarketplaceProps) {
  // Propoals state
  const [proposals, setProposals] = useState<ProjectProposal[]>(INITIAL_PROPOSALS);

  // Fetch proposals on component mount
  useEffect(() => {
    fetch('/api/proposals')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProposals(data);
        }
      })
      .catch(err => console.error("Could not load proposals from MongoDB:", err));
  }, []);
  
  // Interactive filters
  const [aiMatrix, setAiMatrix] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['UI/UX Design', 'Web3']);
  const [selectedBudgets, setSelectedBudgets] = useState<string[]>(['10k-25k']);
  const [durationFilter, setDurationFilter] = useState('1 - 3 months');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Selected proposal for Quick View Modal
  const [quickViewProp, setQuickViewProp] = useState<ProjectProposal | null>(null);

  // Skill choices definitions
  const SKILL_CHOICES = ['UI/UX Design', 'React', 'TypeScript', 'Web3', 'Figma', 'Solidity'];

  // Toggle skills filter
  const handleToggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  // Toggle budgets filter
  const handleToggleBudget = (bucket: string) => {
    setSelectedBudgets(prev =>
      prev.includes(bucket) ? prev.filter(b => b !== bucket) : [...prev, bucket]
    );
  };

  // Bookmark toggling
  const handleToggleBookmark = (id: string) => {
    setProposals(prev => 
      prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p)
    );
    fetch('/api/proposals/toggle-bookmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).catch(err => console.error("Error toggling bookmark on MongoDB:", err));
  };

  // Run dynamic filtering
  const filteredProposals = proposals.filter(p => {
    // Search overlap check
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) {
        return false;
      }
    }

    // Skills overlap check (if non-empty)
    if (selectedSkills.length > 0) {
      const pSkills = p.roles.map(r => r.toUpperCase());
      // Convert tags UI/UX -> UI, Web3 -> W3/Web3 etc.
      const transformedSelected = selectedSkills.map(s => {
        if (s === 'UI/UX Design') return 'UI';
        if (s === 'React') return 'TS';
        if (s === 'Web3') return 'W3';
        return s.toUpperCase().substring(0, 3);
      });
      const hasOverlap = transformedSelected.some(ts => pSkills.some(ps => ps.includes(ts)));
      if (!hasOverlap) return false;
    }

    // Budget bucket check
    if (selectedBudgets.length > 0) {
      let match = false;
      const budgetMax = p.fixedPrice || p.estimateMax;
      
      if (selectedBudgets.includes('5k-10k') && budgetMax >= 500000 && budgetMax <= 1000000) match = true;
      if (selectedBudgets.includes('10k-25k') && budgetMax > 1000000 && budgetMax <= 2500000) match = true;
      if (selectedBudgets.includes('25k-50k') && budgetMax > 2500000) match = true;
      
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="flex-1 font-sans text-on-surface bg-transparent">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Filters Sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-surface-container-low border border-border-dark p-bento-padding rounded-xl sticky top-24 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-tight">Filters</h2>
              <button 
                onClick={() => {
                  setSelectedSkills([]);
                  setSelectedBudgets([]);
                  setAiMatrix(true);
                }}
                className="text-primary font-mono text-xs hover:underline cursor-pointer font-medium"
              >
                Reset
              </button>
            </div>

            {/* AI Matrix premium toggle widget */}
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-primary flex items-center gap-1.5 uppercase font-bold tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI MATRIX</span>
                </span>
                
                {/* Custom toggle slider */}
                <button 
                  onClick={() => setAiMatrix(!aiMatrix)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${aiMatrix ? 'bg-primary' : 'bg-zinc-800'}`}
                >
                  <motion.div 
                    layout
                    className="w-4 h-4 rounded-full bg-white absolute top-0.5 left-0.5"
                    animate={{ x: aiMatrix ? 16 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
              <p className="text-[10px] text-on-surface-variant leading-normal">
                Enforce AI Matching Index Matrix to prioritize hyper-relevant project fits.
              </p>
            </div>

            {/* Skills checklist */}
            <div>
              <h3 className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest block mb-3 font-semibold">Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {SKILL_CHOICES.map(skill => {
                  const isActive = selectedSkills.includes(skill);
                  return (
                    <button 
                      key={skill}
                      onClick={() => handleToggleSkill(skill)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold font-sans border transition-all cursor-pointer ${
                        isActive 
                          ? 'border-primary text-primary bg-primary/10' 
                          : 'border-border-dark text-on-surface-variant hover:border-zinc-700'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget Range options */}
            <div>
              <h3 className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest block mb-3 font-semibold">Budget Range</h3>
              <div className="space-y-2 text-xs">
                {[
                  { id: '5k-10k', label: '₹5 Lakhs - ₹10 Lakhs' },
                  { id: '10k-25k', label: '₹10 Lakhs - ₹25 Lakhs' },
                  { id: '25k-50k', label: '₹25 Lakhs - ₹50 Lakhs+' }
                ].map(item => {
                  const isActive = selectedBudgets.includes(item.id);
                  return (
                    <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                      <div 
                        onClick={() => handleToggleBudget(item.id)}
                        className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${
                          isActive ? 'border-primary bg-primary text-background' : 'border-border-dark bg-transparent'
                        }`}
                      >
                        {isActive && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-on-surface-variant group-hover:text-white transition-colors">{item.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Technical project duration drop */}
            <div>
              <h3 className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest block mb-2 font-semibold font-sans">Duration</h3>
              <div className="relative">
                <select 
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value)}
                  className="w-full bg-surface-container border border-border-dark font-sans text-xs text-on-surface p-2.5 rounded-lg focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="Under 1 month">Under 1 month</option>
                  <option value="1 - 3 months">1 - 3 months</option>
                  <option value="3 - 6 months">3 - 6 months</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

          </div>
        </aside>

        {/* Live Main Grid feeds */}
        <section className="flex-1 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border-dark pb-4 gap-4">
            <div>
              <h1 className="text-3xl font-sans font-bold text-white tracking-tight mb-1">Marketplace</h1>
              <p className="text-xs text-on-surface-variant">
                Discovery board: <span className="text-primary font-bold">{filteredProposals.length} matched contracts</span> based on your AI index.
              </p>
            </div>
            {/* Search Input Filter Overlays */}
            <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg border border-border-dark max-w-xs w-full">
              <Search className="text-on-surface-variant w-4 h-4 mr-2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contracts..." 
                className="bg-transparent border-none text-xs text-white focus:outline-none w-full focus:ring-0" 
              />
            </div>
          </div>

          {/* Large Project Card 1 */}
          <div className="space-y-4">
            {filteredProposals.length === 0 ? (
              <div className="p-12 text-center bg-surface-container-lowest border border-border-dark rounded-xl">
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  No active briefs match your selected filter criteria. Try clicking are &apos;Reset&apos; at the top.
                </p>
              </div>
            ) : (
              filteredProposals.map((prop) => (
                <article 
                  key={prop.id}
                  className="bg-surface-container-lowest border border-border-dark hover:border-primary/50 rounded-xl p-bento-padding transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Visual Asset Thumbnail Mock */}
                    <div className="w-full md:w-48 h-32 shrink-0 rounded-lg overflow-hidden bg-surface-container border border-border-dark relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-surface-lowest to-transparent z-10 opacity-60" />
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        {prop.roles.includes('W3') ? (
                          <Globe className="w-8 h-8 text-primary" />
                        ) : prop.roles.includes('AI') ? (
                          <Cpu className="w-8 h-8 text-primary" />
                        ) : (
                          <Terminal className="w-8 h-8 text-primary" />
                        )}
                      </div>
                    </div>

                    {/* Meta Fields Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="bg-surface-container px-2 py-0.5 rounded text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                              {prop.category}
                            </span>
                            {prop.verified && (
                              <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded tracking-wider flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> VERIFIED
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors leading-snug">
                            {prop.title}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-primary font-mono leading-none">
                            ₹{prop.fixedPrice ? prop.fixedPrice.toLocaleString() : `${prop.estimateMin.toLocaleString()} - ₹${prop.estimateMax.toLocaleString()}`}
                          </p>
                          <span className="text-[9px] font-mono tracking-wider font-bold text-on-surface-variant block mt-1.5 uppercase">
                            {prop.fixedPrice ? 'FIXED PRICE' : 'PROJECT ESTIMATE'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-on-surface-variant line-clamp-2 max-w-2xl mb-4 leading-relaxed">
                        {prop.description}
                      </p>

                      <div className="pt-3 border-t border-border-dark/50 flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-4 items-center flex-wrap text-zinc-400 font-mono text-[11px] font-semibold">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-primary" /> {prop.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-primary" /> {prop.level}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleToggleBookmark(prop.id)}
                            className={`p-2 border rounded-lg hover:border-zinc-500 transition-colors cursor-pointer ${
                              prop.saved ? 'border-primary text-primary bg-primary/10' : 'border-border-dark text-on-surface-variant'
                            }`}
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setQuickViewProp(prop)}
                            className="border border-border-dark hover:bg-surface-container-high font-bold px-4 py-2 rounded-lg text-xs cursor-pointer"
                          >
                            Quick View
                          </button>
                          <button 
                            onClick={() => {
                              if (onProposalTrigger) onProposalTrigger(prop);
                            }}
                            className="bg-white hover:bg-neutral-200 text-zinc-950 font-bold px-5 py-2 rounded-lg text-xs cursor-pointer"
                          >
                            Submit Proposal
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* AI suggestion banner (Screen 10 element bottom) */}
          <AnimatePresence>
            {aiMatrix && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="bg-gradient-to-r from-surface-container-low to-surface-container border border-primary/20 p-5 rounded-xl flex items-center gap-5 mt-8 hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm mb-0.5">Automated Match suggestion</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed max-w-2xl">
                    Synthesizing your historic evaluation metrics inside <span className="text-primary font-bold">Fintech Core UI</span>, you qualify as an ideal match for the active Global Design brief.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    const fintechProp = proposals.find(p => p.id === 'prop-1');
                    if (fintechProp && onProposalTrigger) {
                      onProposalTrigger(fintechProp);
                    }
                  }}
                  className="bg-primary/20 text-primary border border-primary/25 hover:bg-primary/30 transition-all font-mono text-[10px] uppercase font-black px-4 py-2 rounded-lg tracking-widest whitespace-nowrap cursor-pointer"
                >
                  Apply Now
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </section>

      </div>

      {/* Quick View Technical Milestones Scope Modal */}
      <AnimatePresence>
        {quickViewProp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProp(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container border border-border-dark p-bento-padding rounded-xl w-full max-w-lg shadow-2xl relative z-10"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-primary tracking-widest block uppercase mb-1">AUTOMATED PROJECT SCOPING SCHEMATICS</span>
                  <h3 className="text-lg font-bold text-white leading-tight font-sans">{quickViewProp.title}</h3>
                </div>
                <button 
                  onClick={() => setQuickViewProp(null)}
                  className="text-on-surface-variant hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <p className="text-on-surface-variant text-xs leading-relaxed">{quickViewProp.description}</p>
                
                <div className="bg-surface-lowest border border-border-dark p-3 rounded-lg font-mono flex justify-between items-center">
                  <span className="text-zinc-500">Milestone allocation</span>
                  <span className="text-primary font-bold">Escrow Protected</span>
                </div>

                <div className="space-y-2 border-t border-border-dark pt-4">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase font-black block tracking-widest">Project Requirements</span>
                  <div className="space-y-1 bg-background/50 border border-border-dark p-3 rounded-lg">
                    <div className="flex gap-2 text-[11px] text-zinc-300">
                      <span>1.</span>
                      <span>Deconstruct high-density wireframes into modern components.</span>
                    </div>
                    <div className="flex gap-2 text-[11px] text-zinc-300">
                      <span>2.</span>
                      <span>Wire up reactive state and clean tailwind assets.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-dark bg-surface-lowest p-3 rounded-lg flex justify-between items-center font-mono">
                  <span className="text-zinc-500">Estimate</span>
                  <span className="text-white font-bold text-sm">
                    ₹{quickViewProp.fixedPrice ? quickViewProp.fixedPrice.toLocaleString() : `${quickViewProp.estimateMin.toLocaleString()} - ₹${quickViewProp.estimateMax.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => {
                  const prop = quickViewProp;
                  setQuickViewProp(null);
                  if (onProposalTrigger) onProposalTrigger(prop);
                }}
                className="w-full bg-primary hover:brightness-110 text-on-primary font-bold py-3 mt-6 rounded-lg text-xs uppercase tracking-wider transition-all"
              >
                Submit Proposal for ₹{(quickViewProp.fixedPrice || quickViewProp.estimateMin).toLocaleString()}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
