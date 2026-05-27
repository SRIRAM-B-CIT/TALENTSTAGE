/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  Timer, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { ProfileCore } from '../types';

interface SkillVerificationProps {
  userProfile: ProfileCore;
  currentUser: any;
  onProfileUpdate: (updated: ProfileCore) => void;
  triggerToast: (msg: string) => void;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIdx: number;
}

const CATEGORIES = [
  {
    id: 'ai-prompting',
    title: 'AI Prompt Engineering & LLM alignment',
    icon: Sparkles,
    badgeName: 'Verified Prompt Engineer',
    badgeTag: 'Prompt Tuning',
    questions: [
      {
        id: 1,
        text: "Which prompting technique reduces hallucination by forcing the model to explicitly output intermediate reasoning steps before answering?",
        options: [
          "Zero-shot prompting",
          "Chain-of-Thought (CoT) prompting",
          "Few-shot exemplars",
          "Structured output schema templates"
        ],
        correctIdx: 1
      },
      {
        id: 2,
        text: "In LLM parameters, what does a temperature setting of 0.0 mathematically guarantee?",
        options: [
          "Completely random token generation",
          "Highest possible token output length",
          "Deterministic selection of the highest probability tokens",
          "Forced system-level safety alignment filters"
        ],
        correctIdx: 2
      },
      {
        id: 3,
        text: "What does RLHF stand for in LLM training methodologies?",
        options: [
          "Reinforcement Learning from Human Feedback",
          "Randomized Latent Heuristic Fine-tuning",
          "Recurrent Layered Hyper-parameter Filtering",
          "Retrieval Loss Heuristic Formulation"
        ],
        correctIdx: 0
      }
    ]
  },
  {
    id: 'react-frontend',
    title: 'Frontend Engineering & Performance Design',
    icon: RefreshCw,
    badgeName: 'Verified React Architect',
    badgeTag: 'React Engine',
    questions: [
      {
        id: 1,
        text: "Why must you avoid adding unmemoized object literals or functions inside a React dependency array?",
        options: [
          "It forces Vite to disable Hot Module Replacement (HMR)",
          "It triggers infinite component re-render loops on every tick",
          "Standard JSX blocks do not support typed arrays",
          "It causes compile errors in Tailwind CSS production builds"
        ],
        correctIdx: 1
      },
      {
        id: 2,
        text: "Which browser API helps dynamically measure or watch changes to a container element's physical sizing boundaries?",
        options: [
          "ResizeObserver API",
          "IntersectionObserver API",
          "PerformanceTimeline Engine",
          "MutationObserver API"
        ],
        correctIdx: 0
      },
      {
        id: 3,
        text: "How does Vite handle asset packaging during the final production distribution build step?",
        options: [
          "Translates SPA layouts into offline-capable service workers",
          "Compiles all assets and bundles static assets into a localized 'dist/' structure",
          "Runs real-time JS interpreting loops inside Node processes",
          "Injects runtime script bundlers directly into frames"
        ],
        correctIdx: 1
      }
    ]
  },
  {
    id: 'evm-security',
    title: 'Web3 Security & EVM Smart Contract Auditing',
    icon: ShieldCheck,
    badgeName: 'Verified EVM Auditor',
    badgeTag: 'Smart Contracts',
    questions: [
      {
        id: 1,
        text: "Which re-entry exploit vulnerability occurred during the historic DAO hack of 2016?",
        options: [
          "Reentrancy Exploit via state modifications occurring after low-level external transfers",
          "Overflow vulnerability via excessive loop operations",
          "Front-running gas fee manipulations on validating nodes",
          "Compiling contracts using compromised EVM compiler versions"
        ],
        correctIdx: 0
      },
      {
        id: 2,
        text: "In Solidity smart contracts, which function modifier guarantees state read operations with zero alterations permitted?",
        options: [
          "pure",
          "view",
          "constant",
          "immutable"
        ],
        correctIdx: 1
      },
      {
        id: 3,
        text: "What is the primary role of a keccak256 hash operation in Web3 cryptographic signatures?",
        options: [
          "Decrypts private transaction signatures secure in escrow",
          "Provides an optimal 256-bit secure transaction footprint hash",
          "Simulates sidechain ledger states before blockchain synchronization",
          "Encodes and decrypts student verification attachments"
        ],
        correctIdx: 1
      }
    ]
  }
];

export default function SkillVerification({ userProfile, currentUser, onProfileUpdate, triggerToast }: SkillVerificationProps) {
  const [selectedCat, setSelectedCat] = useState<typeof CATEGORIES[0] | null>(null);
  const [activeStep, setActiveStep] = useState(0); // 0: Select, 1: Intro, 2: Active Test, 3: Completed
  
  // Test game states
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timerRemaining, setTimerRemaining] = useState(45); // 45 seconds countdown
  const [testActive, setTestActive] = useState(false);
  const [savingResult, setSavingResult] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [testPassed, setTestPassed] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    let timerId: any;
    if (testActive && timerRemaining > 0) {
      timerId = setInterval(() => {
        setTimerRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerId);
            handleTestComplete(true); // timed out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!testActive) {
      clearInterval(timerId);
    }
    return () => clearInterval(timerId);
  }, [testActive, timerRemaining]);

  const startTest = (cat: typeof CATEGORIES[0]) => {
    setSelectedCat(cat);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setTimerRemaining(45);
    setActiveStep(2); // shift directly to active test
    setTestActive(true);
  };

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
    
    // Auto-advance or wait for user to hit next
    if (selectedCat && currentQuestionIdx < selectedCat.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIdx(prev => prev + 1);
      }, 350);
    } else if (selectedCat && currentQuestionIdx === selectedCat.questions.length - 1) {
      // Last question selected, wait slightly then process results
      setTimeout(() => {
        handleTestComplete(false);
      }, 500);
    }
  };

  const handleTestComplete = async (timedOut = false) => {
    setTestActive(false);
    if (!selectedCat) return;

    let correctCount = 0;
    selectedCat.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctIdx) {
        correctCount++;
      }
    });

    const finalPercent = Math.round((correctCount / selectedCat.questions.length) * 100);
    const passed = finalPercent >= 66; // 2 out of 3 required (66%)

    setTestScore(finalPercent);
    setTestPassed(passed);
    setActiveStep(3);

    if (passed) {
      // Award skill badge securely inside local/MongoDB profile state
      setSavingResult(true);
      const profileToUpdate = { ...userProfile };
      const currentSkills = profileToUpdate.skills ? profileToUpdate.skills.split(',').map(s => s.trim()) : [];
      
      if (!currentSkills.includes(selectedCat.badgeTag)) {
        currentSkills.push(selectedCat.badgeTag);
        profileToUpdate.skills = currentSkills.join(', ');
      }

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (currentUser && currentUser._id) {
        headers['x-user-id'] = currentUser._id;
      }

      try {
        const response = await fetch('/api/profile', {
          method: 'POST',
          headers,
          body: JSON.stringify(profileToUpdate)
        });
        
        if (response.ok) {
          onProfileUpdate(profileToUpdate);
          triggerToast(`Certificate Issued! "${selectedCat.badgeName}" award verified and written to MongoDB Atlas!`);
        } else {
          // offline/fallback update
          onProfileUpdate(profileToUpdate);
          triggerToast(`Certificate Issued! (local offline mode)`);
        }
      } catch (err) {
        console.error("Database update failed:", err);
        onProfileUpdate(profileToUpdate);
      } finally {
        setSavingResult(false);
      }
    } else {
      triggerToast("Evaluation failed. Review curriculum specifications and retry!");
    }
  };

  return (
    <div className="flex-1 font-sans text-zinc-50 bg-transparent">
      
      {/* Title block */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-sans font-bold text-white tracking-tight mb-2">AI Skill Verification Wizard</h1>
          <p className="text-xs md:text-sm text-zinc-400 max-w-xl leading-relaxed">
            Verify key technical expertise competencies live. Challenge randomized MCQ sessions engineered to validate developer integrity limits.
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 flex items-center gap-2 font-mono text-xs text-zinc-400 shrink-0">
          <Award className="w-4 h-4 text-primary" />
          <span>PASS PERCENT: 66%+ (MIN 2/3)</span>
        </div>
      </header>

      <AnimatePresence mode="wait">
        
        {/* Step 0: Category Choice Menu */}
        {activeStep === 0 && (
          <motion.div 
            key="choice"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {CATEGORIES.map((cat) => {
              const CatIcon = cat.icon;
              const hasBadge = userProfile.skills ? userProfile.skills.toLowerCase().includes(cat.badgeTag.toLowerCase()) : false;

              return (
                <div 
                  key={cat.id}
                  className="bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 flex flex-col justify-between transition-colors h-[260px] relative overflow-hidden group"
                >
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
                        <CatIcon className="w-5 h-5" />
                      </div>
                      {hasBadge && (
                        <span className="flex items-center gap-1 text-[9.5px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-2 leading-snug font-sans">{cat.title}</h3>
                      <p className="text-xs text-zinc-400 leading-normal">
                        Verify your credentials to automatically unlock prime matchmaking slots in our ecosystem pipeline.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/85 relative z-10">
                    <button 
                      onClick={() => startTest(cat)}
                      className="w-full py-2.5 bg-zinc-950 hover:bg-primary hover:text-zinc-950 border border-zinc-800 hover:border-transparent text-xs font-bold font-sans rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{hasBadge ? 'Retake Challenge' : 'Begin Evaluation'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {/* Subtle abstract geometric grids on bg */}
                  <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary/2 rounded-full blur-2xl pointer-events-none" />
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Step 2: Active evaluation session view */}
        {activeStep === 2 && selectedCat && (
          <motion.div 
            key="active"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Session stats indicator bar */}
            <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-black">
                {selectedCat.badgeName.toUpperCase()}
              </span>
              <div className="flex items-center gap-4">
                {/* Countdown Timer Widget with custom visual alert triggers */}
                <span className={`flex items-center gap-1.5 font-mono text-xs font-bold ${timerRemaining < 15 ? 'text-red-400 animate-pulse' : 'text-primary'}`}>
                  <Timer className="w-4 h-4" />
                  <span>00:{timerRemaining < 10 ? `0${timerRemaining}` : timerRemaining}</span>
                </span>
                <span className="text-zinc-600 font-mono text-xs">|</span>
                <span className="text-zinc-400 font-mono text-xs font-bold">
                  Q: {currentQuestionIdx + 1} / {selectedCat.questions.length}
                </span>
              </div>
            </div>

            {/* Test Core Question Blocks */}
            <div className="p-8 space-y-6">
              {/* Question progress pipeline display */}
              <div className="flex gap-2 w-full h-[3px] bg-zinc-800 rounded-full overflow-hidden mb-4">
                {selectedCat.questions.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`flex-1 h-full rounded-full transition-all ${idx === currentQuestionIdx ? 'bg-primary' : idx < currentQuestionIdx ? 'bg-indigo-500' : 'bg-transparent'}`}
                  />
                ))}
              </div>

              {/* Text components */}
              <h3 className="text-lg font-bold text-white tracking-tight leading-relaxed font-sans">
                {selectedCat.questions[currentQuestionIdx].text}
              </h3>

              {/* Custom interactive multi-choice option list */}
              <div className="space-y-3">
                {selectedCat.questions[currentQuestionIdx].options.map((opt, optIdx) => {
                  const questionId = selectedCat.questions[currentQuestionIdx].id;
                  const isAnswered = userAnswers[questionId] !== undefined;
                  const isSelected = userAnswers[questionId] === optIdx;

                  return (
                    <button 
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(questionId, optIdx)}
                      className={`w-full text-left p-4 rounded-xl border font-sans text-xs font-medium leading-normal transition-all cursor-pointer flex items-center justify-between ${isSelected ? 'bg-primary/10 border-primary text-white shadow-lg' : 'bg-zinc-950/40 hover:bg-zinc-950 border-zinc-800 text-zinc-300'}`}
                    >
                      <span>{opt}</span>
                      <div className={`w-4 h-4 rounded-full border shrink-0 ml-3 flex items-center justify-center transition-all ${isSelected ? 'border-primary bg-primary' : 'border-zinc-700 bg-transparent'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-block Controls spacer */}
            <div className="px-6 py-4 bg-zinc-950/40 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
              <span className="font-mono text-[10.5px]">Evaluation limits strictly automated</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleTestComplete(false)}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors font-bold tracking-wide"
                >
                  Concede Test
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Test Finished Assessment screen */}
        {activeStep === 3 && selectedCat && (
          <motion.div 
            key="completed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden"
          >
            {/* Performance Outcomes */}
            <div className="relative z-10 space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-2xl relative">
                {testPassed ? (
                  <>
                    <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur" />
                    <Award className="w-8 h-8 text-emerald-400 relative z-10" />
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 rounded-full bg-red-500/10 blur" />
                    <AlertTriangle className="w-8 h-8 text-red-400 relative z-10" />
                  </>
                )}
              </div>

              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold mb-1">
                  curriculum outcome
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
                  {testPassed ? 'Evaluation Passed!' : 'Evaluation Deficit'}
                </h3>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto mt-2 leading-relaxed">
                  {testPassed 
                    ? `Excellent. You secured ${testScore}% performance score. The "${selectedCat.badgeTag}" credential is now officially pinned to your bio.`
                    : `You secured a ${testScore}% score, falling short of the 66% standard. Revise performance methodologies and re-try evaluation.`
                  }
                </p>
              </div>

              {/* Progress visual score bars */}
              <div className="bg-zinc-950/80 p-4 border border-zinc-800/60 rounded-xl max-w-sm mx-auto space-y-3">
                <div className="flex justify-between items-center text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                  <span>Score breakdown</span>
                  <span className={testPassed ? 'text-emerald-400' : 'text-red-400'}>{testScore}% SECURED</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${testPassed ? 'bg-emerald-500' : 'bg-red-500'}`} 
                    style={{ width: `${testScore}%` }}
                  />
                </div>
              </div>

              {/* Form buttons */}
              <div className="pt-4 flex flex-col gap-2">
                <button 
                  onClick={() => setActiveStep(0)}
                  className="w-full py-3 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:text-white rounded-lg text-xs font-bold font-sans transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Choose Another Category</span>
                </button>
              </div>
            </div>

            {/* Dynamic geometric abstract styling */}
            {testPassed && (
              <div className="absolute inset-0 bg-emerald-500/2 opacity-[0.03] animate-pulse pointer-events-none" />
            )}
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
