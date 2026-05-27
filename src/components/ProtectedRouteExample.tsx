/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { auth } from "../../lib/auth";
import { redirect } from "next/navigation";
import { ShieldCheck, User, Activity, AlertCircle } from "lucide-react";

export default async function ProtectedRouteExample() {
  // 1. Retrieve the session securely on the Server Side. 
  // No client-side layout flashing or round-trips to /api/auth/session.
  const session = await auth();

  // 2. Strict redirect block if the session token is absent
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl font-sans text-zinc-300">
      <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
          Server Component Protection (Auth.js v5)
        </span>
        <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
          <ShieldCheck className="w-3.5 h-3.5" /> SECURE ROOT
        </span>
      </div>

      <div className="p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white tracking-tight leading-none">
            TalentStage Developer Cockpit
          </h1>
          <p className="text-xs text-zinc-400">
            This workspace utilizes Next.js App Router dynamic route interception. Unauthenticated visitors are automatically routed to the portal.
          </p>
        </div>

        {/* Display User Session Metadata securely */}
        <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-850 space-y-4">
          <div className="flex items-center gap-3">
            {session.user?.image ? (
              <img 
                src={session.user.image} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border border-zinc-800"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                <User className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-white leading-none">{session.user?.name}</h3>
              <p className="text-[11px] font-mono text-primary uppercase mt-0.5">{session.user?.role} Account Type</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 text-[11px] font-mono border-t border-zinc-800/60 text-zinc-400">
            <div>
              <span className="text-[9.5px] text-zinc-650 block uppercase font-bold mb-0.5">Secure Email</span>
              <span className="text-zinc-300 truncate block">{session.user?.email}</span>
            </div>
            <div>
              <span className="text-[9.5px] text-zinc-650 block uppercase font-bold mb-0.5">Vercel Session ID</span>
              <span className="text-zinc-300 truncate block">{session.user?.id}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-zinc-950/40 border border-zinc-850 rounded-lg flex items-start gap-2.5 text-[11px] text-zinc-500 leading-normal">
          <AlertCircle className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
          <span>Never expose your session secret hash signatures. Cloud Run containers and edge routers process headers client-side with full TLS encryption.</span>
        </div>
      </div>
    </div>
  );
}
