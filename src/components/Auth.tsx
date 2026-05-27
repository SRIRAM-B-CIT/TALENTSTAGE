/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Mail, 
  User, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Upload, 
  Link as LinkIcon, 
  Check, 
  ShieldAlert,
  Loader2,
  Building2,
  Layers,
  Star,
  Zap
} from 'lucide-react';
import { ProfileCore } from '../types';

interface AuthProps {
  onLoginSuccess: (user: any, profile: ProfileCore) => void;
  onNavigateTo: (screen: string) => void;
}

export default function Auth({ onLoginSuccess, onNavigateTo }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'Freelancer' | 'Client' | 'Both'>('Freelancer');
  
  // Verification details
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [studentIdUploaded, setStudentIdUploaded] = useState<File | null>(null);
  const [studentIdName, setStudentIdName] = useState('');
  const [verificationType, setVerificationType] = useState<'linkedin' | 'studentid'>('linkedin');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Pro Subscription sandbox step (optional during signup)
  const [isProSelected, setIsProSelected] = useState(false);

  const handleStudentIdDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setStudentIdUploaded(file);
      setStudentIdName(file.name);
    }
  };

  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setStudentIdUploaded(file);
      setStudentIdName(file.name);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const body = isLogin 
        ? { email: email || username, password }
        : { 
            email, 
            username, 
            password, 
            fullName, 
            role,
            verificationType,
            verificationDoc: verificationType === 'linkedin' ? linkedInUrl : studentIdName,
            isProSelected 
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      let data: any = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text.slice(0, 100) || "Gateway returned empty non-JSON response");
      }

      if (!response.ok) {
        throw new Error(data.error || 'Authentication aborted');
      }

      setLoading(false);
      if (isLogin) {
        setSuccessMsg(`Access granted. Welcome back, ${data.user.fullName}!`);
        setTimeout(() => {
          onLoginSuccess(data.user, data.profile);
        }, 1200);
      } else {
        setSuccessMsg("Account created successfully with Atlas security layers! Performing initial login...");
        setTimeout(() => {
          // Auto-login after signup
          setIsLogin(true);
          setEmail(email);
          setPassword(password);
          // Manually trigger click-like behavior
          setLoading(true);
          fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          })
          .then(async res => {
            const cType = res.headers.get("content-type");
            if (cType && cType.includes("application/json")) {
              return res.json();
            }
            throw new Error(await res.text());
          })
          .then(loginData => {
            setLoading(false);
            if (loginData.user) {
              onLoginSuccess(loginData.user, loginData.profile);
            }
          })
          .catch(e => {
            setLoading(false);
            setErrorMsg("Fallback login setup: " + e.message);
          });
        }, 2000);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Connecting failure to MongoDB server');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Brand Value Proposition Column */}
        <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-2xl bg-gradient-to-b from-[#151522] to-[#0a0a0f] border border-white/5 relative overflow-hidden">
          {/* Subtle Ambient light */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-black text-sm tracking-tight shadow-md">
                TS
              </div>
              <span className="font-sans font-black text-lg text-white tracking-widest uppercase">
                TalentStage
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">
                Empowering Creators & Enterprise Clients
              </h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                A modern sandbox platform featuring decentralized escrow systems, portfolio reviews, and automatic matching engines powered by MongoDB Atlas.
              </p>
            </div>

            <hr className="border-white/5" />

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1 w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">MongoDB Persistent Synced Data</h4>
                  <p className="text-[11px] text-on-surface-variant">Real-time profile metrics and budgets persisted securely on Atlas cluster collections.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Indian Telemetry & Rupees Standard</h4>
                  <p className="text-[11px] text-on-surface-variant">Budget scopes calculated instantly in Rupees with custom creator roles.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 w-5 h-5 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                  <Sparkles className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">AI Scoping & Verifier Badges</h4>
                  <p className="text-[11px] text-on-surface-variant">Automated verification audits instantly logged upon verification document checks.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="p-3.5 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-[10.5px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                MongoDB Atlas Cluster Connected
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Interactive Form Block */}
        <div className="lg:col-span-7 bg-surface-container/40 border border-outline-variant rounded-2xl p-8 relative">
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {isLogin ? 'Welcome Back' : 'Join TalentStage'}
              </h1>
              <p className="text-xs text-on-surface-variant">
                {isLogin ? 'Access your portfolio and hire world-class talent' : 'Set up a unified account securely'}
              </p>
            </div>
            
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-xs font-mono font-bold text-primary hover:underline uppercase tracking-wide cursor-pointer"
            >
              {isLogin ? 'Create Account' : 'Log In Instead'}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-5 p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-xs flex items-center gap-2.5"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-xs flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#a1a1aa] font-bold uppercase tracking-wider block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-surface-lowest/70 border border-border-dark focus:border-primary/50 text-white rounded-lg pl-10 pr-4 py-2.5 text-xs outline-none transition-all placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#a1a1aa] font-bold uppercase tracking-wider block">Choose Primary Account Role</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'Freelancer', label: 'Freelancer', desc: 'I want to offer services' },
                      { id: 'Client', label: 'Client', desc: 'I want to hire people' },
                      { id: 'Both', label: 'Both', desc: 'Dynamic single account' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setRole(opt.id as any)}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                          role === opt.id 
                            ? 'bg-primary/10 border-primary text-white shadow-lg' 
                            : 'bg-surface-lowest/40 border-border-dark text-on-surface-variant hover:border-zinc-700'
                        }`}
                      >
                        <p className="text-[11px] font-bold tracking-tight block">{opt.label}</p>
                        <p className="text-[9px] text-[#71717a] mt-0.5 leading-tight">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Secure Identity Verification step UI Flow */}
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-3">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">Identity Verification Step</span>
                  </div>
                  <p className="text-[10.5px] text-on-surface-variant leading-relaxed">
                    Provide credentials for trusted hiring. Freelancers bypass waitlists with rapid verification audits.
                  </p>

                  <div className="flex gap-4 border-b border-border-dark pb-2.5 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setVerificationType('linkedin')}
                      className={`pb-1 uppercase font-bold border-b-2 transition-all ${
                        verificationType === 'linkedin' ? 'border-primary text-white' : 'border-transparent text-zinc-500'
                      }`}
                    >
                      LinkedIn URL Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerificationType('studentid')}
                      className={`pb-1 uppercase font-bold border-b-2 transition-all ${
                        verificationType === 'studentid' ? 'border-primary text-white' : 'border-transparent text-zinc-500'
                      }`}
                    >
                      Student ID Card
                    </button>
                  </div>

                  {verificationType === 'linkedin' ? (
                    <div className="space-y-1">
                      <div className="relative">
                        <LinkIcon className="absolute left-3 w-3.5 h-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="url"
                          required={verificationType === 'linkedin'}
                          placeholder="https://linkedin.com/in/yourprofile"
                          value={linkedInUrl}
                          onChange={(e) => setLinkedInUrl(e.target.value)}
                          className="w-full bg-surface-lowest/70 border border-border-dark focus:border-primary/50 text-white rounded-lg pl-9 pr-4 py-2 text-xs outline-none transition-all placeholder:text-zinc-650"
                        />
                      </div>
                    </div>
                  ) : (
                    <div 
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleStudentIdDrop}
                      onClick={() => document.getElementById('studentIdInput')?.click()}
                      className="border-2 border-dashed border-border-dark rounded-lg p-4 text-center cursor-pointer hover:border-primary/45 transition-all text-xs"
                    >
                      <input 
                        type="file" 
                        id="studentIdInput" 
                        className="hidden" 
                        onChange={handleStudentIdChange}
                      />
                      <Upload className="w-4 h-4 mx-auto text-zinc-500 mb-1.5" />
                      {studentIdName ? (
                        <p className="text-primary font-bold text-[11px] truncate">{studentIdName}</p>
                      ) : (
                        <p className="text-zinc-400 text-[10px]">
                          Drag & drop student ID or <span className="text-primary underline">browse file</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Pro Freelancer Subscription toggle in onboarding */}
                {role !== 'Client' && (
                  <div className="p-4 bg-gradient-to-r from-primary/5 to-purple-600/5 border border-primary/20 rounded-xl flex items-center justify-between">
                    <div className="flex gap-2.5">
                      <Zap className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">Join Pro Freelancer Plan</span>
                          <span className="px-1.5 py-0.5 bg-amber-400/10 text-amber-400 font-mono text-[8px] uppercase font-black rounded border border-amber-400/20">Featured</span>
                        </div>
                        <p className="text-[10px] text-[#a1a1aa] leading-snug mt-0.5">
                          Featured badge, instant priority matches, and unlimited proposal bits. <span className="text-white">₹499/month sandbox</span>.
                        </p>
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => setIsProSelected(!isProSelected)}
                        className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${isProSelected ? 'bg-primary' : 'bg-zinc-800'}`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all ${isProSelected ? 'left-4.75' : 'left-0.75'}`} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#a1a1aa] font-bold uppercase tracking-wider block">Username or Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={isLogin ? "text" : "email"}
                  required
                  placeholder={isLogin ? "yourname@sample.com or username" : "yourname@sample.com"}
                  value={isLogin ? username : email}
                  onChange={(e) => isLogin ? setUsername(e.target.value) : setEmail(e.target.value)}
                  className="w-full bg-surface-lowest/70 border border-border-dark focus:border-primary/50 text-white rounded-lg pl-10 pr-4 py-2.5 text-xs outline-none transition-all placeholder:text-zinc-650"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#a1a1aa] font-bold uppercase tracking-wider block">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. creativeking"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-surface-lowest/70 border border-border-dark focus:border-primary/50 text-white rounded-lg pl-10 pr-4 py-2.5 text-xs outline-none transition-all placeholder:text-zinc-650"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#a1a1aa] font-bold uppercase tracking-wider block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-lowest/70 border border-border-dark focus:border-primary/50 text-white rounded-lg pl-10 pr-4 py-2.5 text-xs outline-none transition-all placeholder:text-zinc-650"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:brightness-110 disabled:brightness-75 text-on-primary font-bold py-3 rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Secure Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Grant Session' : 'Register & Log in'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {isLogin && (
            <div className="mt-6 pt-5 border-t border-white/5 text-center">
              <p className="text-[11px] text-zinc-500">
                Demo access available. Click <span className="text-primary hover:underline font-semibold cursor-pointer" onClick={() => {
                  setUsername("amit_verma");
                  setPassword("demo123");
                }}>Use Demo Credentials</span> to auto-fill.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
