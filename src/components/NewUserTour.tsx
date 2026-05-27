/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  X, 
  ChevronRight, 
  Compass, 
  Layers, 
  Terminal 
} from 'lucide-react';

interface NewUserTourProps {
  onClose: () => void;
  onNavigateToScreen: (screen: any) => void;
}

export default function NewUserTour({ onClose, onNavigateToScreen }: NewUserTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to TalentStage Workspace",
      description: "Welcome to the elite workspace designed for technical creators and tier-1 enterprise clients. This tour will guide you through our AI-powered ecosystem.",
      target: "body",
      hint: "Press Enter or click Next to navigate.",
      badge: "TALENTSTAGE ENGINE",
      icon: Sparkles
    },
    {
      title: "System Overview & Scoping",
      description: "In the System Overview page, use the natural language AI Scoping Engine to instantly convert brief notes into professional milestone breakdowns and budget expectations.",
      target: "System Overview",
      hint: "Accessible anytime from the header menu.",
      badge: "AI CORE API",
      icon: Compass,
      action: () => onNavigateToScreen('landing')
    },
    {
      title: "Marketplace & Proposing",
      description: "Browse curated premium briefs. Place bids, review compatibility scores evaluated live by Gemini model servers, and bookmark opportunities.",
      target: "Marketplace",
      badge: "MUTUAL DISCOVERY",
      icon: Layers,
      action: () => onNavigateToScreen('marketplace')
    },
    {
      title: "Freelancer Console OS",
      description: "Your operational dashboard. Monitor your earnings in INR, see the simulated 10% platform fee deduction, and track your active milestone completions.",
      target: "Freelancer Console",
      badge: "OPERATIONAL DENSITY",
      icon: Terminal,
      action: () => onNavigateToScreen('freelancer-console')
    },
    {
      title: "AI Skill Verification",
      description: "Demonstrate technical excellence. Complete randomized MCQ tests in React, EVM Security, or Prompting to secure verified skills on your permanent profile.",
      target: "Skill Verification",
      badge: "TRUST BADGES",
      icon: ShieldCheck,
      action: () => onNavigateToScreen('skill-verification')
    },
    {
      title: "Unified Collaborative Inbox",
      description: "A state-of-the-art 3-column chat suite with integrated contract modeling, real-time message summaries, and generative milestones.",
      target: "Inbox",
      badge: "AI CO-PILOT",
      icon: HelpCircle,
      action: () => onNavigateToScreen('inbox')
    }
  ];

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (steps[nextStep].action) {
        steps[nextStep].action();
      }
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      if (steps[prevStep].action) {
        steps[prevStep].action();
      }
    }
  };

  const activeStepData = steps[currentStep];
  const StepIcon = activeStepData.icon;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      {/* Absolute high contrast spotlight effects for geometric layout */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/45 to-transparent" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative"
      >
        {/* Decorative micro noise accent line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/80 via-primary to-indigo-500/80" />
        
        {/* Card Header information */}
        <div className="p-8 border-b border-zinc-800/80 flex items-start justify-between gap-6">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[10px] font-mono text-primary font-black uppercase tracking-widest leading-none">
              <Sparkles className="w-2.5 h-2.5" />
              {activeStepData.badge}
            </span>
            <h3 className="text-xl font-bold font-sans text-white tracking-tight flex items-center gap-2 mt-2">
              <StepIcon className="w-5 h-5 text-primary shrink-0" />
              {activeStepData.title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Body information */}
        <div className="p-8 space-y-6">
          <p className="text-sm text-zinc-300 leading-relaxed font-sans">
            {activeStepData.description}
          </p>

          <div className="bg-zinc-950/80 border border-zinc-800/60 rounded-xl p-4 flex gap-3 text-xs text-zinc-400 items-start font-mono">
            <span className="text-primary font-bold">INFO:</span>
            <div className="space-y-1">
              <p>Target area: <span className="text-white font-mono font-bold">[{activeStepData.target}]</span></p>
              <p className="text-zinc-500 text-[10.5px]">{activeStepData.hint}</p>
            </div>
          </div>
        </div>

        {/* Card Footer action indicators */}
        <div className="px-8 py-5 bg-zinc-950 border-t border-zinc-800/80 flex items-center justify-between">
          {/* Progress Indicators dots */}
          <div className="flex gap-1.5">
            {steps.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => {
                  setCurrentStep(idx);
                  if (steps[idx].action) steps[idx].action();
                }}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${currentStep === idx ? 'bg-primary w-4' : 'bg-zinc-800 hover:bg-zinc-700'}`}
              />
            ))}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors py-2 px-3 tracking-wide cursor-pointer font-bold"
            >
              Skip Tour
            </button>
            <div className="flex gap-1.5">
              {currentStep > 0 && (
                <button 
                  onClick={handlePrev}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-white font-bold rounded-lg transition-all cursor-pointer"
                >
                  Back
                </button>
              )}
              <button 
                onClick={handleNext}
                className="px-5 py-2 bg-primary hover:brightness-110 text-zinc-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>{currentStep === steps.length - 1 ? 'Finish Tour' : 'Next'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
