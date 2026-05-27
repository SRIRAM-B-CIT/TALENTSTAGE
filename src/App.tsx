/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Layers, 
  Briefcase, 
  User, 
  LayoutDashboard, 
  ShieldCheck, 
  Terminal, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

import { ActiveScreen, ProfileCore, ProjectProposal } from './types';
import { DEFAULT_PROFILE } from './data';

import LandingPage from './components/LandingPage';
import ClientPortal from './components/ClientPortal';
import FreelancerConsole from './components/FreelancerConsole';
import Marketplace from './components/Marketplace';
import Onboarding from './components/Onboarding';
import EscrowVault from './components/EscrowVault';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('landing');
  const [userProfile, setUserProfile] = useState<ProfileCore>(DEFAULT_PROFILE);
  
  // Mobile nav toggler
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Escrow Proposal checkout state
  const [selectedProposalForEscrow, setSelectedProposalForEscrow] = useState<ProjectProposal | null>(null);

  // Notification states
  const [notification, setNotification] = useState<string | null>(null);

  // Profile save updates
  const handleProfileSave = (updated: ProfileCore) => {
    setUserProfile(updated);
    setActiveScreen('freelancer-console'); // Shift straight to dashboard Workspace to view audit outcome!
    triggerToast("Hybrid identity updated successfully and indexed for matching!");
  };

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Nav actions
  const navigateTo = (screen: ActiveScreen) => {
    setActiveScreen(screen);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0d0d12] font-sans text-on-surface select-none relative pb-16 overflow-x-hidden">
      
      {/* Frosted Glass glowing ambient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10">
        {/* Header Standard Navigation bar */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10 px-8 py-4 shadow-lg shadow-black/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo design */}
          <div 
            onClick={() => navigateTo('landing')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-black text-sm tracking-tighter">
              TS
            </div>
            <span className="font-sans font-black text-xl text-white tracking-widest uppercase transition-colors group-hover:text-primary">
              TalentStage
            </span>
          </div>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-1 text-[11px] font-mono uppercase tracking-widest font-black text-on-surface-variant">
            <button 
              onClick={() => navigateTo('landing')} 
              className={`px-3 py-2 rounded-lg hover:text-white transition-colors cursor-pointer ${activeScreen === 'landing' ? 'text-primary' : ''}`}
            >
              System Overview
            </button>
            <button 
              onClick={() => navigateTo('marketplace')} 
              className={`px-3 py-2 rounded-lg hover:text-white transition-colors cursor-pointer ${activeScreen === 'marketplace' ? 'text-primary' : ''}`}
            >
              Marketplace
            </button>
            <button 
              onClick={() => navigateTo('freelancer-console')} 
              className={`px-3 py-2 rounded-lg hover:text-white transition-colors cursor-pointer ${activeScreen === 'freelancer-console' ? 'text-primary' : ''}`}
            >
              Freelancer Console
            </button>
            <button 
              onClick={() => navigateTo('client-portal')} 
              className={`px-3 py-2 rounded-lg hover:text-white transition-colors cursor-pointer ${activeScreen === 'client-portal' ? 'text-primary' : ''}`}
            >
              Client Portal
            </button>
          </nav>

          {/* User widget profile trigger */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => navigateTo('onboarding')}
              className="px-4 py-2 bg-surface-container border border-border-dark hover:border-zinc-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2"
            >
              <User className="w-3.5 h-3.5 text-primary" />
              <span>{userProfile.fullName}</span>
            </button>
          </div>

          {/* Mobile Hamburg Trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-on-surface-variant hover:text-white p-2 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </header>

      {/* Mobile Nav Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden bg-surface-container border-b border-border-dark p-6"
          >
            <div className="flex flex-col gap-4 font-mono text-xs uppercase font-bold tracking-widest text-on-surface-variant">
              <button 
                onClick={() => navigateTo('landing')} 
                className={`text-left py-2 ${activeScreen === 'landing' ? 'text-primary' : ''}`}
              >
                System Overview
              </button>
              <button 
                onClick={() => navigateTo('marketplace')} 
                className={`text-left py-2 ${activeScreen === 'marketplace' ? 'text-primary' : ''}`}
              >
                Marketplace
              </button>
              <button 
                onClick={() => navigateTo('freelancer-console')} 
                className={`text-left py-2 ${activeScreen === 'freelancer-console' ? 'text-primary' : ''}`}
              >
                Freelancer Console
              </button>
              <button 
                onClick={() => navigateTo('client-portal')} 
                className={`text-left py-2 ${activeScreen === 'client-portal' ? 'text-primary' : ''}`}
              >
                Client Portal
              </button>
              <button 
                onClick={() => navigateTo('onboarding')} 
                className="text-left py-2 border-t border-border-dark/60 mt-2 text-primary flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Onboarding Profile</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active toast alerts notification center */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="fixed bottom-6 right-6 z-[120] bg-zinc-950 border border-emerald-500/20 p-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-primary shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-xs text-white leading-normal font-sans font-medium">{notification}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Route Rendering Engine */}
      <div className="pt-24 px-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeScreen === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage onNavigate={navigateTo} />
            </motion.div>
          )}

          {activeScreen === 'marketplace' && (
            <motion.div
              key="marketplace"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Marketplace 
                onProposalTrigger={(proposal) => {
                  setSelectedProposalForEscrow(proposal);
                }} 
              />
            </motion.div>
          )}

          {activeScreen === 'freelancer-console' && (
            <motion.div
              key="freelancer-console"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FreelancerConsole />
            </motion.div>
          )}

          {activeScreen === 'client-portal' && (
            <motion.div
              key="client-portal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ClientPortal 
                onReviewSubmit={(review) => {
                  triggerToast(`Feedback logged successfully for closed contract: ${review.id}`);
                }}
              />
            </motion.div>
          )}

          {activeScreen === 'onboarding' && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Onboarding onSave={handleProfileSave} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pop-Under Secure Escrow Vault Modal Dialog Layer */}
      <AnimatePresence>
        {selectedProposalForEscrow && (
          <EscrowVault 
            proposal={selectedProposalForEscrow}
            onClose={() => setSelectedProposalForEscrow(null)}
            onSuccess={() => {
              triggerToast(`Secure Escrow Vault created and funded successfully for ${selectedProposalForEscrow.title}!`);
            }}
          />
        )}
      </AnimatePresence>

      </div>
    </div>
  );
}
