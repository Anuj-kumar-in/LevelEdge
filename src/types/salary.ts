export interface Salary {
  _id?: string;
  company: string;
  companySlug: string;
  role: string;
  level: string;
  location: string;
  yoe: number;
  yoeCompany: number;
  base: number;
  stock: number;
  bonus: number;
  tc: number;
  date: string;
  verified: boolean;
}

export interface SalaryStats {
  medianTc: number;
  count: number;
  avgYoe: number;
}
