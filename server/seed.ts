import 'dotenv/config';
import { connectDB, isUsingMongo, fallbackDb } from './db';
import Salary from './models/Salary';
import Company from './models/Company';

const companiesData = [
  { name: 'Google', slug: 'google', logo: 'google.svg', industry: 'Internet & Cloud', employeeCount: '100,000+', hq: 'Mountain View, CA', website: 'https://google.com', description: 'Search, Advertising, Cloud Computing, and Hardware.' },
  { name: 'Meta', slug: 'meta', logo: 'meta.svg', industry: 'Social Media & AR', employeeCount: '60,000+', hq: 'Menlo Park, CA', website: 'https://meta.com', description: 'Social Networking, Virtual Reality, and Messaging Apps.' },
  { name: 'Apple', slug: 'apple', logo: 'apple.svg', industry: 'Consumer Electronics', employeeCount: '150,000+', hq: 'Cupertino, CA', website: 'https://apple.com', description: 'Smartphones, Personal Computers, Wearables, and Services.' },
  { name: 'Microsoft', slug: 'microsoft', logo: 'microsoft.svg', industry: 'Software & Cloud', employeeCount: '220,000+', hq: 'Redmond, WA', website: 'https://microsoft.com', description: 'Operating Systems, Productivity Software, and Azure Cloud.' },
  { name: 'Amazon', slug: 'amazon', logo: 'amazon.svg', industry: 'E-Commerce & Cloud', employeeCount: '1,500,000+', hq: 'Seattle, WA', website: 'https://amazon.com', description: 'E-commerce, AWS Cloud Computing, Streaming, and AI.' },
  { name: 'Netflix', slug: 'netflix', logo: 'netflix.svg', industry: 'Entertainment & Streaming', employeeCount: '12,000+', hq: 'Los Gatos, CA', website: 'https://netflix.com', description: 'Subscription-based Video Streaming Services and Original Content.' },
  { name: 'Stripe', slug: 'stripe', logo: 'stripe.svg', industry: 'Financial Services', employeeCount: '8,000+', hq: 'San Francisco, CA', website: 'https://stripe.com', description: 'Online Payment Processing Software for E-commerce Websites.' },
  { name: 'Airbnb', slug: 'airbnb', logo: 'airbnb.svg', industry: 'Travel & Hospitality', employeeCount: '6,000+', hq: 'San Francisco, CA', website: 'https://airbnb.com', description: 'Online Marketplace for Lodging, Homestays, and Tourism Experiences.' },
  { name: 'Uber', slug: 'uber', logo: 'uber.svg', industry: 'Mobility & Logistics', employeeCount: '30,000+', hq: 'San Francisco, CA', website: 'https://uber.com', description: 'Ride-hailing, Food Delivery, Freight Transport, and Micromobility.' },
  { name: 'NVIDIA', slug: 'nvidia', logo: 'nvidia.svg', industry: 'Semiconductors & AI', employeeCount: '26,000+', hq: 'Santa Clara, CA', website: 'https://nvidia.com', description: 'Graphics Processing Units (GPUs) and Artificial Intelligence Computing.' }
];

const roles = ['Software Engineer', 'Product Manager', 'Data Scientist', 'ML Engineer', 'DevOps Engineer'];
const locations = ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Bangalore, India', 'London, UK'];

const levelsMap: Record<string, string[]> = {
  Google: ['L3', 'L4', 'L5', 'L6', 'L7', 'L8'],
  Meta: ['E3', 'E4', 'E5', 'E6', 'E7', 'E8'],
  Apple: ['ICT3', 'ICT4', 'ICT5', 'ICT6', 'ICT7', 'ICT8'],
  Microsoft: ['SDE (59)', 'SDE II (61)', 'Senior SDE (63)', 'Principal (65)', 'Partner (67)', 'Distinguished (69)'],
  Amazon: ['L4', 'L5', 'L6', 'L7', 'L8', 'L10'],
  Netflix: ['Junior', 'Engineer', 'Senior', 'Staff', 'Principal', 'Partner'],
  Stripe: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'],
  Airbnb: ['G7', 'G8', 'G9', 'G10', 'G11', 'G12'],
  Uber: ['L3', 'L4', 'L5', 'L6', 'L7', 'L8'],
  NVIDIA: ['IC1', 'IC2', 'IC3', 'IC4', 'IC5', 'IC6']
};

type SeedSalary = {
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
  date: Date;
  verified: boolean;
};

function generateRealisticCompensation(company: string, levelIndex: number) {
  // Base scale multiplier based on level (0 = entry, 5 = principal)
  const multiplier = 1 + levelIndex * 0.45;
  const isPremiumPay = ['Google', 'Meta', 'Netflix', 'NVIDIA', 'Stripe'].includes(company);
  const premiumFactor = isPremiumPay ? 1.25 : 1.0;

  // Generate values in Thousands (e.g. 185 instead of 185000)
  const baseVal = Math.round((95 + levelIndex * 35) * premiumFactor * (0.9 + Math.random() * 0.2));
  const stockVal = levelIndex === 0 
    ? Math.round(15 * premiumFactor * Math.random()) 
    : Math.round((15 + Math.pow(levelIndex, 2.2) * 22) * premiumFactor * (0.8 + Math.random() * 0.4));
  const bonusVal = Math.round((baseVal * (0.05 + levelIndex * 0.04)) * (0.8 + Math.random() * 0.4));

  return {
    base: baseVal,
    stock: stockVal,
    bonus: bonusVal,
    tc: baseVal + stockVal + bonusVal
  };
}

export async function seedData() {
  console.log('Generating seed compensation data in thousands...');
  const salaries: SeedSalary[] = [];

  for (let i = 0; i < 600; i++) {
    const companyObj = companiesData[Math.floor(Math.random() * companiesData.length)];
    const roleObj = roles[Math.floor(Math.random() * roles.length)];
    const locationObj = locations[Math.floor(Math.random() * locations.length)];
    
    // Level selection
    const companyLevels = levelsMap[companyObj.name] || ['Junior', 'Mid', 'Senior'];
    const levelIdx = Math.floor(Math.random() * companyLevels.length);
    const level = companyLevels[levelIdx];

    // YOE calculations
    const yoe = Math.max(levelIdx * 2.5 + Math.floor(Math.random() * 3) - 1, 0);
    const yoeCompany = Math.max(Math.floor(Math.random() * Math.min(yoe + 1, 6)), 0);

    const comp = generateRealisticCompensation(companyObj.name, levelIdx);
    
    // Scale down compensation for Bangalore (cost of living adjustment)
    if (locationObj.includes('Bangalore')) {
      comp.base = Math.round(comp.base * 0.4);
      comp.stock = Math.round(comp.stock * 0.5);
      comp.bonus = Math.round(comp.bonus * 0.4);
      comp.tc = comp.base + comp.stock + comp.bonus;
    } else if (locationObj.includes('London')) {
      comp.base = Math.round(comp.base * 0.75);
      comp.stock = Math.round(comp.stock * 0.8);
      comp.bonus = Math.round(comp.bonus * 0.75);
      comp.tc = comp.base + comp.stock + comp.bonus;
    }

    const submissionDate = new Date();
    submissionDate.setDate(submissionDate.getDate() - Math.floor(Math.random() * 365));

    salaries.push({
      company: companyObj.name,
      companySlug: companyObj.slug,
      role: roleObj,
      level: level,
      location: locationObj,
      yoe: Number(yoe.toFixed(1)),
      yoeCompany: Number(yoeCompany.toFixed(1)),
      base: comp.base || 0,
      stock: comp.stock || 0,
      bonus: comp.bonus || 0,
      tc: comp.tc || 0,
      date: submissionDate,
      verified: Math.random() > 0.3
    });
  }

  // Calculate company aggregated stats
  const companies = companiesData.map(c => {
    const compSalaries = salaries.filter(s => s.companySlug === c.slug);
    const count = compSalaries.length;

    // Calculate median helper
    const getMedian = (arr: number[]) => {
      if (arr.length === 0) return 0;
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    };

    const tcs = compSalaries.map(s => s.tc);
    const bases = compSalaries.map(s => s.base);
    const stocks = compSalaries.map(s => s.stock);
    const bonuses = compSalaries.map(s => s.bonus);

    return {
      ...c,
      stats: {
        medianTc: getMedian(tcs),
        medianBase: getMedian(bases),
        medianStock: getMedian(stocks),
        medianBonus: getMedian(bonuses),
        count
      }
    };
  });

  if (isUsingMongo) {
    try {
      await Salary.collection.drop().catch(() => {});
      await Company.collection.drop().catch(() => {});
      await Salary.insertMany(salaries);
      await Company.insertMany(companies);
      console.log('MongoDB successfully seeded with thousands-scale records!');
    } catch (e: any) {
      console.error('Error seeding MongoDB:', e.message);
    }
  } else {
    fallbackDb.saveSalaries(salaries);
    fallbackDb.saveCompanies(companies);
    console.log('In-memory fallback successfully seeded with thousands-scale records!');
  }
}

// Seed execution logic
if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  (async () => {
    await connectDB();
    await seedData();
    process.exit(0);
  })();
}
