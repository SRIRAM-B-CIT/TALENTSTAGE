# TalentStage Production Database Architecture: MongoDB Atlas & Prisma ORM

This structural blueprint defines the enterprise-grade MongoDB document-driven data tier for **TalentStage**, an AI-augmented elite creator and technical freelancer platform. It has been engineered for maximum performance, minimal read latency, high-density AI telemetry synchronization, and secure sandbox escrow audits.

---

## 1. Single Account Multi-Role System Design
Rather than duplicating user profiles or requiring multiple logins, TalentStage operates on a **Single Account Multiple Persona** paradigm via the `UserRole` enum (`CLIENT`, `FREELANCER`, `BOTH`). 

```
               [ User Account (MDB User Collection) ]
                     |                     |
            (Role: CLIENT)         (Role: FREELANCER)
                     |                     |
           [ ClientProfile ]         [ FreelancerProfile ]
```

### Profile Completeness Weight Matrix
We calculate user profile completeness dynamically or store it to eliminate expensive query-time traversals:

| Attribute Profile | Contribution Weight | Verification / Metric Rules |
| :--- | :---: | :--- |
| **Profile Photo / Avatar Set** | `10%` | Evaluated against standard non-empty checks. |
| **Headline / Bio Complete** | `15%` | Assesses character length constraints (>80 chars). |
| **Hourly Rate Positioned** | `10%` | Rate defined is greater than `0`. |
| **Minimum 3 Verified Skills** | `20%` | Acquired via the Skill Verification Wizard engine. |
| **Education & Work Experience** | `15%` | Requires at least 1 nested historical entry. |
| **At least 1 Portfolio Case** | `15%` | Checked on Embedded Portfolio projects array. |
| **Identity Verification Badge** | `15%` | Acquired after verifying Student ID or LinkedIn credentials. |
| **TOTAL** | **`100%`** | **Ready for top-tier matchmaking slots.** |

---

## 2. Comprehensive TypeScript Declarations (`/src/types/db.ts`)

```typescript
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'CLIENT' | 'FREELANCER' | 'BOTH';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'FLAGGED';
export type ProjectStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type ProposalStatus = 'PENDING' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';
export type ContractStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'DISPUTED' | 'TERMINATED';
export type MilestoneState = 'UNFUNDED' | 'FUNDED' | 'SUBMITTED' | 'APPROVED' | 'PAID';
export type TransactionType = 'ESCROW_DEPOSIT' | 'ESCROW_RELEASE' | 'PLATFORM_FEE_LOG' | 'WITHDRAWAL' | 'REFUND';

export interface MessageAttachment {
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface PortfolioProject {
  title: string;
  description: string;
  category: string;
  techStack: string[];
  toolsUsed: string[];
  images: string[];
  liveLinks: string[];
  githubLinks: string[];
  measurableOutcomes: string;
  featured: boolean;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date | null;
  current: boolean;
  description: string;
}

export interface EducationHistory {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number | null;
}

export interface Review {
  id: string;
  authorName: string;
  authorId: string;
  rating: number; // 1.0 to 5.0
  text: string;
  createdAt: Date;
}

export interface DbUser {
  id: string;
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  avatar?: string | null;
  bio?: string | null;
  role: UserRole;
  onboardingCompleted: boolean;
  profileCompleteness: number;
  availabilityStatus: boolean;
  location?: string | null;
  timezone: string;
  identityVerification: VerificationStatus;
  linkedinUrl?: string | null;
  studentIdUrl?: string | null;
  aiProfileScore: number;
  proSubscription: boolean;
  createdAt: Date;
  updatedAt: Date;
  conversationIDs: string[];
}

export interface DbFreelancerProfile {
  id: string;
  userId: string;
  headline: string;
  hourlyRate: number;
  yearsOfExperience: number;
  languages: string[];
  education: EducationHistory[];
  experience: WorkExperience[];
  portfolio: PortfolioProject[];
  verifiedSkills: string[];
  normalSkills: string[];
  totalEarnings: number;
  pendingEarnings: number;
  completedProjects: number;
  responseTimeHours: number;
  reviews: Review[];
  socialLinks?: Record<string, string> | null;
}

export interface DbClientProfile {
  id: string;
  userId: string;
  companyName?: string | null;
  companySize?: string | null;
  companyWebsite?: string | null;
  industry?: string | null;
  hiringHistoryCount: number;
  activeProjectsCount: number;
  totalSpending: number;
  savedFreelancerIDs: string[];
  reviews: Review[];
}

export interface DbProject {
  id: string;
  clientId: string;
  title: string;
  description: string;
  requiredSkills: string[];
  budgetMin: number;
  budgetMax: number;
  projectType: string;
  deadline?: Date | null;
  aiGeneratedBrief?: Record<string, any> | null;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbMilestone {
  id: string;
  contractId: string;
  title: string;
  description?: string | null;
  amount: number;
  platformFee: number; // 10%
  payoutAmount: number; // 90%
  submittedFiles: MessageAttachment[];
  approvalState: MilestoneState;
  dueDate?: Date | null;
  paidAt?: Date | null;
}
```

---

## 3. High-Performance MongoDB Indexing Strategy

Prisma compiles indexes to native MongoDB commands. We target compound indexes to prevent full collection table scans:

```prisma
// Defined inside prisma/schema.prisma:
@@index([role])
@@index([identityVerification])
@@index([onboardingCompleted])
```

### Explanations of Indexes Created:
1. **`User` Compound Index (`[onboardingCompleted, role]`)**: Optimized for high-frequency queries that populate candidate directory boards. It filters out incomplete registrations and groups by developer type instantly.
2. **`FreelancerProfile` Compound Index (`[hourlyRate, verifiedSkills]`)**: Powers the search engine. Solves querying for freelancers who charge between $\$40-\$80$ per hour and possess the `EVM Auditing` verified badge.
3. **`Proposal` Compound Index (`[projectId, status]`)**: Optimizes the Client's Scoping Workspace where proposals are sorted and evaluated live against candidate brief scores.
4. **`Message` Compound Index (`[conversationId, createdAt]`)**: Guarantees ultra-fast chat logs fetching. Messages are queried in descending/ascending time order within active chat cards.
5. **`TransactionLedger` Index (`[userId, timestamp]`)**: Enables rapid financial ledger ledger-balancing when withdrawing or funding milestones.

---

## 4. Realistic MongoDB Data Document Payloads

### Complete Client 'User' Document (`users` Collection)
```json
{
  "_id": { "$oid": "664c3995f512da431102db3a" },
  "name": "Arjun Mehta",
  "username": "arjun_mehta",
  "email": "arjun@vortexlabs.ai",
  "passwordHash": "$2b$10$S9dK9z3fA...8g4x3z9K9W",
  "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  "bio": "Founding Engineer at Vortex Labs AI. Building reliable model inference pipelines.",
  "role": "CLIENT",
  "onboardingCompleted": true,
  "profileCompleteness": 90,
  "availabilityStatus": false,
  "location": "Bengaluru, India",
  "timezone": "IST",
  "identityVerification": "VERIFIED",
  "linkedinUrl": "https://linkedin.com/in/arjunmehta-vortex",
  "studentIdUrl": null,
  "aiProfileScore": 88,
  "proSubscription": true,
  "createdAt": { "$date": "2026-05-12T08:00:00Z" },
  "updatedAt": { "$date": "2026-05-27T11:42:00Z" }
}
```

### Complex 'FreelancerProfile' With Composite Sub-Structures (`freelancer_profiles` Collection)
```json
{
  "_id": { "$oid": "664c3c39f1cde4032d184001" },
  "userId": { "$oid": "664c3c39f1cde4032d184000" },
  "headline": "EVM Smart Contract Auditor & Zero Knowledge Proof Engineer",
  "hourlyRate": 120.0,
  "yearsOfExperience": 6.5,
  "languages": ["English", "Hindi", "Solidity"],
  "education": [
    {
      "institution": "Indian Institute of Technology (IIT) Delhi",
      "degree": "B.Tech",
      "field": "Computer Science and Engineering",
      "startYear": 2018,
      "endYear": 2022
    }
  ],
  "experience": [
    {
      "company": "ConsenSys Labs",
      "position": "Lead Protocol Auditor",
      "startDate": { "$date": "2022-06-01T00:00:00Z" },
      "endDate": null,
      "current": true,
      "description": "Secured Web3 protocols storing over $500M TVL. Identified zero-day logic flaws."
    }
  ],
  "portfolio": [
    {
      "title": "Zk-Rollup Escrow Ledger Hub",
      "description": "Optimized transaction rollups with low gas outputs and automated secure state commitment validations.",
      "category": "Smart Contracts",
      "techStack": ["Solidity", "Rust", "Circom"],
      "toolsUsed": ["Foundry", "Slither"],
      "images": ["https://images.unsplash.com/photo-1639762681485-074b7f938ba0"],
      "liveLinks": ["https://zk-escrow-demo.talentstage.dev"],
      "githubLinks": ["https://github.com/consensys/zk-escrow"],
      "measurableOutcomes": "Saved 40% transaction gas; passed 4 internal security audits.",
      "featured": true
    }
  ],
  "verifiedSkills": ["EVM Security", "Solidity", "Smart Contracts"],
  "normalSkills": ["React Engine", "Go", "Zokrates"],
  "totalEarnings": 48500.0,
  "pendingEarnings": 4500.0,
  "completedProjects": 18,
  "responseTimeHours": 1.5,
  "reviews": [
    {
      "id": "rev-932",
      "authorName": "Deepesh Patel",
      "authorId": "664c3995f512da431102db3a",
      "rating": 5.0,
      "text": "The cleanest EVM audit we have ever commissioned. Found 2 critical reentrancy avenues before our deployment.",
      "createdAt": { "$date": "2026-04-18T14:20:00Z" }
    }
  ],
  "socialLinks": {
    "github": "https://github.com/priyanair-auditor",
    "twitter": "https://twitter.com/priyasecurify"
  }
}
```

---

## 5. Modern Server-Side Data Flow (Prisma Transactions)

To maintain database integrity on TalentStage, we utilize **Single-Document atomic operations** or native **MongoDB Session Transactions** inside Cloud Run servers.

Below is the design pattern for **Platform Escrow Deposit & Milestone Funding** with the simulated 10% platform fee deduction:

```
               [ Client funds milestone ]
                           │
       ┌───────────────────┴───────────────────┐
       ▼                                       ▼
 [Create Ledger Entry]                [Update Milestone State]
 - Milestone Amount: ₹80,000           - State -> FUNDED
 - Platform Cut (10%): ₹8,000          - Set paidAt timestamp
 - Freelancer Cut (90%): ₹72,000
       │                                       │
       └───────────────────┬───────────────────┘
                           ▼
               [ Commit / Fail-Safe Rollback ]
```

### Clean Implementation Example (`actions/escrow.ts`)
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function fundMilestoneEscrowSecurely(milestoneId: string, userId: string) {
  // Execute a secure Prisma transaction block to lock and write ledgers simultaneously
  return await prisma.$transaction(async (tx) => {
    
    // 1. Retrieve the milestone in context
    const milestone = await tx.milestone.findUnique({
      where: { id: milestoneId },
      include: { contract: true }
    });
    
    if (!milestone) throw new Error("Target milestone does not exist inside active contracts.");
    if (milestone.approvalState !== 'UNFUNDED') {
      throw new Error("Milestone is already funded or disbursed.");
    }
    
    // 2. Compute financial splits (10% commission rule)
    const originalAmount = milestone.amount;
    const platformFee = Number((originalAmount * 0.10).toFixed(2));
    const finalPayout = Number((originalAmount - platformFee).toFixed(2));
    
    // 3. Update the Milestones Collection
    const updatedMilestone = await tx.milestone.update({
      where: { id: milestoneId },
      data: {
        platformFee: platformFee,
        payoutAmount: finalPayout,
        approvalState: 'FUNDED'
      }
    });
    
    // 4. Update the Client Profile Total Spend metrics
    await tx.clientProfile.update({
      where: { userId: userId },
      data: {
        totalSpending: {
          increment: originalAmount
        }
      }
    });
    
    // 5. Commit record to general transaction ledger for historical balances
    await tx.transactionLedger.create({
      data: {
        userId: userId,
        milestoneId: milestoneId,
        amount: originalAmount,
        platformCut: platformFee,
        type: 'ESCROW_DEPOSIT',
        description: `Funded Milestone: "${milestone.title}" under transaction guidelines.`
      }
    });

    return updatedMilestone;
  });
}
```

---

## 6. Enterprise Data Validation Strategy (Zod Schema Validation)

Using Zod in combination with Prisma guarantees runtime type validation before database inserts occur inside server actions and endpoints.

```typescript
import { z } from 'zod';

// Validate User Account Base Fields
export const baseUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  username: z.string().min(3).regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric"),
  email: z.string().email("Invalid corporate email identifier"),
  role: z.enum(["CLIENT", "FREELANCER", "BOTH"]),
  location: z.string().min(2, "Valid location is required"),
  bio: z.string().max(300, "Bio should fit brief layout boundaries").optional(),
});

// Validate Freelancer Core Profile Setup
export const freelancerProfileSchema = z.object({
  headline: z.string().min(10, "Provide a distinct professional title"),
  hourlyRate: z.number().min(15, "Minimum rate starts at $15/hr").max(1000),
  yearsOfExperience: z.number().min(0).max(50),
  verifiedSkills: z.array(z.string()).default([]),
  normalSkills: z.array(z.string()).min(2, "Select at least 2 core skills"),
});

// Validate Portfolio items before Array modifications
export const portfolioProjectSchema = z.object({
  title: z.string().min(5, "Design case title too short"),
  description: z.string().min(20, "Detailed tech stack description required"),
  category: z.string(),
  techStack: z.array(z.string()).min(1),
  measurableOutcomes: z.string().min(5, "Highlight performance data metrics"),
  featured: z.boolean().default(false)
});
```

---

## 7. Scalable MongoDB Production Recommendations

When deploying TalentStage to a global, enterprise-ready MongoDB Atlas Cluster, adhere to these guidelines:

1. **Leverage MongoDB Atlas Search (`$search`)**: Avoid expensive regex strings (`$regex`) for freelancer skill searches. Configure an **Atlas Search Index** on the `headline`, `verifiedSkills`, and `portfolio` structures to support fast fuzzy matching, scoring, and text highlight feeds.
2. **Configure Automatic TTL (Time-To-Live) on Notifications**: For global real-time notifications or temporary metrics ticker logs, set up a TTL index on `timestamp` to clean documents older than 30 days automatically and minimize storage overhead.
3. **Store Heavy Portfolio Media on Vercel Blob / GCP Bucket**: Never store high-resolution images or PDF Student ID attachments directly on the user document. Securely upload the files to Cloud Block storage and keep only the secure URL identifiers on the MongoDB records.
4. **Use MongoDB Read Preference (Secondary Preferred)**: Direct analytics pipelines, telemetry tickers, and review aggregations to MongoDB secondary cluster read replicas (`Secondary Preferred`) to guarantee that primary nodes maintain ultra-fast response rates under peak load.
