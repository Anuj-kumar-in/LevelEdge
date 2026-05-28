import companiesSeed from '../../data/companies.json';
import salariesSeed from '../../data/salaries.json';
import type { Company, CompanyComparison, CompanyStats, CompareLevelStats, LevelBreakdown } from '../types/company';
import type { FilterState } from '../types/filters';
import type { Salary, SalaryStats } from '../types/salary';
import { LEVEL_HIERARCHY } from './constants';

const STORAGE_VERSION = '1';
const STORAGE_KEYS = {
  version: 'leveledge.storage.version',
  companies: 'leveledge.storage.companies',
  salaries: 'leveledge.storage.salaries'
} as const;

const DEFAULT_PAGE_SIZE = 20;

const seedCompanies = companiesSeed as Company[];
const seedSalaries = salariesSeed as Salary[];

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `salary-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readJson<T>(key: string, fallback: T) {
  if (!isBrowser()) {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeeded() {
  if (!isBrowser()) {
    return;
  }

  const version = window.localStorage.getItem(STORAGE_KEYS.version);
  if (version === STORAGE_VERSION) {
    return;
  }

  writeJson(STORAGE_KEYS.companies, seedCompanies);
  writeJson(STORAGE_KEYS.salaries, seedSalaries);
  window.localStorage.setItem(STORAGE_KEYS.version, STORAGE_VERSION);
}

function loadCompanies() {
  ensureSeeded();
  return readJson<Company[]>(STORAGE_KEYS.companies, seedCompanies);
}

function loadSalaries() {
  ensureSeeded();
  return readJson<Salary[]>(STORAGE_KEYS.salaries, seedSalaries);
}

function saveSalaries(salaries: Salary[]) {
  writeJson(STORAGE_KEYS.salaries, salaries);
}

function resolveCompanySlug(salary: Pick<Salary, 'companySlug' | 'company'>) {
  return salary.companySlug?.trim() || slugify(salary.company);
}

function median(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 1) {
    return sorted[middle];
  }

  return Math.round((sorted[middle - 1] + sorted[middle]) / 2);
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildStats(records: Salary[]): CompanyStats {
  return {
    medianTc: median(records.map(record => record.tc)),
    medianBase: median(records.map(record => record.base)),
    medianStock: median(records.map(record => record.stock)),
    medianBonus: median(records.map(record => record.bonus)),
    count: records.length
  };
}

function buildSalaryStats(records: Salary[]): SalaryStats {
  return {
    medianTc: median(records.map(record => record.tc)),
    count: records.length,
    avgYoe: Number(average(records.map(record => record.yoe)).toFixed(1))
  };
}

function buildCompanyCatalog() {
  const companies = loadCompanies();
  const salaries = loadSalaries();
  const extras = new Map<string, Company>();

  for (const salary of salaries) {
    const slug = resolveCompanySlug(salary);
    if (companies.some(company => company.slug === slug) || extras.has(slug)) {
      continue;
    }

    extras.set(slug, {
      name: salary.company,
      slug,
      logo: '',
      industry: 'Custom',
      employeeCount: 'N/A',
      hq: 'Unknown',
      website: '',
      description: 'Locally submitted company profile.',
      stats: {
        medianTc: 0,
        medianBase: 0,
        medianStock: 0,
        medianBonus: 0,
        count: 0
      }
    });
  }

  return [...companies, ...extras.values()].map(company => {
    const companyRecords = salaries.filter(record => resolveCompanySlug(record) === company.slug);
    return {
      ...company,
      stats: buildStats(companyRecords)
    };
  });
}

function buildLevelBreakdown(records: Salary[]): LevelBreakdown[] {
  const grouped = new Map<string, Salary[]>();

  for (const record of records) {
    const existing = grouped.get(record.level) || [];
    existing.push(record);
    grouped.set(record.level, existing);
  }

  return [...grouped.entries()]
    .map(([level, items]) => ({
      level,
      medianTc: median(items.map(item => item.tc)),
      medianBase: median(items.map(item => item.base)),
      medianStock: median(items.map(item => item.stock)),
      medianBonus: median(items.map(item => item.bonus)),
      avgYoe: Number(average(items.map(item => item.yoe)).toFixed(1)),
      count: items.length
    }))
    .sort((left, right) => {
      const leftRank = LEVEL_HIERARCHY[left.level] || 999;
      const rightRank = LEVEL_HIERARCHY[right.level] || 999;
      if (leftRank !== rightRank) {
        return leftRank - rightRank;
      }
      return left.level.localeCompare(right.level);
    });
}

function buildComparisonLevels(records: Salary[]): CompareLevelStats[] {
  return buildLevelBreakdown(records).map(level => ({
    levelName: level.level,
    medianTc: level.medianTc,
    medianBase: level.medianBase,
    medianStock: level.medianStock,
    medianBonus: level.medianBonus,
    count: level.count
  }));
}

function matchesFilters(salary: Salary, filters: FilterState) {
  const search = filters.search.trim().toLowerCase();
  const companySlug = resolveCompanySlug(salary);

  if (search) {
    const haystack = [salary.company, salary.role, salary.level, salary.location, companySlug].join(' ').toLowerCase();
    if (!haystack.includes(search)) {
      return false;
    }
  }

  if (filters.company && companySlug !== filters.company) {
    return false;
  }

  if (filters.role && salary.role !== filters.role) {
    return false;
  }

  if (filters.location && salary.location !== filters.location) {
    return false;
  }

  if (filters.minYoe && salary.yoe < Number(filters.minYoe)) {
    return false;
  }

  if (filters.maxYoe && salary.yoe > Number(filters.maxYoe)) {
    return false;
  }

  if (filters.minTc && salary.tc < Number(filters.minTc)) {
    return false;
  }

  if (filters.maxTc && salary.tc > Number(filters.maxTc)) {
    return false;
  }

  return true;
}

function compareValues(left: Salary, right: Salary, sortBy: string) {
  switch (sortBy) {
    case 'company':
      return left.company.localeCompare(right.company);
    case 'role':
      return left.role.localeCompare(right.role);
    case 'tc':
      return left.tc - right.tc;
    case 'yoe':
      return left.yoe - right.yoe;
    case 'date':
      return new Date(left.date).getTime() - new Date(right.date).getTime();
    default:
      return new Date(left.date).getTime() - new Date(right.date).getTime();
  }
}

function sortSalaries(salaries: Salary[], sortBy: string, sortOrder: 'asc' | 'desc') {
  const direction = sortOrder === 'asc' ? 1 : -1;
  return [...salaries].sort((left, right) => compareValues(left, right, sortBy) * direction);
}

function buildAiResponse(prompt: string) {
  const companies = buildCompanyCatalog();
  const salaries = loadSalaries();
  const lowerPrompt = prompt.toLowerCase();
  const matchedCompanies = companies.filter(company =>
    lowerPrompt.includes(company.name.toLowerCase()) || lowerPrompt.includes(company.slug)
  );

  if (matchedCompanies.length >= 2 && lowerPrompt.includes('compare')) {
    const [first, second] = matchedCompanies;
    return {
      response: `### Local comparison

${first.name}: median TC ${first.stats.medianTc}, base ${first.stats.medianBase}, stock ${first.stats.medianStock}, bonus ${first.stats.medianBonus} across ${first.stats.count} records.

${second.name}: median TC ${second.stats.medianTc}, base ${second.stats.medianBase}, stock ${second.stats.medianStock}, bonus ${second.stats.medianBonus} across ${second.stats.count} records.

For negotiation, anchor on the stronger equity grant and ask for a signed written breakdown of base, stock, and bonus.`
    };
  }

  if (matchedCompanies.length > 0) {
    const company = matchedCompanies[0];
    const companyRecords = salaries.filter(record => resolveCompanySlug(record) === company.slug);
    const topLevels = buildLevelBreakdown(companyRecords).slice(0, 3);

    return {
      response: `### ${company.name} snapshot

- Median TC: ${company.stats.medianTc}
- Median Base: ${company.stats.medianBase}
- Median Stock: ${company.stats.medianStock}
- Median Bonus: ${company.stats.medianBonus}
- Records: ${company.stats.count}

### Highest-volume levels

${topLevels
  .map(level => `- ${level.level}: ${level.count} records, median TC ${level.medianTc}`)
  .join('\n')}

Use this as your local market anchor and push for upside in stock or sign-on if the base is already near the median.`
    };
  }

  const topCompanies = [...companies]
    .sort((left, right) => right.stats.medianTc - left.stats.medianTc)
    .slice(0, 3);

  return {
    response: `### Offline salary coach

I’m using the local dataset only, so no API key or backend is required.

### Highest median TC companies

${topCompanies
  .map(company => `- ${company.name}: ${company.stats.medianTc} median TC across ${company.stats.count} records`)
  .join('\n')}

### Practical negotiation baseline

- Ask for the median TC in your level band, not just base.
- Use the strongest comparable company from the local dataset as your anchor.
- If stock is lagging, negotiate for sign-on or a refresh grant instead.
`
  };
}

export const localDb = {
  getStats: async () => buildSalaryStats(loadSalaries()),

  getCompanies: async () => buildCompanyCatalog(),

  getCompanyDetails: async (slug: string) => {
    const company = buildCompanyCatalog().find(item => item.slug === slug);
    if (!company) {
      throw new Error('Company not found');
    }
    return company;
  },

  getCompanyLevels: async (slug: string) => {
    const records = loadSalaries().filter(record => resolveCompanySlug(record) === slug);
    return buildLevelBreakdown(records);
  },

  getSalaries: async (filters: FilterState) => {
    const salaries = loadSalaries().filter(record => matchesFilters(record, filters));
    const sorted = sortSalaries(salaries, filters.sortBy, filters.sortOrder);
    const total = sorted.length;
    const start = Math.max(filters.page - 1, 0) * DEFAULT_PAGE_SIZE;
    const salariesPage = sorted.slice(start, start + DEFAULT_PAGE_SIZE);

    return {
      salaries: salariesPage,
      total,
      page: filters.page,
      totalPages: Math.max(1, Math.ceil(total / DEFAULT_PAGE_SIZE))
    };
  },

  submitSalary: async (salaryData: Omit<Salary, '_id' | 'companySlug' | 'tc' | 'date' | 'verified'>) => {
    const salaries = loadSalaries();
    const companySlug = slugify(salaryData.company);
    const createdSalary: Salary = {
      ...salaryData,
      _id: createId(),
      companySlug,
      tc: Number(salaryData.base) + Number(salaryData.stock) + Number(salaryData.bonus),
      date: new Date().toISOString(),
      verified: false
    };

    salaries.push(createdSalary);
    saveSalaries(salaries);

    return createdSalary;
  },

  compareCompanies: async (slugs: string[]) => {
    const salaries = loadSalaries();
    const companies = buildCompanyCatalog();

    return slugs
      .map(slug => {
        const company = companies.find(item => item.slug === slug);
        if (!company) {
          return null;
        }

        const records = salaries.filter(record => resolveCompanySlug(record) === slug);
        return {
          companyName: company.name,
          slug: company.slug,
          industry: company.industry,
          hq: company.hq,
          logo: company.logo,
          overallStats: buildStats(records),
          levels: buildComparisonLevels(records)
        } satisfies CompanyComparison;
      })
      .filter((value): value is CompanyComparison => value !== null);
  },

  getAiInsights: async (prompt: string) => buildAiResponse(prompt)
};
