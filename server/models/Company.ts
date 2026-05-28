import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  slug: string;
  logo: string;
  industry: string;
  employeeCount: string;
  hq: string;
  website: string;
  description: string;
  stats: {
    medianTc: number;
    medianBase: number;
    medianStock: number;
    medianBonus: number;
    count: number;
  };
}

const CompanySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  logo: { type: String, default: '' },
  industry: { type: String, default: 'Technology' },
  employeeCount: { type: String, default: '10,000+' },
  hq: { type: String, default: 'Silicon Valley, CA' },
  website: { type: String, default: '' },
  description: { type: String, default: '' },
  stats: {
    medianTc: { type: Number, default: 0 },
    medianBase: { type: Number, default: 0 },
    medianStock: { type: Number, default: 0 },
    medianBonus: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
});

export default mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);
