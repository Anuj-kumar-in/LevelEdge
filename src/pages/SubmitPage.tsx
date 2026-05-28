import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, Sparkles, AlertCircle, CheckCircle2, 
  Building2, Briefcase, MapPin, DollarSign, Calendar
} from 'lucide-react';
import { api } from '../lib/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { formatCurrency } from '../lib/formatters';
import { AVAILABLE_COMPANIES, AVAILABLE_ROLES, AVAILABLE_LOCATIONS, COMPANY_LEVELS } from '../lib/constants';

export default function SubmitPage() {
  const navigate = useNavigate();
  
  // Form State
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const [location, setLocation] = useState('');
  const [yoe, setYoe] = useState('');
  const [yoeCompany, setYoeCompany] = useState('');
  const [base, setBase] = useState('');
  const [stock, setStock] = useState('');
  const [bonus, setBonus] = useState('');

  // UI States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Auto-calculated TC
  const totalComp = Number(base || 0) + Number(stock || 0) + Number(bonus || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Safe Validations
    if (!company.trim()) return setError('Please select or specify a company.');
    if (!role.trim()) return setError('Please select a job role.');
    if (!level.trim()) return setError('Please specify your level (e.g. L4, E5).');
    if (!location.trim()) return setError('Please select your location.');
    if (!yoe || Number(yoe) < 0) return setError('Years of Experience must be a positive number.');
    if (!base || Number(base) <= 0) return setError('Base Salary must be greater than zero.');
    if (Number(yoeCompany) > Number(yoe)) return setError('Years at Company cannot exceed total Years of Experience.');

    setSubmitting(true);
    try {
      await api.submitSalary({
        company,
        role,
        level,
        location,
        yoe: parseFloat(yoe),
        yoeCompany: parseFloat(yoeCompany || '0'),
        base: parseInt(base),
        stock: parseInt(stock || '0'),
        bonus: parseInt(bonus || '0')
      });
      setSuccess(true);
    } catch (e: any) {
      console.error('Error submitting salary:', e);
      setError(e.response?.data?.error || 'Failed to submit pay details. Please verify your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  const getAvailableLevelsForCompany = () => {
    const slug = company.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return COMPANY_LEVELS[slug] || [];
  };

  if (success) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 min-h-[70vh] flex flex-col justify-center">
        <Card hoverable={false} className="border-slate-200 bg-white shadow-lg text-center p-8 flex flex-col items-center">
          
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-6 shadow-inner animate-bounce">
            <CheckCircle2 size={32} />
          </div>

          <h1 className="text-2xl font-black text-navy tracking-tight mb-2">
            Pay Shared Successfully!
          </h1>
          
          <p className="text-xs text-slate-500 max-w-sm mb-8 leading-relaxed">
            Thank you for contributing to the community! Your anonymous pay submission is now registered in our database, helping others negotiate fair compensation.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
              onClick={() => navigate('/salaries')}
              className="btn-primary py-3 px-6 text-center"
            >
              Browse Salaries
            </button>
            <button
              onClick={() => {
                setSuccess(false);
                setCompany('');
                setRole('');
                setLevel('');
                setLocation('');
                setYoe('');
                setYoeCompany('');
                setBase('');
                setStock('');
                setBonus('');
              }}
              className="btn-secondary py-3 px-6 text-center"
            >
              Submit Another
            </button>
          </div>

        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 min-h-screen bg-white">
      
      {/* Title */}
      <div className="mb-8 text-center max-w-lg mx-auto">
        <h1 className="text-3xl font-black tracking-tight text-navy">
          Share Your Compensation
        </h1>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Submit your compensation anonymously. All submissions are processed confidentially to empower peers with transparent market metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: The Input Form */}
        <div className="lg:col-span-2">
          <Card padding="md" hoverable={false} className="border-slate-200 bg-white shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Form Validation Error */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Company Picker */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Company</label>
                <div className="relative">
                  <select
                    value={company}
                    onChange={(e) => {
                      setCompany(e.target.value);
                      setLevel('');
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-navy focus:outline-none focus:border-sky-blue focus:ring-1 focus:ring-sky-blue transition-all"
                  >
                    <option value="">Select a Company</option>
                    {AVAILABLE_COMPANIES.map(c => (
                      <option key={c.slug} value={c.name}>{c.name}</option>
                    ))}
                    <option value="other">Other / Custom</option>
                  </select>
                </div>
              </div>

              {/* Role Picker */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Job Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-navy focus:outline-none focus:border-sky-blue focus:ring-1 focus:ring-sky-blue transition-all"
                >
                  <option value="">Select a Role</option>
                  {AVAILABLE_ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Level Input */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Internal Level
                </label>
                <input
                  type="text"
                  placeholder="e.g. L4, E5, ICT3, Senior"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-navy focus:outline-none focus:border-sky-blue focus:ring-1 focus:ring-sky-blue transition-all"
                />
              </div>

              {/* Location Picker */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-navy focus:outline-none focus:border-sky-blue focus:ring-1 focus:ring-sky-blue transition-all"
                >
                  <option value="">Select a Location</option>
                  {AVAILABLE_LOCATIONS.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              {/* YOE & YOE Company Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Total YOE</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 5"
                    value={yoe}
                    onChange={(e) => setYoe(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-navy focus:outline-none focus:border-sky-blue focus:ring-1 focus:ring-sky-blue transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Years at Company</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 2"
                    value={yoeCompany}
                    onChange={(e) => setYoeCompany(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-navy focus:outline-none focus:border-sky-blue focus:ring-1 focus:ring-sky-blue transition-all"
                  />
                </div>
              </div>

              {/* COMPENSATION METRICS GRID */}
              <div className="border-t border-slate-100 pt-6 mt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Salary Breakdown (USD)</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Base */}
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Base Salary</label>
                    <input
                      type="number"
                      placeholder="e.g. 165000"
                      value={base}
                      onChange={(e) => setBase(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-navy focus:outline-none focus:border-sky-blue transition-all"
                    />
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Stock / RSU (Annual)</label>
                    <input
                      type="number"
                      placeholder="e.g. 60000"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-navy focus:outline-none focus:border-sky-blue transition-all"
                    />
                  </div>

                  {/* Bonus */}
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Bonus (Annual)</label>
                    <input
                      type="number"
                      placeholder="e.g. 15000"
                      value={bonus}
                      onChange={(e) => setBonus(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-navy focus:outline-none focus:border-sky-blue transition-all"
                    />
                  </div>

                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary py-3 w-full justify-center shadow-lg shadow-sky-blue/20 disabled:opacity-50 mt-4"
              >
                {submitting ? 'Submittingpay ledger...' : 'Register pay submission'}
              </button>

            </form>
          </Card>
        </div>

        {/* RIGHT COLUMN: Real-Time Calculated Total Compensation Preview Card */}
        <div className="lg:col-span-1">
          <Card padding="md" hoverable={false} className="sticky top-24 border-slate-200 bg-slate-50/50 flex flex-col items-center text-center">
            
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-blue/10 text-sky-blue mb-4 animate-pulse-soft">
              <PlusCircle size={22} />
            </div>

            <h3 className="text-sm font-bold text-navy uppercase tracking-wide">
              Total Pay Preview
            </h3>
            
            <p className="text-[10px] text-slate-400 font-semibold mb-6">
              Aggregated annual total compensation calculation
            </p>

            {/* Calculated Big Badge */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full shadow-inner mb-6 flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated TC</span>
              <span className="text-3xl font-black text-navy tracking-tight mt-2 tabular-nums">
                {formatCurrency(totalComp)}
              </span>
            </div>

            <div className="w-full text-left space-y-3 border-t border-slate-200/80 pt-4 text-[11px] font-semibold text-slate-500">
              <div className="flex justify-between">
                <span>Base Salary:</span>
                <span className="text-navy tabular-nums font-bold">{formatCurrency(Number(base || 0))}</span>
              </div>
              <div className="flex justify-between">
                <span>Stock / Equity:</span>
                <span className="text-navy tabular-nums font-bold">{formatCurrency(Number(stock || 0))}</span>
              </div>
              <div className="flex justify-between">
                <span>Annual Bonus:</span>
                <span className="text-navy tabular-nums font-bold">{formatCurrency(Number(bonus || 0))}</span>
              </div>
            </div>

          </Card>
        </div>

      </div>

    </div>
  );
}
