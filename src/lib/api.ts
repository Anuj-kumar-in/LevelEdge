import type { Salary } from '../types/salary';
import type { FilterState } from '../types/filters';
import { localDb } from './localDb';

export const api = {
  getSalaries: async (filters: FilterState) => {
    return localDb.getSalaries(filters);
  },

  getStats: async () => {
    return localDb.getStats();
  },

  submitSalary: async (salaryData: Omit<Salary, '_id' | 'companySlug' | 'tc' | 'date' | 'verified'>) => {
    return localDb.submitSalary(salaryData);
  },

  getCompanies: async () => {
    return localDb.getCompanies();
  },

  getCompanyDetails: async (slug: string) => {
    return localDb.getCompanyDetails(slug);
  },

  getCompanyLevels: async (slug: string) => {
    return localDb.getCompanyLevels(slug);
  },

  compareCompanies: async (slugs: string[]) => {
    return localDb.compareCompanies(slugs);
  },

  getAiInsights: async (prompt: string) => {
    return localDb.getAiInsights(prompt);
  }
};
