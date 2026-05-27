/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  User, 
  FileText, 
  Layers, 
  CheckCheck, 
  Upload, 
  Plus, 
  Paperclip,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  BrainCircuit,
  Settings
} from 'lucide-react';
import { ProfileCore } from '../types';

interface InboxProps {
  userProfile: ProfileCore;
  currentUser: any;
  triggerToast: (msg: string) => void;
}

interface Message {
  id: string;
  senderId: 'user' | 'other' | 'system' | 'ai';
  senderName: string;
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    type: string;
    size: string;
  };
}

interface Conversation {
  id: string;
  name: string;
  avatarLetter: string;
  role: string;
  unreadCount: number;
  lastMsg: string;
  online: boolean;
  messages: Message[];
}

export default function Inbox({ userProfile, currentUser, triggerToast }: InboxProps) {
  // Mock conversations reflecting standard Indianized data structure
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      name: 'Rohan Sharma',
      avatarLetter: 'R',
      role: 'Sr. AI Architect',
      unreadCount: 2,
      lastMsg: "Let me check the custom EVM optimization gas fees.",
      online: true,
      messages: [
        {
          id: 'm1',
          senderId: 'other',
          senderName: 'Rohan Sharma',
          text: "Greetings! I looked through the Prompt Tuning and LLM Evaluation brief on TalentStage.",
          timestamp: "10:14 AM"
        },
        {
          id: 'm2',
          senderId: 'user',
          senderName: 'Me',
          text: "Excellent Rohan! We need premium speed metrics and structured schema outputs with low latency.",
          timestamp: "10:16 AM"
        },
        {
          id: 'm3',
          senderId: 'other',
          senderName: 'Rohan Sharma',
          text: "Absolutely. I recommend fine-tuning an unsloth model and routing the outputs through express gateways. Let me check the custom EVM optimization gas fees.",
          timestamp: "10:19 AM"
        }
      ]
    },
    {
      id: 'conv-2',
      name: 'Aarav Patel',
      avatarLetter: 'A',
      role: 'Frontend Systems Designer',
      unreadCount: 0,
      lastMsg: "Will upload the latest Figma token models into Vercel Blob.",
      online: false,
      messages: [
        {
          id: 'a1',
          senderId: 'other',
          senderName: 'Aarav Patel',
          text: "Hey! Setup the responsive bento layouts for the client proposal.",
          timestamp: "Yesterday"
        },
        {
          id: 'a2',
          senderId: 'user',
          senderName: 'Me',
          text: "Looks incredible Aarav. The dark-zinc layout feel very aligned with Linear guidelines.",
          timestamp: "Yesterday"
        },
        {
          id: 'a3',
          senderId: 'other',
          senderName: 'Aarav Patel',
          text: "Thanks! Will upload the latest Figma token models into Vercel Blob.",
          timestamp: "Yesterday"
        }
      ]
    },
    {
      id: 'conv-3',
      name: 'Priya Nair',
      avatarLetter: 'P',
      role: 'Blockchain Auditor',
      unreadCount: 0,
      lastMsg: "Secure multi-sig thresholds are configured in Solidity.",
      online: true,
      messages: [
        {
          id: 'p1',
          senderId: 'other',
          senderName: 'Priya Nair',
          text: "Reviewing the escrow vault code. I identified the reentrancy risk on releaseMilestone.",
          timestamp: "May 25"
        },
        {
          id: 'p2',
          senderId: 'user',
          senderName: 'Me',
          text: "Perfect priya, prevent arbitrary external contract calls before balance modification.",
          timestamp: "May 25"
        },
        {
          id: 'p3',
          senderId: 'other',
          senderName: 'Priya Nair',
          text: "Exactly. Secure multi-sig thresholds are configured in Solidity.",
          timestamp: "May 26"
        }
      ]
    }
  ]);

  const [activeConvId, setActiveConvId] = useState('conv-1');
  const [inputText, setInputText] = useState('');
  
  // Custom attachment files
  const [attachedName, setAttachedName] = useState('');
  const [attachedFile, setAttachedFile] = useState<any>(null);

  // Chat window styling typing indication simulation
  const [isTyping, setIsTyping] = useState(false);

  // AI Assistant states (Column 3)
  const [summaryActive, setSummaryActive] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [agreementDraft, setAgreementDraft] = useState('');
  const [milestonesExtracted, setMilestonesExtracted] = useState<string[]>([]);
  const [processingAI, setProcessingAI] = useState(false);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages list grows
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv.messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim() && !attachedName) return;

    const timestampStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      senderName: 'Me',
      text: inputText,
      timestamp: timestampStr
    };

    if (attachedName) {
      newMsg.attachment = {
        name: attachedName,
        type: 'PDF Deliverable Documents',
        size: '1.4 MB'
      };
    }

    // Update conversation state
    setConversations(prev => 
      prev.map(c => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMsg: inputText || `Sent file: ${attachedName}`,
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );

    setInputText('');
    setAttachedName('');
    setAttachedFile(null);

    // Simulate other user AI-augmented prompt typing back
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "That fits perfectly with our technical expectations. Let's draft the agreement scope.",
        "Understood. Let me coordinate this with our system engineers and push to the repository.",
        "Noted! Appreciate the rapid revision logs. I'll review and fund the milestone escrow now."
      ];
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];

      const automatedReply: Message = {
        id: `msg-${Date.now() + 1}`,
        senderId: 'other',
        senderName: activeConv.name,
        text: selectedResponse,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      setConversations(prev => 
        prev.map(c => {
          if (c.id === activeConvId) {
            return {
              ...c,
              lastMsg: selectedResponse,
              messages: [...c.messages, automatedReply]
            };
          }
          return c;
        })
      );
    }, 2800);
  };

  // Mock file attachment loading selection
  const handleAttachFile = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFile(file);
      setAttachedName(file.name);
      triggerToast(`Attached and cached ${file.name}`);
    }
  };

  // AI Feature triggers
  const triggerConversationSummary = () => {
    setProcessingAI(true);
    setAgreementDraft('');
    setMilestonesExtracted([]);

    // Call server AI proxy or simulate
    setTimeout(() => {
      setProcessingAI(false);
      setSummaryActive(true);
      setSummaryText(`${activeConv.name} and user are aligning on advanced project scoping. Main discussion centers around performance latency optimizations, EVM gas-fee configurations, and custom fine-tuning components. Deliverables are coordinated using React Design Tokens.`);
    }, 1200);
  };

  const triggerDraftAgreementObj = () => {
    setProcessingAI(true);
    setSummaryText('');
    setMilestonesExtracted([]);

    setTimeout(() => {
      setProcessingAI(false);
      setAgreementDraft(`### SERVICES AGREEMENT BY TALENTSTAGE
- **Primary Freelancer**: ${activeConv.name}
- **Escrow Commision Tier**: Premium 10% Platform Deduction Enabled
- **Technical Scope Summary**: Optimize responsive high-density visual widgets, WebSocket connections, and deploy secure modular sub-components.
- **Governing Law**: Governed under Indian Tech Arbitrage parameters.`);
    }, 1500);
  };

  const triggerMilestoneExtraction = () => {
    setProcessingAI(true);
    setSummaryText('');
    setAgreementDraft('');

    setTimeout(() => {
      setProcessingAI(false);
      setMilestonesExtracted([
        "Milestone 1: WebGL Canvas Widget Framework Architecture (30% escrow allocation)",
        "Milestone 2: RPC Websocket Sync Telemetry Feed (40% escrow allocation)",
        "Milestone 3: Final Production Linter & Validation Audit (30% escrow allocation)"
      ]);
    }, 1200);
  };

  return (
    <div className="flex-1 font-sans text-on-surface bg-transparent select-none">
      
      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 bg-zinc-950/60 border border-zinc-800 rounded-2xl h-[calc(100vh-160px)] overflow-hidden shadow-2xl relative">
        
        {/* Column 1: Conversations (Active conversations list) (COL-SPAN 3) */}
        <div className="lg:col-span-3 border-r border-zinc-800 flex flex-col justify-between h-full bg-zinc-900/10">
          <div>
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span>Conversations</span>
              </h2>
              <span className="text-[9.5px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                {conversations.length} OPEN
              </span>
            </div>

            {/* Conversation search and selector lists */}
            <div className="divide-y divide-zinc-800/40 overflow-y-auto max-h-[calc(100vh-220px)]">
              {conversations.map((conv) => {
                const isActive = conv.id === activeConvId;
                return (
                  <button 
                    key={conv.id}
                    onClick={() => {
                      setActiveConvId(conv.id);
                      setConversations(prev => 
                        prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c)
                      );
                    }}
                    className={`w-full text-left p-4 transition-all flex gap-3 items-center cursor-pointer relative ${isActive ? 'bg-zinc-900' : 'hover:bg-zinc-900/40'}`}
                  >
                    {/* Active highlight side dash */}
                    {isActive && <div className="absolute left-0 inset-y-0 w-[2px] bg-primary" />}

                    {/* Avatar structure */}
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 font-sans text-sm font-bold text-white flex items-center justify-center">
                        {conv.avatarLetter}
                      </div>
                      {conv.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-zinc-950" />
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-xs font-bold text-white leading-none truncate block pr-2">{conv.name}</span>
                        {conv.unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-primary text-zinc-950 text-[9px] font-mono font-black flex items-center justify-center shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-400 font-mono tracking-tight uppercase leading-none mb-1">{conv.role}</p>
                      <p className="text-[11px] text-zinc-500 truncate leading-normal">{conv.lastMsg}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-zinc-950/20 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono flex items-center gap-1.5 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>End-to-End Atlas Encrypted</span>
          </div>
        </div>

        {/* Column 2: Active Chat Interface (COL-SPAN 6) */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full relative">
          
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 font-bold text-xs text-zinc-300 flex items-center justify-center">
                {activeConv.avatarLetter}
              </div>
              <div>
                <h3 className="text-xs font-bold text-white leading-none">{activeConv.name}</h3>
                <span className="text-[9.5px] font-mono text-zinc-500 tracking-tight block mt-0.5 uppercase">{activeConv.role}</span>
              </div>
            </div>
            <button className="p-1 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 cursor-pointer">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Messages list */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4 max-h-[calc(100vh-320px)] bg-zinc-950/10">
            {activeConv.messages.map((msg) => {
              const isMe = msg.senderId === 'user';
              return (
                <div 
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-black text-zinc-400 select-none shrink-0">
                    {isMe ? 'U' : activeConv.avatarLetter}
                  </div>
                  <div>
                    <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${isMe ? 'bg-primary/5 border-primary/20 text-white rounded-tr-none' : 'bg-zinc-900/60 border-zinc-850 text-zinc-200 rounded-tl-none'}`}>
                      <p className="font-sans whitespace-pre-wrap">{msg.text}</p>
                      
                      {/* Attached documents preview renderer if present */}
                      {msg.attachment && (
                        <div className="mt-3 p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between gap-3 font-mono text-[10px]">
                          <div className="flex items-center gap-2 text-zinc-300">
                            <FileText className="w-4 h-4 text-primary shrink-0" />
                            <div className="truncate max-w-[120px]">
                              <p className="font-bold text-white leading-none truncate mb-0.5">{msg.attachment.name}</p>
                              <span className="text-zinc-500 text-[9px]">{msg.attachment.size}</span>
                            </div>
                          </div>
                          <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded font-black text-[8px] uppercase">
                            STAGED
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-zinc-600 mt-1 block px-1 text-right">{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {/* Simulated interactive typing sequence */}
            {isTyping && (
              <div className="flex gap-3 max-w-[80%] items-center text-zinc-500">
                <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-black select-none shrink-0">
                  {activeConv.avatarLetter}
                </div>
                <div className="flex gap-1.5 p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl rounded-tl-none">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Form input and files preview block */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/20 space-y-3">
            
            {/* Attachment cached label overlay inside interface box */}
            {attachedName && (
              <div className="flex items-center justify-between bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg text-xs text-primary font-mono select-none">
                <div className="flex items-center gap-1.5 truncate">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span className="truncate">{attachedName}</span>
                </div>
                <button 
                  onClick={() => {
                    setAttachedName('');
                    setAttachedFile(null);
                  }}
                  className="text-primary hover:text-white font-bold ml-2 text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-primary/10"
                >
                  Clear
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <label 
                htmlFor="messageFileInput" 
                className="p-3 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800 rounded-lg cursor-pointer transition-colors shrink-0 flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
                <input 
                  type="file" 
                  id="messageFileInput" 
                  className="hidden" 
                  onChange={handleAttachFile} 
                />
              </label>

              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                placeholder={`Message ${activeConv.name}...`}
                className="flex-1 bg-zinc-950 text-xs text-zinc-100 border border-zinc-800 rounded-lg px-4 py-3 placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-0 transition-colors"
              />

              <button 
                onClick={handleSend}
                disabled={!inputText.trim() && !attachedName}
                className="p-3 bg-primary hover:brightness-110 disabled:opacity-35 text-zinc-950 font-bold rounded-lg cursor-pointer transition-all shrink-0 flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: AI Assistant context actions (COL-SPAN 3) */}
        <div className="lg:col-span-3 border-l border-zinc-800 bg-zinc-950/20 p-5 flex flex-col justify-between h-full space-y-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-800/80">
              <BrainCircuit className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">AI Stage Intelligence</h3>
            </div>

            <p className="text-[11px] text-zinc-500 leading-normal font-sans">
              Conduct AI-augmented operations on top of the active dialogue stream with {activeConv.name}:
            </p>

            <div className="space-y-2">
              <button 
                onClick={triggerConversationSummary}
                disabled={processingAI}
                className="w-full text-left p-3 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-820 rounded-xl text-xs text-zinc-300 hover:text-white transition-all flex items-center justify-between cursor-pointer"
              >
                <span>Summarize Dialogue</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
              </button>

              <button 
                onClick={triggerDraftAgreementObj}
                disabled={processingAI}
                className="w-full text-left p-3 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-820 rounded-xl text-xs text-zinc-300 hover:text-white transition-all flex items-center justify-between cursor-pointer"
              >
                <span>Draft Agreement Contract</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
              </button>

              <button 
                onClick={triggerMilestoneExtraction}
                disabled={processingAI}
                className="w-full text-left p-3 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-820 rounded-xl text-xs text-zinc-300 hover:text-white transition-all flex items-center justify-between cursor-pointer"
              >
                <span>Extract Milestones</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            </div>
          </div>

          {/* Assistant Console Output Pane */}
          <div className="bg-zinc-950 border border-zinc-850/60 rounded-xl p-4 min-h-[160px] max-h-[220px] overflow-y-auto flex flex-col justify-between relative">
            <div className="space-y-2 relative z-10 w-full text-left">
              <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-primary font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>ASSISTANT FEEDBACK</span>
              </div>

              {processingAI ? (
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono py-4">
                  <div className="w-3.5 h-3.5 border border-primary border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>Synthesizing conversation parameters...</span>
                </div>
              ) : (
                <div className="text-[11px] font-sans text-zinc-300 leading-normal scrollbar-none">
                  {summaryActive && <p>{summaryText}</p>}
                  {agreementDraft && (
                    <p className="whitespace-pre-wrap font-mono text-[9.5px] text-zinc-400 bg-zinc-900/50 p-2 rounded border border-zinc-800">{agreementDraft}</p>
                  )}
                  {milestonesExtracted.length > 0 && (
                    <ul className="space-y-1.5 mt-1 list-disc pl-3">
                      {milestonesExtracted.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  )}
                  {!summaryActive && !agreementDraft && milestonesExtracted.length === 0 && (
                    <p className="text-zinc-600 italic">No output drafted. Click an automated prompt to compile live AI feedback.</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Subtle glow accent */}
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          </div>

        </div>

      </div>

    </div>
  );
}
