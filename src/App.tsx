/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
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
  CheckCircle2,
  LogOut,
  Zap,
  Check
} from 'lucide-react';

import { ActiveScreen, ProfileCore, ProjectProposal } from './types';
import { DEFAULT_PROFILE } from './data';

import LandingPage from './components/LandingPage';
import ClientPortal from './components/ClientPortal';
import FreelancerConsole from './components/FreelancerConsole';
import Marketplace from './components/Marketplace';
import Onboarding from './components/Onboarding';
import EscrowVault from './components/EscrowVault';
import Auth from './components/Auth';
import NewUserTour from './components/NewUserTour';
import SkillVerification from './components/SkillVerification';
import Inbox from './components/Inbox';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('landing');
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('talentstage_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [userProfile, setUserProfile] = useState<ProfileCore>(DEFAULT_PROFILE);

  const [tourCompleted, setTourCompleted] = useState<boolean>(() => {
    return localStorage.getItem('talentstage_tour_completed') === 'true';
  });
  const [tourActive, setTourActive] = useState(false);

  useEffect(() => {
    if (currentUser && !tourCompleted) {
      setTourActive(true);
    }
  }, [currentUser, tourCompleted]);

  // Fetch profile whenever active session user changes
  useEffect(() => {
    const headers: Record<string, string> = {};
    if (currentUser && currentUser._id) {
      headers['x-user-id'] = currentUser._id;
    }
    fetch('/api/profile', { headers })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setUserProfile(data);
        }
      })
      .catch(err => console.error("Could not fetch active profile from MongoDB:", err));
  }, [currentUser]);
  
  // Mobile nav toggler
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Escrow Proposal checkout state
  const [selectedProposalForEscrow, setSelectedProposalForEscrow] = useState<ProjectProposal | null>(null);

  // Notification states
  const [notification, setNotification] = useState<string | null>(null);

  // Profile save updates
  const handleProfileSave = (updated: ProfileCore) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (currentUser && currentUser._id) {
      headers['x-user-id'] = currentUser._id;
    }
    fetch('/api/profile', {
      method: 'POST',
      headers,
      body: JSON.stringify(updated)
    })
    .then(res => res.json())
    .then(() => {
      setUserProfile(updated);
      setActiveScreen('freelancer-console'); // Shift straight to dashboard Workspace to view audit outcome!
      triggerToast("Hybrid identity saved securely to MongoDB database!");
    })
    .catch(err => {
      console.error("Could not save profile to MongoDB:", err);
      setUserProfile(updated);
      setActiveScreen('freelancer-console');
      triggerToast("Profile updated locally (offline mode)");
    });
  };

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Nav actions with authentication gates
  const navigateTo = (screen: ActiveScreen) => {
    if (!currentUser && (screen === 'freelancer-console' || screen === 'client-portal' || screen === 'onboarding')) {
      setActiveScreen('auth');
      triggerToast("Authentication required. Please log in or register your account.");
      setMobileMenuOpen(false);
      return;
    }
    setActiveScreen(screen);
    setMobileMenuOpen(false);
  };

  // Sign out handler
  const handleSignOut = () => {
    localStorage.removeItem('talentstage_user');
    setCurrentUser(null);
    setUserProfile(DEFAULT_PROFILE);
    setActiveScreen('landing');
    triggerToast("Logged out successfully from TalentStage.");
  };

  return (
    <div className="min-h-screen bg-[#0d0d12] font-sans text-on-surface select-none relative pb-16 overflow-x-hidden">
      
      {/* Frosted Glass glowing ambient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/30 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[140px]" />
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
              Overview
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
              Console
            </button>
            <button 
              onClick={() => navigateTo('client-portal')} 
              className={`px-3 py-2 rounded-lg hover:text-white transition-colors cursor-pointer ${activeScreen === 'client-portal' ? 'text-primary' : ''}`}
            >
              Portal
            </button>
            <button 
              onClick={() => navigateTo('inbox')} 
              className={`px-3 py-2 rounded-lg hover:text-white transition-colors cursor-pointer ${activeScreen === 'inbox' ? 'text-primary' : ''}`}
            >
              Inbox
            </button>
            <button 
              onClick={() => navigateTo('skill-verification')} 
              className={`px-3 py-2 rounded-lg hover:text-white transition-colors cursor-pointer ${activeScreen === 'skill-verification' ? 'text-primary' : ''}`}
            >
              Verification
            </button>
          </nav>

          {/* User widget profile trigger */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser && (
              <button 
                onClick={() => setTourActive(true)}
                className="p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-mono font-bold text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Start walkthrough tour"
              >
                Guide Tour
              </button>
            )}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigateTo('onboarding')}
                  className="px-4 py-2 bg-surface-container border border-border-dark hover:border-zinc-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span className="text-white">{userProfile.fullName}</span>
                  {currentUser.isPro && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-400/10 text-amber-400 font-mono text-[8px] uppercase font-black rounded border border-amber-400/20">
                      <Zap className="w-2.5 h-2.5 fill-amber-400" />
                      Pro
                    </span>
                  )}
                </button>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigateTo('auth')}
                className="px-4 py-2 bg-primary hover:brightness-110 text-on-primary text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-primary/10"
              >
                <span>Sign In / Join</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            )}
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
                onClick={() => navigateTo('inbox')} 
                className={`text-left py-2 ${activeScreen === 'inbox' ? 'text-primary' : ''}`}
              >
                Inbox Chat
              </button>
              <button 
                onClick={() => navigateTo('skill-verification')} 
                className={`text-left py-2 ${activeScreen === 'skill-verification' ? 'text-primary' : ''}`}
              >
                Verification Rules
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
              <FreelancerConsole 
                userProfile={userProfile}
                currentUser={currentUser}
              />
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

          {activeScreen === 'inbox' && (
            <motion.div
              key="inbox"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Inbox 
                userProfile={userProfile}
                currentUser={currentUser}
                triggerToast={triggerToast}
              />
            </motion.div>
          )}

          {activeScreen === 'skill-verification' && (
            <motion.div
              key="skill-verification"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SkillVerification 
                userProfile={userProfile}
                currentUser={currentUser}
                onProfileUpdate={(updated) => setUserProfile(updated)}
                triggerToast={triggerToast}
              />
            </motion.div>
          )}

          {activeScreen === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Auth 
                onLoginSuccess={(user, profile) => {
                  localStorage.setItem('talentstage_user', JSON.stringify(user));
                  setCurrentUser(user);
                  setUserProfile(profile);
                  // Dynamic redirect based on preference
                  if (user.role === 'Client') {
                    setActiveScreen('client-portal');
                  } else {
                    setActiveScreen('freelancer-console');
                  }
                  triggerToast(`Access granted. Switched environment session to ${user.fullName}`);
                }}
                onNavigateTo={navigateTo}
              />
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

      {/* Guided Walkthrough Tour overlay portal */}
      <AnimatePresence>
        {tourActive && (
          <NewUserTour 
            onClose={() => {
              setTourActive(false);
              setTourCompleted(true);
              localStorage.setItem('talentstage_tour_completed', 'true');
            }}
            onNavigateToScreen={(screen) => navigateTo(screen)}
          />
        )}
      </AnimatePresence>

      </div>
    </div>
  );
}
