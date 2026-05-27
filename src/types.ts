/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Talent {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  status: 'Available Now' | 'In Contract';
  successRate: string;
  experience: string;
  skills: string[];
}

export interface Engagement {
  id: string; // #TS-2026-042
  talentId: string;
  talentName: string;
  talentAvatar?: string;
  dateClosed: string; // "Oct 12, 2025"
  status: 'COMPLETED' | 'IN_PROGRESS' | 'IN_REVIEW';
  reviewed: boolean;
  score?: number;
  reviewNotes?: string;
  projectName: string;
}

export interface ProjectProposal {
  id: string;
  title: string;
  category: string;
  description: string;
  estimateMin: number;
  estimateMax: number;
  duration: string;
  level: 'EXPERT LEVEL' | 'MID LEVEL' | 'ENTRY LEVEL';
  roles: string[];
  matchScore: number;
  verified: boolean;
  fixedPrice?: number;
  saved?: boolean;
}

export interface ProfileCore {
  fullName: string;
  title: string;
  hourlyRate: number;
  skills: string;
  companyName: string;
  industry: string;
  websiteUrl: string;
  description: string;
}

export type ActiveScreen =
  | 'landing'
  | 'marketplace'
  | 'client-portal'
  | 'freelancer-console'
  | 'onboarding'
  | 'escrow-vault';
