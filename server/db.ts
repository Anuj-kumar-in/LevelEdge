import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/level_edge';

export let isUsingMongo = false;

export async function connectDB() {
  try {
    console.log(`Attempting to connect to MongoDB at: ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    isUsingMongo = true;
    console.log('MongoDB connected successfully!');
    return true;
  } catch (error: any) {
    console.error('\n======================================================');
    console.error('ERROR: Failed to connect to MongoDB.');
    console.error(`Reason: ${error.message}`);
    console.error('Falling back to in-memory data so the app can still run.');
    console.error('======================================================\n');
    isUsingMongo = false;
    return false;
  }
}

type StoreDoc = Record<string, any>;

let fallbackSalaries: StoreDoc[] = [];
let fallbackCompanies: StoreDoc[] = [];

export const fallbackDb = {
  getSalaries: (): StoreDoc[] => fallbackSalaries,
  saveSalaries: (salaries: StoreDoc[]) => {
    fallbackSalaries = salaries;
  },
  getCompanies: (): StoreDoc[] => fallbackCompanies,
  saveCompanies: (companies: StoreDoc[]) => {
    fallbackCompanies = companies;
  },
  clear: () => {
    fallbackSalaries = [];
    fallbackCompanies = [];
  }
};
