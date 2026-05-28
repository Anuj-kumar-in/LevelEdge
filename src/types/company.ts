export interface CompanyStats {
  medianTc: number;
  medianBase: number;
  medianStock: number;
  medianBonus: number;
  count: number;
}

export interface Company {
  _id?: string;
  name: string;
  slug: string;
  logo: string;
  industry: string;
  employeeCount: string;
  hq: string;
  website: string;
  description: string;
  stats: CompanyStats;
}

export interface LevelBreakdown {
  level: string;
  medianTc: number;
  medianBase: number;
  medianStock: number;
  medianBonus: number;
  avgYoe: number;
  count: number;
}

export interface CompareLevelStats {
  levelName: string;
  medianTc: number;
  medianBase: number;
  medianStock: number;
  medianBonus: number;
  count: number;
}

export interface CompanyComparison {
  companyName: string;
  slug: string;
  industry: string;
  hq: string;
  logo: string;
  overallStats: CompanyStats;
  levels: CompareLevelStats[];
}
