import express, { Request, Response } from 'express';
import Salary from '../models/Salary';
import Company from '../models/Company';
import { isUsingMongo, fallbackDb } from '../db';

const router = express.Router();

// Helper to normalize company slug
const getSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET /api/salaries - Get all salaries with filters, search, sort, and pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      search,
      company,
      role,
      location,
      minYoe,
      maxYoe,
      minTc,
      maxTc,
      sortBy = 'date',
      sortOrder = 'desc',
      page = '1',
      limit = '50'
    } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 50;
    const skipNum = (pageNum - 1) * limitNum;

    if (isUsingMongo) {
      // Mongoose implementation
      const query: any = {};

      if (search) {
        query.$or = [
          { company: { $regex: search, $options: 'i' } },
          { role: { $regex: search, $options: 'i' } }
        ];
      }
      if (company) query.companySlug = company;
      if (role) query.role = role;
      if (location) query.location = location;

      if (minYoe || maxYoe) {
        query.yoe = {};
        if (minYoe) query.yoe.$gte = parseFloat(minYoe as string);
        if (maxYoe) query.yoe.$lte = parseFloat(maxYoe as string);
      }

      if (minTc || maxTc) {
        query.tc = {};
        if (minTc) query.tc.$gte = parseInt(minTc as string);
        if (maxTc) query.tc.$lte = parseInt(maxTc as string);
      }

      const sortDir = sortOrder === 'asc' ? 1 : -1;
      const sortQuery: any = {};
      sortQuery[sortBy as string] = sortDir;

      const total = await Salary.countDocuments(query);
      const salaries = await Salary.find(query)
        .sort(sortQuery)
        .skip(skipNum)
        .limit(limitNum);

      res.json({
        salaries,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum)
      });
    } else {
      // Local JSON File Fallback implementation
      let salaries = fallbackDb.getSalaries();

      // Search filter
      if (search) {
        const sLower = (search as string).toLowerCase();
        salaries = salaries.filter(
          s => s.company.toLowerCase().includes(sLower) || s.role.toLowerCase().includes(sLower)
        );
      }

      // Exact filters
      if (company) salaries = salaries.filter(s => s.companySlug === company);
      if (role) salaries = salaries.filter(s => s.role === role);
      if (location) salaries = salaries.filter(s => s.location === location);

      // Range filters
      if (minYoe) salaries = salaries.filter(s => s.yoe >= parseFloat(minYoe as string));
      if (maxYoe) salaries = salaries.filter(s => s.yoe <= parseFloat(maxYoe as string));
      if (minTc) salaries = salaries.filter(s => s.tc >= parseInt(minTc as string));
      if (maxTc) salaries = salaries.filter(s => s.tc <= parseInt(maxTc as string));

      // Sorting
      salaries.sort((a, b) => {
        let valA = a[sortBy as string];
        let valB = b[sortBy as string];

        // Date sorting handle
        if (sortBy === 'date') {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      const total = salaries.length;
      const paginatedSalaries = salaries.slice(skipNum, skipNum + limitNum);

      res.json({
        salaries: paginatedSalaries,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum)
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/salaries/stats - Get global aggregate stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    let salaries = isUsingMongo ? await Salary.find({}) : fallbackDb.getSalaries();

    if (salaries.length === 0) {
      return res.json({ medianTc: 0, count: 0, avgYoe: 0 });
    }

    const tcs = salaries.map(s => s.tc).sort((a, b) => a - b);
    const mid = Math.floor(tcs.length / 2);
    const medianTc = tcs.length % 2 !== 0 ? tcs[mid] : Math.round((tcs[mid - 1] + tcs[mid]) / 2);

    const sumYoe = salaries.reduce((acc, s) => acc + s.yoe, 0);
    const avgYoe = Number((sumYoe / salaries.length).toFixed(1));

    res.json({
      medianTc,
      count: salaries.length,
      avgYoe
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/salaries - Submit new salary
router.post('/', async (req: Request, res: Response) => {
  try {
    const { company, role, level, location, yoe, yoeCompany, base, stock = 0, bonus = 0 } = req.body;

    if (!company || !role || !level || !location || yoe === undefined || base === undefined) {
      return res.status(400).json({ error: 'Missing required salary submission fields' });
    }

    const slug = getSlug(company);
    const tc = Number(base) + Number(stock) + Number(bonus);

    const newSalaryData = {
      company,
      companySlug: slug,
      role,
      level,
      location,
      yoe: parseFloat(yoe),
      yoeCompany: parseFloat(yoeCompany || 0),
      base: parseInt(base),
      stock: parseInt(stock),
      bonus: parseInt(bonus),
      tc,
      date: new Date(),
      verified: false
    };

    if (isUsingMongo) {
      const salary = new Salary(newSalaryData);
      await salary.save();

      // Recalculate company stats
      let companyDoc = await Company.findOne({ slug });
      if (!companyDoc) {
        // Create company profile on-the-fly if it doesn't exist yet!
        companyDoc = new Company({
          name: company,
          slug,
          industry: 'Technology',
          employeeCount: '1,000+',
          hq: location,
          description: `Crowdsourced profile for ${company}.`
        });
      }

      const allCompSalaries = await Salary.find({ companySlug: slug });
      const getMedian = (arr: number[]) => {
        if (arr.length === 0) return 0;
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
      };

      companyDoc.stats = {
        medianTc: getMedian(allCompSalaries.map(s => s.tc)),
        medianBase: getMedian(allCompSalaries.map(s => s.base)),
        medianStock: getMedian(allCompSalaries.map(s => s.stock)),
        medianBonus: getMedian(allCompSalaries.map(s => s.bonus)),
        count: allCompSalaries.length
      };

      await companyDoc.save();
      res.status(201).json(salary);
    } else {
      // Local fallback
      const salaries = fallbackDb.getSalaries();
      salaries.push(newSalaryData);
      fallbackDb.saveSalaries(salaries);

      // Recalculate company stats
      const companies = fallbackDb.getCompanies();
      let companyDoc = companies.find(c => c.slug === slug);

      if (!companyDoc) {
        companyDoc = {
          name: company,
          slug,
          logo: '',
          industry: 'Technology',
          employeeCount: '1,000+',
          hq: location,
          website: '',
          description: `Crowdsourced profile for ${company}.`,
          stats: { medianTc: 0, medianBase: 0, medianStock: 0, medianBonus: 0, count: 0 }
        };
        companies.push(companyDoc);
      }

      const compSalaries = salaries.filter(s => s.companySlug === slug);
      const getMedian = (arr: number[]) => {
        if (arr.length === 0) return 0;
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
      };

      companyDoc.stats = {
        medianTc: getMedian(compSalaries.map(s => s.tc)),
        medianBase: getMedian(compSalaries.map(s => s.base)),
        medianStock: getMedian(compSalaries.map(s => s.stock)),
        medianBonus: getMedian(compSalaries.map(s => s.bonus)),
        count: compSalaries.length
      };

      fallbackDb.saveCompanies(companies);
      res.status(201).json(newSalaryData);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
