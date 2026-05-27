/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function LoginFormIntegrator() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // 1. Invoke the NextAuth credentials provider endpoint directly
      // redirect: false prevents browser hard-reloads so we can render elegant micro-interactions
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error === "CredentialsSignin" 
          ? "Account credentials match verification failure. Check details and retry." 
          : result.error
        );
      }

      setLoading(false);
      setSuccessMsg("Session granted dynamically! Preparing developer cockpit...");
      
      // 2. Perform smooth route matching redirect after feedback timeout
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1000);

    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Authenticating gateway offline. Retry shortly.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="mb-6">
        <h2 className="text-xl font-bold font-sans text-white tracking-tight">Access Account Securely</h2>
        <p className="text-xs text-zinc-400 mt-1">Authenticating directly with Auth.js v5 JWT protocols over MongoDB Atlas.</p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3 px-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-5 p-3 px-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider block">Username or Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              type="text"
              required
              placeholder="e.g. sriram_creator"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-primary/50 text-white rounded-lg pl-10 pr-4 py-2.5 text-xs outline-none transition-colors placeholder:text-zinc-700"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider block">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-primary/50 text-white rounded-lg pl-10 pr-4 py-2.5 text-xs outline-none transition-colors placeholder:text-zinc-700"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 bg-primary hover:brightness-105 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/5"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Validating Session Hash...</span>
            </>
          ) : (
            <>
              <span>Initialize Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
