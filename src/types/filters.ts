export interface FilterState {
  search: string;
  company: string;
  role: string;
  location: string;
  minYoe: string;
  maxYoe: string;
  minTc: string;
  maxTc: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
}

export const initialFilterState: FilterState = {
  search: '',
  company: '',
  role: '',
  location: '',
  minYoe: '',
  maxYoe: '',
  minTc: '',
  maxTc: '',
  sortBy: 'date',
  sortOrder: 'desc',
  page: 1
};
