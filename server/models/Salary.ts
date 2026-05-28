import mongoose, { Schema, Document } from 'mongoose';

export interface ISalary extends Document {
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
}

const SalarySchema: Schema = new Schema({
  company: { type: String, required: true, trim: true },
  companySlug: { type: String, required: true, index: true },
  role: { type: String, required: true, trim: true },
  level: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  yoe: { type: Number, required: true, min: 0 },
  yoeCompany: { type: Number, required: true, min: 0 },
  base: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  bonus: { type: Number, default: 0, min: 0 },
  tc: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false }
});

// Calculate TC before saving
SalarySchema.pre<ISalary>('validate', function (next) {
  this.tc = this.base + this.stock + this.bonus;
  next();
});

export default mongoose.models.Salary || mongoose.model<ISalary>('Salary', SalarySchema);
