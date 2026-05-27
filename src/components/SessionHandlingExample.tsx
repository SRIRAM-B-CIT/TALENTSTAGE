/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, User, Sparkles, Loader2, RefreshCw } from "lucide-react";

export default function SessionHandlingExample() {
  // 1. Retrieve current session and network status from the Client-Side context provider
  const { data: session, status, update } = useSession();

  const handleSignOut = () => {
    // End active session client-side and trigger top-level routing redirects
    signOut({ callbackUrl: "/login" });
  };

  const triggerDynamicProfileScoreUpdate = async () => {
    // 2. Simulates updating properties directly in the encrypted JWT session token
    // This calls the callbacks.jwt trigger parameter defined in lib/auth.ts
    await update({
      user: {
        ...session?.user,
        aiProfileScore: 94,
      }
    });
  };

  if (status === "loading") {
    return (
      <div className="w-full max-w-sm mx-auto p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center text-xs font-mono text-zinc-500">
        <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary mb-3" />
        <span>Hydrating Auth.js session cookies...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="w-full max-w-sm mx-auto p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center text-xs font-mono text-zinc-400">
         <span>No session found. Visit authentication portals to unlock dashboards.</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden shadow-xl text-zinc-350 text-xs">
      {/* Subtle background glow */}
      <div className="absolute right-0 top-0 w-24 h-24 bg-primary/2 rounded-full blur-xl pointer-events-none" />

      <header className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
        <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Session State (Client-Side)</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      </header>

      <div className="space-y-4">
        <div className="flex gap-3 items-center">
          <div className="w-9 h-9 rounded-full bg-zinc-850 border border-zinc-800 flex items-center justify-center font-bold text-white uppercase overflow-hidden shrink-0">
            {session.user?.image ? (
              <img src={session.user.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <span>{(session.user?.name || "U")[0]}</span>
            )}
          </div>
          <div>
            <h4 className="text-white font-bold leading-none">{session.user?.name}</h4>
            <span className="text-[10px] text-zinc-500 block mt-0.5 font-mono">@{session.user?.username || 'developer'}</span>
          </div>
        </div>

        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-850/60 font-mono text-[10px] space-y-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span>Score Match Rating</span>
            <span className="text-zinc-300 font-bold">{session.user?.aiProfileScore || 0}% SECURED</span>
          </div>
          <div className="flex justify-between items-center text-zinc-500">
            <span>Corporate Account ID</span>
            <span className="text-zinc-300 truncate max-w-[120px]">{session.user?.id}</span>
          </div>
        </div>

        {/* Option action rows */}
        <div className="space-y-2 pt-2">
          <button
            onClick={triggerDynamicProfileScoreUpdate}
            className="w-full py-2 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-primary" />
            <span>Regenerate Score Tokens</span>
          </button>

          <button
            onClick={handleSignOut}
            className="w-full py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-500/10 hover:border-red-500/30 text-red-400 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Invalidate active Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}
