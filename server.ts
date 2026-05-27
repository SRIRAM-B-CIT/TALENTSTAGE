/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import {GoogleGenAI, Type} from '@google/genai';
import {createServer as createViteServer} from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy client initialization for Gemini to prevent startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY' && key !== '') {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return aiClient;
}

// 1. API Endpoint: Portfolio Audit
app.post('/api/audit', async (req, res) => {
  const {fullName, title, hourlyRate, skills, description} = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    // Graceful fallback with high-fidelity, customized assessment if API key is missing
    console.warn('GEMINI_API_KEY not set. Using high-fidelity local profile audit fallback.');
    const wordCount = (description || '').trim().split(/\s+/).length;
    let score = 60;
    const passed: string[] = [];
    const warnings: string[] = [];
    const suggestions: {title: string; description: string}[] = [];

    if (fullName) {
      score += 10;
      passed.push('Full Name defined');
    } else {
      warnings.push('Name is blank');
      suggestions.push({
        title: 'Add your professional name',
        description: 'Provide your full name so premium clients can identify you.',
      });
    }

    if (title) {
      score += 10;
      passed.push('Professional title defined');
    } else {
      score -= 10;
      warnings.push('Professional title missing');
      suggestions.push({
        title: 'Craft a highly-specialized title',
        description: 'Specify your exact field (e.g., "Senior Blockchain Security Auditor") to double client interest.',
      });
    }

    if (hourlyRate && Number(hourlyRate) > 0) {
      score += 10;
      passed.push(`Hourly rate established ($${hourlyRate}/hr)`);
    } else {
      score -= 10;
      warnings.push('Hourly rate not set');
      suggestions.push({
        title: 'Set your prime market rate',
        description: 'State an hourly rate aligned with expert benchmarks (typically $80-$180 for high-end creators).',
      });
    }

    if ((skills || '').trim().length > 5) {
      score += 15;
      passed.push('Core skills categorized');
    } else {
      warnings.push('No skill tags provided');
      suggestions.push({
        title: 'Tag technical skill sets',
        description: 'Add at least 3-5 standard skill tags (e.g. "React", "Rust", "NLP") for matching algorithms.',
      });
    }

    if (wordCount > 30) {
      score += 20;
      passed.push('Comprehensive bio description verified');
    } else if (wordCount > 0) {
      score += 5;
      warnings.push('Short profile description');
      suggestions.push({
        title: 'Expand bio details',
        description: 'Describe complex project achievements and tech stacks. Professional bios should be 50-150 words.',
      });
    } else {
      score -= 20;
      warnings.push('Description is completely empty');
      suggestions.push({
        title: 'Write project-focused bio',
        description: 'Explain past client successes, architecture skills, and business outcomes.',
      });
    }

    score = Math.max(10, Math.min(95, score)); // Max 95 for fallback to encourage updating

    // Dynamic tailored recommendations based on actual input values
    if (skills && (skills.toLowerCase().includes('react') || skills.toLowerCase().includes('web3')) && !skills.toLowerCase().includes('d3')) {
      suggestions.push({
        title: 'Incorporate visualization skills',
        description: 'Add D3.js or high-fidelity chart expertise to qualify for top Ethereum Dashboard briefs.',
      });
    }

    return res.json({
      score,
      passedChecks: passed,
      warnings,
      suggestions,
    });
  }

  try {
    const prompt = `You are the TalentStage AI Profile Auditor.
    Evaluate the completeness, professional polish, and alignment of the following freelancer profile:
    - Full Name: ${fullName || 'Not Provided'}
    - Professional Title: ${title || 'Not Provided'}
    - Hourly Rate: $${hourlyRate || '0.00'}/hr
    - Skills Listed: ${skills || 'None'}
    - Bio Description: ${description || 'None'}

    Provide a professional, objective critique. Calculate an overall integrity score (0-100).
    Provide exact, actionable suggestions to raise the score, highlighting potential warnings like insufficient bio length, generic skills, or unaligned rates.
    Return ONLY a valid JSON object matching this schema, without markdown formatting blocks:
    {
      "score": number, 
      "passedChecks": ["check 1 passed", "check 2 passed"], 
      "warnings": ["warning 1", "warning 2"], 
      "suggestions": [{"title": "Suggestion Title", "description": "Specific detail step"}]
    }`;

    const result = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {type: Type.NUMBER, description: 'Aggregated completeness and quality score (0-100)'},
            passedChecks: {type: Type.ARRAY, items: {type: Type.STRING}, description: 'List of checklist criteria that passed'},
            warnings: {type: Type.ARRAY, items: {type: Type.STRING}, description: 'Potential bottlenecks or areas needing attention'},
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {type: Type.STRING, description: 'Short actionable title'},
                  description: {type: Type.STRING, description: 'Detailed step context'},
                },
                required: ['title', 'description'],
              },
            },
          },
          required: ['score', 'passedChecks', 'warnings', 'suggestions'],
        },
      },
    });

    const output = JSON.parse(result.text || '{}');
    return res.json(output);
  } catch (err: any) {
    console.error('Gemini Audit API error:', err);
    return res.status(500).json({error: 'Failed to conduct automated audit', details: err.message});
  }
});

// 2. API Endpoint: AI Scoping Engine
app.post('/api/scope', async (req, res) => {
  const {brief} = req.body;
  if (!brief) {
    return res.status(400).json({error: 'Creative brief is required.'});
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Fast, beautiful semantic simulation for onboarding and landing demo if Gemini is not set up
    console.warn('GEMINI_API_KEY not set. Using local Scoping Engine smart fallback.');
    const briefStr = brief.toLowerCase();

    // Pattern matching to simulate real intelligent scoping
    let title = 'Global Digital Strategy Architecture';
    let category = 'DESIGN & ARCHITECTURE';
    let minBudget = 12000;
    let maxBudget = 18000;
    let duration = '1 - 3 months';
    let level: 'EXPERT LEVEL' | 'MID LEVEL' = 'EXPERT LEVEL';
    let technicalRequirements = [
      'Deconstruct custom visual design assets into fluid vector sets',
      'Optimize micro-interactions with hardware-accelerated layouts',
      'Ensure accessibility (WCAG AA compliance) across high-density grids'
    ];
    let milestones = [
      {title: 'Core Wireframing & UX Map', allocation: '30%'},
      {title: 'Design Token Library & Component Design', allocation: '40%'},
      {title: 'Final Documentation & Handoff', allocation: '30%'}
    ];

    if (briefStr.includes('dashboard') || briefStr.includes('ethereum') || briefStr.includes('web3') || briefStr.includes('validator')) {
      title = 'Ethereum Node Validator Interface';
      category = 'WEB3 / INFRASTRUCTURE';
      minBudget = 8500;
      maxBudget = 14000;
      duration = '1 - 3 months';
      level = 'EXPERT LEVEL';
      technicalRequirements = [
        'Secure WebSocket connection to local node JSON-RPC endpoints',
        'Data-routing layer optimized with D3.js or Recharts rendering loops',
        'Failover telemetry fallback and active signature tracking metrics'
      ];
      milestones = [
        {title: 'RPC Data Architecture Setup', allocation: '25%'},
        {title: 'Real-time WebSocket & Charts Integration', allocation: '50%'},
        {title: 'Telemetry Security Audit & Launch', allocation: '25%'}
      ];
    } else if (briefStr.includes('prompt') || briefStr.includes('interface') || briefStr.includes('ai') || briefStr.includes('llm')) {
      title = 'Prompt Tuning & LLM Evaluation Deck';
      category = 'AI / LLM OPS';
      minBudget = 10000;
      maxBudget = 22000;
      duration = '3 - 6 months';
      level = 'EXPERT LEVEL';
      technicalRequirements = [
        'Interactive A/B side-by-side completion benchmarking model',
        'Markdown rendering with keyboard-shortcut controls',
        'Version control repository for prompt templates'
      ];
      milestones = [
        {title: 'A/B Comparator Engine Shell', allocation: '30%'},
        {title: 'Keyboard Controls & Version Repository', allocation: '40%'},
        {title: 'API Performance Benchmarking', allocation: '30%'}
      ];
    }

    return res.json({
      title,
      category,
      description: `Automated scoping generated for your request: "${brief}"`,
      estimateMin: minBudget,
      estimateMax: maxBudget,
      duration,
      level,
      technicalRequirements,
      milestones,
    });
  }

  try {
    const prompt = `You are the TalentStage AI Scoping Engine.
    Analyze the following creative brief or concept proposal draft:
    "${brief}"

    Deconstruct this brief into professional, actionable components:
    1. A refined, premium title for the role/contract.
    2. A category grouping: e.g. "WEB3 / INFRASTRUCTURE", "AI / LLM OPS", "DESIGN & ARCHITECTURE", or "FINTECH".
    3. Estimated minimum and maximum project budget (in USD, integers).
    4. Duration phrase (e.g., "1 - 3 months", "3 - 6 months").
    5. Difficulty matching tier: "EXPERT LEVEL", "MID LEVEL", "ENTRY LEVEL".
    6. Exact list of structural technical deliverables (3 distinct requirements).
    7. Exact milestone breakout (list of 3 milestones with allocation percentages, e.g. [{title: "Alpha Milestone", allocation: "30%"}]).

    Return ONLY a valid JSON object matching this schema, without markdown formatting blocks:
    {
      "title": "...",
      "category": "...",
      "description": "...",
      "estimateMin": number,
      "estimateMax": number,
      "duration": "...",
      "level": "EXPERT LEVEL" | "MID LEVEL" | "ENTRY LEVEL",
      "technicalRequirements": ["req 1", "req 2", "req 3"],
      "milestones": [{"title": "Milestone title", "allocation": "30%"}]
    }`;

    const result = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {type: Type.STRING},
            category: {type: Type.STRING},
            description: {type: Type.STRING},
            estimateMin: {type: Type.INTEGER},
            estimateMax: {type: Type.INTEGER},
            duration: {type: Type.STRING},
            level: {type: Type.STRING},
            technicalRequirements: {type: Type.ARRAY, items: {type: Type.STRING}},
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {type: Type.STRING},
                  allocation: {type: Type.STRING},
                },
                required: ['title', 'allocation'],
              },
            },
          },
          required: [
            'title',
            'category',
            'description',
            'estimateMin',
            'estimateMax',
            'duration',
            'level',
            'technicalRequirements',
            'milestones',
          ],
        },
      },
    });

    const scoped = JSON.parse(result.text || '{}');
    return res.json(scoped);
  } catch (err: any) {
    console.error('Gemini Scope API error:', err);
    return res.status(500).json({error: 'Failed to deconstruct brief', details: err.message});
  }
});

// Configure Vite middleware in development or serve static build dir in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TalentStage server running on http://localhost:${PORT}`);
  });
}

startServer();
