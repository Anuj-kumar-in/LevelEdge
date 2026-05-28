import axios from 'axios';
import type { Salary, SalaryStats } from '../types/salary';
import type { Company, LevelBreakdown, CompanyComparison } from '../types/company';
import type { FilterState } from '../types/filters';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = {
  // SALARIES
  getSalaries: async (filters: FilterState) => {
    const params: Record<string, any> = { ...filters };
    // Remove empty parameters
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });

    const response = await apiClient.get<{
      salaries: Salary[];
      total: number;
      page: number;
      totalPages: number;
    }>('/salaries', { params });
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get<SalaryStats>('/salaries/stats');
    return response.data;
  },

  submitSalary: async (salaryData: Omit<Salary, '_id' | 'companySlug' | 'tc' | 'date' | 'verified'>) => {
    const response = await apiClient.post<Salary>('/salaries', salaryData);
    return response.data;
  },

  // COMPANIES
  getCompanies: async () => {
    const response = await apiClient.get<Company[]>('/companies');
    return response.data;
  },

  getCompanyDetails: async (slug: string) => {
    const response = await apiClient.get<Company>(`/companies/${slug}`);
    return response.data;
  },

  getCompanyLevels: async (slug: string) => {
    const response = await apiClient.get<LevelBreakdown[]>(`/companies/${slug}/levels`);
    return response.data;
  },

  // COMPARISONS
  compareCompanies: async (slugs: string[]) => {
    const response = await apiClient.get<CompanyComparison[]>('/companies/compare/data', {
      params: { slugs: slugs.join(',') }
    });
    return response.data;
  },

  // AI INSIGHTS
  getAiInsights: async (prompt: string) => {
    const response = await apiClient.post<{ response: string }>('/ai/insights', { prompt });
    return response.data;
  }
};
