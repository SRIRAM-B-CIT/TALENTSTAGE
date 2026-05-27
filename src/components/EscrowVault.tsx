/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  HelpCircle, 
  Lock, 
  CreditCard, 
  Info, 
  X, 
  DollarSign, 
  Terminal, 
  CheckCircle, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { ProjectProposal } from '../types';

interface EscrowVaultProps {
  proposal: ProjectProposal;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EscrowVault({ proposal, onClose, onSuccess }: EscrowVaultProps) {
  // Checkbox optional configurations
  const [usePlatformEscrow, setUsePlatformEscrow] = useState(true);
  const [useProSecurity, setUseProSecurity] = useState(false);

  // Credit Card Form states with input formatting
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Checkout states
  const [checkingOut, setCheckingOut] = useState(false);
  const [txReceipt, setTxReceipt] = useState<string | null>(null);

  // Dynamic calculations based on selected proposal budgets
  const subtotal = proposal.fixedPrice || proposal.estimateMin;
  const platformFee = usePlatformEscrow ? subtotal * 0.10 : 0;
  const proFee = useProSecurity ? subtotal * 0.015 : 0;
  const totalEscrow = subtotal + platformFee + proFee;

  // Masking Credit Card spacing helper (e.g. 4111 2222 3333 4444)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += value[i];
    }
    // Limit to standard 16 digits
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  // Masking Expiry Date helper (e.g. 12/28)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    if (value.length <= 5) {
      setExpiry(value);
    }
  };

  // Masking CVV
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleConfirmEscrow = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkingOut) return;

    setCheckingOut(true);
    setTimeout(() => {
      setCheckingOut(false);
      // Generate standard random block hash
      const hash = 'TX_AES_' + Math.random().toString(36).substring(2, 10).toUpperCase() + '_PROT';
      setTxReceipt(hash);
    }, 2000);
  };

  const handleFinalApprove = () => {
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#060609]/75 backdrop-blur-md"
      />

      {/* Main card Dialog (Screen 5 Modal) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-surface-container border border-border-dark w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden relative z-10 font-sans"
      >
        <div className="flex justify-between items-center p-6 border-b border-border-dark">
          <div className="flex items-center gap-2.5">
            <Lock className="text-primary w-5 h-5" />
            <h2 className="text-xl font-bold text-white tracking-tight">Configure Secure Escrow Vault</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border-dark">
          
          {/* Left panel Pricing breakout and sliders */}
          <div className="p-6 space-y-6">
            <div>
              <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest block mb-1">Contract Focus</span>
              <h3 className="text-base font-bold text-white leading-tight font-sans mb-2">{proposal.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">{proposal.description}</p>
            </div>

            {/* Calculations and checkbox togglers */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-zinc-500 uppercase font-black tracking-widest block">Protection Options</span>
              
              {/* Platform Protection Row */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-border-dark/60 flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setUsePlatformEscrow(!usePlatformEscrow)}
                  className={`w-5 h-5 shrink-0 rounded border flex items-center justify-center transition-all cursor-pointer ${
                    usePlatformEscrow ? 'border-primary bg-primary text-background' : 'border-neutral-700 bg-transparent'
                  }`}
                >
                  {usePlatformEscrow && <CheckCircle className="w-3.5 h-3.5 fill-background stroke-[2.5]" />}
                </button>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">Platform Escrow Protection</span>
                    <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase">10.0% standard</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-1 leading-snug">
                    Secures assets inside a multi-sig escrow sandbox, paying creators upon verified milestones.
                  </p>
                </div>
              </div>

              {/* Pro Insurance Premium Protection Row */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-border-dark/60 flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setUseProSecurity(!useProSecurity)}
                  className={`w-5 h-5 shrink-0 rounded border flex items-center justify-center transition-all cursor-pointer ${
                    useProSecurity ? 'border-primary bg-primary text-background' : 'border-neutral-700 bg-transparent'
                  }`}
                >
                  {useProSecurity && <CheckCircle className="w-3.5 h-3.5 fill-background stroke-[2.5]" />}
                </button>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      Pro Security Package
                      <span className="text-[9px] bg-primary/20 text-primary border border-primary/20 px-1.5 py-0.5 rounded uppercase font-black tracking-wider">Advised</span>
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase">1.5% routing</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-1 leading-snug">
                    Includes automatic prompt quality evaluation audits and premium failover routing insurance.
                  </p>
                </div>
              </div>

            </div>

            {/* Calculations break out table */}
            <div className="bg-surface-lowest border border-border-dark p-4 rounded-xl space-y-2.5">
              <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                <span>Milestone Subtotal</span>
                <span className="text-white font-mono">₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                <span>Platform Protection Protection</span>
                <span className="text-white font-mono">₹{platformFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                <span>Pro Pack Protection</span>
                <span className="text-white font-mono">₹{proFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="h-[1px] bg-border-dark.60 my-2" />
              <div className="flex justify-between text-sm font-black text-white">
                <span>Total Escrow Outflow</span>
                <span className="text-primary font-mono text-base">₹{totalEscrow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

          </div>

          {/* Right panel credit card details or receipt lock */}
          <div className="p-6 flex flex-col justify-between">
            {!txReceipt ? (
              <form onSubmit={handleConfirmEscrow} className="space-y-4">
                <span className="text-[10px] font-mono text-zinc-500 uppercase font-black tracking-widest block">Checkout Credentials</span>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-on-surface-variant font-bold uppercase tracking-wider block">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="e.g. Alex Sterling"
                    className="w-full bg-surface-lowest border border-border-dark rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all focus:ring-0"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-on-surface-variant font-bold uppercase tracking-wider block">Card Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                      <CreditCard className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4111 2222 3333 4444"
                      className="w-full bg-surface-lowest border border-border-dark rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all focus:ring-0 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-on-surface-variant font-bold uppercase tracking-wider block">Expiry Date</label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="w-full bg-surface-lowest border border-border-dark rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all focus:ring-0 font-mono text-center"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-on-surface-variant font-bold uppercase tracking-wider block">CVV</label>
                    <input
                      type="password"
                      required
                      value={cvv}
                      onChange={handleCvvChange}
                      placeholder="•••"
                      className="w-full bg-surface-lowest border border-border-dark rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all focus:ring-0 font-mono text-center tracking-widest"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={checkingOut}
                    className="w-full bg-primary hover:brightness-110 text-on-primary py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(78,222,163,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                  >
                    {checkingOut ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Locking Funds...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm &amp; Fund Escrow</span>
                        <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-5 h-full">
                <CheckCircle className="w-14 h-14 text-primary animate-bounce mb-2" />
                
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Escrow Locked Successfully</h3>
                  <p className="text-xs text-on-surface-variant mt-2 max-w-xs leading-relaxed mx-auto">
                    Your funds are protected with absolute multiparty cryptographic escrows. The creator has been notified.
                  </p>
                </div>

                <div className="bg-surface-lowest border border-border-dark p-4 rounded-lg w-full font-mono text-[10px] text-zinc-400">
                  <div className="flex justify-between mb-1.5">
                    <span>STATUS:</span>
                    <span className="text-emerald-500 font-bold uppercase">FUNDED_ACTIVE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SECURE TXID:</span>
                    <span className="text-white font-bold">{txReceipt}</span>
                  </div>
                </div>

                <button
                  onClick={handleFinalApprove}
                  className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Close Transaction Workspace</span>
                </button>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-zinc-500 text-[9px] font-mono justify-center mt-4">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>AES-256 ENCRYPTED BLOCK ROUTING</span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
