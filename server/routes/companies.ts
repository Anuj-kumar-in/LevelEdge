import express, { Request, Response } from 'express';
import Company from '../models/Company';
import Salary from '../models/Salary';
import { isUsingMongo, fallbackDb } from '../db';

const router = express.Router();

// GET /api/companies - Get all companies
router.get('/', async (req: Request, res: Response) => {
  try {
    const companies = isUsingMongo ? await Company.find({}).sort({ 'stats.count': -1 }) : fallbackDb.getCompanies();
    res.json(companies);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/companies/:slug - Get specific company details
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    if (isUsingMongo) {
      const company = await Company.findOne({ slug });
      if (!company) return res.status(404).json({ error: 'Company not found' });
      res.json(company);
    } else {
      const companies = fallbackDb.getCompanies();
      const company = companies.find(c => c.slug === slug);
      if (!company) return res.status(404).json({ error: 'Company not found' });
      res.json(company);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/companies/:slug/levels - Level breakdown stats for a single company
router.get('/:slug/levels', async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const salaries = isUsingMongo 
      ? await Salary.find({ companySlug: slug }) 
      : fallbackDb.getSalaries().filter(s => s.companySlug === slug);

    if (salaries.length === 0) {
      return res.json([]);
    }

    // Group by level
    const levelMap: Record<string, any[]> = {};
    salaries.forEach(s => {
      if (!levelMap[s.level]) {
        levelMap[s.level] = [];
      }
      levelMap[s.level].push(s);
    });

    const getMedian = (arr: number[]) => {
      if (arr.length === 0) return 0;
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    };

    const getAverage = (arr: number[]) => {
      if (arr.length === 0) return 0;
      return Math.round(arr.reduce((acc, v) => acc + v, 0) / arr.length);
    };

    const breakdown = Object.entries(levelMap).map(([level, items]) => {
      const tcs = items.map(i => i.tc);
      const bases = items.map(i => i.base);
      const stocks = items.map(i => i.stock);
      const bonuses = items.map(i => i.bonus);
      const yoes = items.map(i => i.yoe);

      return {
        level,
        medianTc: getMedian(tcs),
        medianBase: getMedian(bases),
        medianStock: getMedian(stocks),
        medianBonus: getMedian(bonuses),
        avgYoe: Number(getAverage(yoes).toFixed(1)),
        count: items.length
      };
    });

    // Custom sorting helper (e.g. L3 < L4 < L5, or ICT3 < ICT4, E3 < E4)
    breakdown.sort((a, b) => {
      // Find any digits in the level name
      const numA = parseInt(a.level.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.level.replace(/\D/g, '')) || 0;
      if (numA !== numB) return numA - numB;
      
      // Fallback alphabetical sorting
      return a.level.localeCompare(b.level);
    });

    res.json(breakdown);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/compare - Compare companies
router.get('/compare/data', async (req: Request, res: Response) => {
  try {
    const { slugs } = req.query;
    if (!slugs) return res.status(400).json({ error: 'Missing slugs parameter' });

    const slugList = (slugs as string).split(',');
    
    const results = [];

    for (const slug of slugList) {
      const company = isUsingMongo 
        ? await Company.findOne({ slug }) 
        : fallbackDb.getCompanies().find(c => c.slug === slug);

      if (!company) continue;

      const salaries = isUsingMongo
        ? await Salary.find({ companySlug: slug })
        : fallbackDb.getSalaries().filter(s => s.companySlug === slug);

      // Simple level breakdowns (top 3 levels or entry/mid/senior mapped generic ones)
      // For general comparison, we calculate stats by generic experience levels
      const levelGroups = {
        Entry: salaries.filter(s => s.yoe < 2),
        Mid: salaries.filter(s => s.yoe >= 2 && s.yoe < 5),
        Senior: salaries.filter(s => s.yoe >= 5 && s.yoe < 9),
        Staff: salaries.filter(s => s.yoe >= 9)
      };

      const getMedian = (arr: number[]) => {
        if (arr.length === 0) return 0;
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
      };

      const genericBreakdown = Object.entries(levelGroups).map(([lvlName, items]) => {
        return {
          levelName: lvlName,
          medianTc: getMedian(items.map(i => i.tc)),
          medianBase: getMedian(items.map(i => i.base)),
          medianStock: getMedian(items.map(i => i.stock)),
          medianBonus: getMedian(items.map(i => i.bonus)),
          count: items.length
        };
      });

      results.push({
        companyName: company.name,
        slug: company.slug,
        industry: company.industry,
        hq: company.hq,
        logo: company.logo,
        overallStats: company.stats,
        levels: genericBreakdown
      });
    }

    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
