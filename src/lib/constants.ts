export const AVAILABLE_ROLES = [
  'Software Engineer',
  'Product Manager',
  'Data Scientist',
  'ML Engineer',
  'DevOps Engineer'
];

export const AVAILABLE_LOCATIONS = [
  'San Francisco, CA',
  'New York, NY',
  'Seattle, WA',
  'Austin, TX',
  'Bangalore, India',
  'London, UK'
];

export const AVAILABLE_COMPANIES = [
  { name: 'Google', slug: 'google' },
  { name: 'Meta', slug: 'meta' },
  { name: 'Apple', slug: 'apple' },
  { name: 'Microsoft', slug: 'microsoft' },
  { name: 'Amazon', slug: 'amazon' },
  { name: 'Netflix', slug: 'netflix' },
  { name: 'Stripe', slug: 'stripe' },
  { name: 'Airbnb', slug: 'airbnb' },
  { name: 'Uber', slug: 'uber' },
  { name: 'NVIDIA', slug: 'nvidia' }
];

export const COMPANY_LEVELS: Record<string, string[]> = {
  google: ['L3', 'L4', 'L5', 'L6', 'L7', 'L8'],
  meta: ['E3', 'E4', 'E5', 'E6', 'E7', 'E8'],
  apple: ['ICT3', 'ICT4', 'ICT5', 'ICT6', 'ICT7', 'ICT8'],
  microsoft: ['SDE (59)', 'SDE II (61)', 'Senior SDE (63)', 'Principal (65)', 'Partner (67)', 'Distinguished (69)'],
  amazon: ['L4', 'L5', 'L6', 'L7', 'L8', 'L10'],
  netflix: ['Junior', 'Engineer', 'Senior', 'Staff', 'Principal', 'Partner'],
  stripe: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'],
  airbnb: ['G7', 'G8', 'G9', 'G10', 'G11', 'G12'],
  uber: ['L3', 'L4', 'L5', 'L6', 'L7', 'L8'],
  nvidia: ['IC1', 'IC2', 'IC3', 'IC4', 'IC5', 'IC6']
};

export const LEVEL_HIERARCHY: Record<string, number> = {
  // Google/Meta/Apple/Microsoft/NVIDIA leveling mapping
  'L3': 1, 'E3': 1, 'ICT3': 1, 'L1': 1, 'IC1': 1, 'Junior': 1, 'SDE (59)': 1, 'G7': 1,
  'L4': 2, 'E4': 2, 'ICT4': 2, 'L2': 2, 'IC2': 2, 'Engineer': 2, 'SDE II (61)': 2, 'G8': 2,
  'L5': 3, 'E5': 3, 'ICT5': 3, 'IC3': 3, 'Senior': 3, 'Senior SDE (63)': 3, 'G9': 3,
  'L6': 4, 'E6': 4, 'ICT6': 4, 'IC4': 4, 'Staff': 4, 'Principal (65)': 4, 'G10': 4,
  'L7': 5, 'E7': 5, 'ICT7': 5, 'IC5': 5, 'Principal': 5, 'Partner (67)': 5, 'G11': 5,
  'L8': 6, 'E8': 6, 'ICT8': 6, 'IC6': 6, 'Partner': 6, 'Distinguished (69)': 6, 'G12': 6,
  'L10': 7
};

export function getGenericLevelName(level: string): 'Entry' | 'Mid' | 'Senior' | 'Staff' | 'Principal' | 'Partner' | 'Distinguished' {
  const index = LEVEL_HIERARCHY[level] || 1;
  const names: ('Entry' | 'Mid' | 'Senior' | 'Staff' | 'Principal' | 'Partner' | 'Distinguished')[] = [
    'Entry', 'Mid', 'Senior', 'Staff', 'Principal', 'Partner', 'Distinguished'
  ];
  return names[Math.min(index - 1, names.length - 1)];
}
