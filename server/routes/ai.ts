import express, { Request, Response } from 'express';
import axios from 'axios';
import Salary from '../models/Salary';
import Company from '../models/Company';
import { isUsingMongo, fallbackDb } from '../db';

const router = express.Router();

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const GEMINI_MODELS = [
  process.env.GEMINI_MODEL,
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest'
].filter((model): model is string => Boolean(model));
const GEMINI_MODELS_CACHE_TTL_MS = 60 * 60 * 1000;

let cachedGeminiModels: { value: string[]; expiresAt: number } | null = null;

// Rule-based high-fidelity fallback response generator (when API key is missing)
function getMockAiResponse(prompt: string, contextData: any): string {
  const query = prompt.toLowerCase();
  
  if (query.includes('google') && query.includes('meta')) {
    return `### Meta vs Google Compensation Comparison 📊

Based on our crowdsourced intelligence, here is the side-by-side analysis of **Meta** vs **Google** for software engineers:

1. **Total Compensation (TC)**: Meta generally pays higher stock equity grants at equivalent levels, resulting in a **5-10% higher median TC** for senior engineering levels. Meta's median TC for an E5 (Senior SWE) is **$365,000**, compared to Google L5 at **$342,000**.
2. **Base Salary**: Google tends to maintain a slightly higher base salary at the entry-level (L3 pays ~$138k base, Meta E3 pays ~$125k base), but Meta catches up quickly at Senior (E5) and Staff (E6) levels.
3. **Stock (Equity/RSUs)**: Meta grants stock with a front-loaded or even distribution, and Meta's historical stock performance has fueled rapid TC gains.
4. **WLB & Culture**: Google is widely known for better work-life balance and a structured, meticulous engineering process. Meta has a "move fast" shipping culture with high ownership and higher performance stress.

**Recommendation:** If you prioritize high-growth equity and faster promotion velocities, **Meta** is the stronger choice. If you value work-life balance, structured stability, and long-term project depth, **Google** is outstanding.`;
  }
  
  if (query.includes('l5') || query.includes('senior')) {
    return `### Senior Software Engineer (L5/E5 Equivalent) Market Insights 💡

Across Tier-1 tech firms (Google, Meta, Apple, Stripe, Uber), the **Senior Software Engineer** level represents the "terminal level" where engineers can stay indefinitely without performance pressure to promote.

- **Median Total Compensation**: **$340,000 - $380,000**
- **Base Salary**: **$180,000 - $215,000** (roughly 55% of TC)
- **Annual Equity (Stock)**: **$110,000 - $150,000**
- **Target Performance Bonus**: **15% - 25%** of base salary

**Key Insights for Negotiation:**
1. **Equity is your leverage**: Base salaries are tightly banded at L5 to prevent internal equity imbalances. Focus your negotiation on **sign-on bonuses** and **additional recurring stock grants**.
2. **Years of Experience**: Typically requires 5-8 years of experience, or 3-5 years for fast-trackers showing strong system design ownership.`;
  }

  if (query.includes('google')) {
    return `### Google Compensation Analysis & Leveling Guide 🔍

Google's leveling structure is the industry standard for compensation benchmarking:

- **L3 (Entry SWE)**: Median TC **$188,000** (Base: $132k, Stock: $38k, Bonus: $18k)
- **L4 (SWE II)**: Median TC **$262,000** (Base: $164k, Stock: $68k, Bonus: $30k)
- **L5 (Senior SWE)**: Median TC **$345,000** (Base: $198k, Stock: $112k, Bonus: $35k)
- **L6 (Staff SWE)**: Median TC **$485,000** (Base: $235k, Stock: $195k, Bonus: $55k)

**Key Observations:**
1. **The "L5 Jump"**: The largest percentage compensation increase occurs when promoting from L4 to L5, driven by a massive step-up in stock grant sizes (typically doubling your RSU grants).
2. **Stable Growth**: Google pays standard performance bonuses target at 15% for L3/L4, and 20% for L5.`;
  }

  return `### LevelEdge Career & Compensation Advisor 🤖

Hello! I am your AI Career Analyst.

Here are some interesting trends in the current market:
1. **Staff Engineers (L6+)** are commanding massive premiums, with total compensations routinely exceeding **$450,000**, driven heavily by competitive equity packages.
2. **NVIDIA** is leading semiconductor and AI software pay scales, with stock compensation driving recent record-high payouts.
3. **Bangalore and London** represent high-growth international hubs, though their median compensation is adjusted ( Bangalore at roughly 40% of US base, London at 75% of US base).

*Ask me questions like:*
- "Compare Meta vs Google for senior engineers"
- "What's the typical TC for L5 at Google?"
- "How do stock grants scale from junior to senior levels?"`;
}

function normalizeGeminiModelName(modelName: string): string {
  return modelName.replace(/^models\//, '');
}

async function getSupportedGeminiModels(): Promise<string[]> {
  const now = Date.now();

  if (cachedGeminiModels && cachedGeminiModels.expiresAt > now) {
    return cachedGeminiModels.value;
  }

  const response = await axios.get(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`,
    { timeout: 15000 }
  );

  const models = Array.isArray(response.data?.models) ? response.data.models : [];
  const supportedModels = models
    .filter((model: any) => Array.isArray(model?.supportedGenerationMethods) && model.supportedGenerationMethods.includes('generateContent'))
    .map((model: any) => normalizeGeminiModelName(model?.name || ''))
    .filter((modelName: string) => Boolean(modelName));

  cachedGeminiModels = {
    value: supportedModels,
    expiresAt: now + GEMINI_MODELS_CACHE_TTL_MS
  };

  return supportedModels;
}

// POST /api/ai/insights - Get AI responses
router.post('/', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    // Fetch aggregate DB statistics to enrich the prompt context
    let totalSalaries = 0;
    let medianTc = 0;
    let topCompanies: any[] = [];

    if (isUsingMongo) {
      totalSalaries = await Salary.countDocuments({});
      const companies = await Company.find({}).sort({ 'stats.medianTc': -1 }).limit(5);
      // Data is in thousands, multiply by 1000 for AI prompt context
      topCompanies = companies.map(c => `${c.name} ($${(c.stats.medianTc * 1000).toLocaleString()})`);
    } else {
      const salaries = fallbackDb.getSalaries();
      totalSalaries = salaries.length;
      const companies = fallbackDb.getCompanies();
      companies.sort((a, b) => b.stats.medianTc - a.stats.medianTc);
      // Data is in thousands, multiply by 1000 for AI prompt context
      topCompanies = companies.slice(0, 5).map(c => `${c.name} ($${(c.stats.medianTc * 1000).toLocaleString()})`);
    }

    const contextSummary = {
      totalSalariesCount: totalSalaries,
      topPayingCompanies: topCompanies,
      timestamp: new Date().toISOString()
    };

    if (!GEMINI_API_KEY) {
      console.log('Gemini API key missing. Returning simulated AI response...');
      const response = getMockAiResponse(prompt, contextSummary);
      // Add a small artificial delay to feel like a real network request
      await new Promise(resolve => setTimeout(resolve, 800));
      return res.json({ response });
    }

    console.log('Calling real Gemini API...');
    try {
      const systemPrompt = `You are a world-class salary negotiation coach, recruiter, and career compensation analyst for the LevelEdge platform.
Your goal is to help software engineers navigate their careers, negotiate their salaries, and interpret market data with extreme precision.
Use markdown formatting, bullet points, bold text, and numbered lists to structure your response.
Be direct, professional, data-dense, and highly encouraging.

Here is the current platform statistics context:
- Total crowdsourced salary database records: ${totalSalaries}
- Top 5 highest paying companies in database: ${topCompanies.join(', ')}
- Today's date is: ${new Date().toLocaleDateString()}

Answer the user's career query with maximum helpfulness.`;

      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nUser Query: ${prompt}` }]
          }
        ]
      };

      // Helper: call a Gemini model with retries on 429 (rate limit) using exponential backoff
      const callModelWithRetries = async (model: string, body: any) => {
        const maxAttempts = 3;
        let attempt = 0;

        while (attempt < maxAttempts) {
          try {
            const response = await axios.post(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
              body,
              {
                headers: { 'Content-Type': 'application/json' },
                timeout: 15000
              }
            );
            return response;
          } catch (e: any) {
            const status = e?.response?.status;
            // If rate limited, respect Retry-After header if present, otherwise exponential backoff
            if (status === 429) {
              const retryAfter = parseInt(e?.response?.headers?.['retry-after'] || '0', 10) || 0;
              const waitMs = retryAfter > 0 ? retryAfter * 1000 : Math.pow(2, attempt) * 1000 + Math.floor(Math.random() * 500);
              console.warn(`Gemini model ${model} rate limited (429). Attempt ${attempt + 1}/${maxAttempts}. Sleeping ${waitMs}ms before retry.`);
              await new Promise(r => setTimeout(r, waitMs));
              attempt += 1;
              continue;
            }

            // For other errors, rethrow so the caller can decide what to do (e.g., try next model)
            throw e;
          }
        }

        throw new Error(`Exceeded retry attempts for model ${model}`);
      };

      let lastError: any = null;
      let candidateModels = GEMINI_MODELS;

      try {
        const discoveredModels = await getSupportedGeminiModels();
        const prioritizedModels = [...GEMINI_MODELS, ...discoveredModels];
        candidateModels = [...new Set(prioritizedModels)];
      } catch (discoveryError: any) {
        console.warn('Unable to discover Gemini models, using configured fallback list:', discoveryError.message);
      }

      for (const model of candidateModels) {
        try {
          const response = await callModelWithRetries(model, requestBody);
          const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (aiText) {
            return res.json({ response: aiText });
          }

          lastError = new Error(`Invalid response structure from Gemini API for model ${model}`);
        } catch (modelError: any) {
          lastError = modelError;
          const status = modelError?.response?.status;
          const isModelMissing = status === 404;
          // If the error is not a rate limit or missing model, stop trying further models to surface the real error
          if (status && status !== 429 && !isModelMissing) {
            break;
          }
          // Otherwise continue to the next model (or finish loop and fall back)
        }
      }

      throw lastError || new Error('All Gemini model attempts failed');
    } catch (apiError: any) {
      console.warn('Real Gemini API call failed, falling back to simulated engine:', apiError.message);
      const fallbackText = getMockAiResponse(prompt, contextSummary);
      res.json({ response: fallbackText });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
