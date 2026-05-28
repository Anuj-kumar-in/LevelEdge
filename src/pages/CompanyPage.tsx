import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Globe, Users, BrainCircuit, ChevronLeft, Send, Sparkles, RefreshCw
} from 'lucide-react';
import { api } from '../lib/api';
import type { Company, LevelBreakdown } from '../types/company';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import MarkdownResponse from '../components/ai/MarkdownResponse';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency, formatCompactCurrency } from '../lib/formatters';

// Recharts imports for dynamic data-density charting
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell 
} from 'recharts';

export default function CompanyPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const [company, setCompany] = useState<Company | null>(null);
  const [levels, setLevels] = useState<LevelBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Assistant States
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [suggestedQuestions] = useState([
    "Compare this company's base salary scaling vs the industry",
    "What is the average equity/RSU growth between senior levels?",
    "Give me 3 negotiation tips for a Senior engineer offer here"
  ]);

  useEffect(() => {
    async function loadCompanyData() {
      if (!slug) return;
      setLoading(true);
      try {
        const [companyData, levelsData] = await Promise.all([
          api.getCompanyDetails(slug),
          api.getCompanyLevels(slug)
        ]);
        setCompany(companyData);
        setLevels(levelsData);
      } catch (e) {
        console.error('Error fetching company details:', e);
      } finally {
        setLoading(false);
      }
    }
    loadCompanyData();
  }, [slug]);

  const handleAskAi = async (promptToSend: string) => {
    if (!promptToSend.trim() || aiLoading) return;
    setAiLoading(true);
    setAiResponse('');
    
    try {
      const result = await api.getAiInsights(
        `Company: ${company?.name || slug}\n\nQuestion: ${promptToSend}`
      );
      setAiResponse(result.response);
    } catch (e) {
      console.error('Error calling AI Coach:', e);
      setAiResponse("I apologize, but my AI negotiation engine encountered a brief connection glitch. Please try asking again shortly!");
    } finally {
      setAiLoading(false);
    }
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAskAi(aiPrompt);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col gap-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 md:col-span-2 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16">
        <EmptyState 
          title="Company Profile Not Found"
          description="The company details page you requested could not be resolved in our database."
        />
      </div>
    );
  }

  // Pre-process chart data (format values to standard k scale for cleaner axes labels)
  const chartData = levels.map(l => ({
    name: l.level,
    'Total Pay': Math.round(l.medianTc / 1000),
    'Base Salary': Math.round(l.medianBase / 1000),
    'Stock Equity': Math.round(l.medianStock / 1000),
    'Annual Bonus': Math.round(l.medianBonus / 1000)
  }));

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 min-h-screen bg-white">
      
      {/* Back button */}
      <Link to="/companies" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-navy transition-colors mb-6 uppercase tracking-wider">
        <ChevronLeft size={14} />
        Back to Database
      </Link>

      {/* COMPANY HEADER HERO */}
      <section className="glass-card bg-white border border-slate-200/80 p-8 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md shadow-navy/5">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-navy to-slate-800 text-white text-3xl font-black shadow-lg">
            {company.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-3xl font-black text-navy tracking-tight">{company.name}</h1>
              <Badge variant="primary">{company.industry}</Badge>
            </div>
            
            {/* Meta specs */}
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 mt-2">
              <span className="flex items-center gap-1"><MapPin size={13} /> {company.hq}</span>
              <span className="flex items-center gap-1"><Users size={13} /> {company.employeeCount} employees</span>
              <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sky-blue hover:underline">
                <Globe size={13} /> Website
              </a>
            </div>
          </div>
        </div>

        {/* Aggregated TC Block */}
        <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8 flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Median Total Comp</span>
          <span className="text-3xl font-black text-navy tabular-nums mt-1">{formatCurrency(company.stats.medianTc)}</span>
          <span className="text-xs text-slate-500 font-semibold mt-1">Calculated from {company.stats.count} submissions</span>
        </div>
      </section>

      {/* DETAILED STATS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Level breakdown table */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Level Breakdown Grid */}
          <Card padding="none" hoverable={false} className="overflow-hidden border-slate-200 bg-white shadow-sm">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-navy uppercase tracking-wide">Level Breakdown</h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Compensation progression by internal levels</p>
              </div>
              <Badge variant="primary" size="sm">{levels.length} Standardized Levels</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs font-semibold text-slate-700">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Level</th>
                    <th className="px-6 py-3 text-right">Total Pay (TC)</th>
                    <th className="px-6 py-3 text-right hidden md:table-cell">Base / Stock / Bonus</th>
                    <th className="px-6 py-3 text-center">Avg YOE</th>
                    <th className="px-6 py-3 text-center">Submissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {levels.map((l, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-3">
                        <Badge variant="secondary" size="sm">{l.level}</Badge>
                      </td>
                      <td className="px-6 py-3 text-right text-navy font-extrabold tabular-nums">
                        {formatCurrency(l.medianTc)}
                      </td>
                      <td className="px-6 py-3 text-right hidden md:table-cell text-[11px] text-slate-500 tabular-nums">
                        <span>{formatCompactCurrency(l.medianBase)}</span>
                        <span className="text-slate-300 mx-1">/</span>
                        <span>{formatCompactCurrency(l.medianStock)}</span>
                        <span className="text-slate-300 mx-1">/</span>
                        <span>{formatCompactCurrency(l.medianBonus)}</span>
                      </td>
                      <td className="px-6 py-3 text-center font-bold tabular-nums">
                        {l.avgYoe}y
                      </td>
                      <td className="px-6 py-3 text-center text-slate-400 font-medium tabular-nums">
                        {l.count} records
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </Card>

          {/* RECHARTS VISUALIZATION CHART */}
          {levels.length > 0 && (
            <Card padding="md" hoverable={false} className="border-slate-200 bg-white shadow-sm">
              <div className="mb-6">
                <h3 className="text-sm font-bold text-navy uppercase tracking-wide">Compensation Scaling Path</h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Total annual compensation (Base + Equity + Bonus) scaling by level in thousands (k)</p>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b" 
                      fontSize={11} 
                      fontWeight="bold" 
                      tickLine={false} 
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={10} 
                      fontWeight="bold" 
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        borderColor: '#e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0, 47, 86, 0.05)',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: '#002F56'
                      }}
                      formatter={(value) => [`$${value}k`, '']}
                    />
                    {/* Primary Bar representing Total Pay */}
                    <Bar dataKey="Total Pay" radius={[4, 4, 0, 0]}>
                      {chartData.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index % 2 === 0 ? '#29B6F6' : '#002F56'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

        </div>

        {/* RIGHT COLUMN: AI NEGOTIATOR PANEL */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card padding="md" hoverable={false} className="border-slate-200/80 bg-slate-50/50 shadow-md">
            
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-sky-blue shadow-inner animate-pulse-soft">
                <BrainCircuit size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy uppercase tracking-wide flex items-center gap-1.5">
                  AI Coach
                  <Badge variant="primary" size="sm" className="font-extrabold text-[9px] tracking-widest">Gemini</Badge>
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">Compensation negotiation assistant</p>
              </div>
            </div>

            {/* AI Text output area */}
            <div className="min-h-56 max-h-96 rounded-xl border border-slate-200/80 bg-white p-4 overflow-y-auto mb-4 text-xs font-semibold text-slate-700 leading-relaxed shadow-inner">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-sky-blue">
                  <RefreshCw size={24} className="animate-spin" />
                  <span className="text-[10px] uppercase font-bold tracking-widest animate-pulse">[GEMINI VM] ANALYZING PAY SCALES AND SYSTEM DESIGN PROMPTS...</span>
                </div>
              ) : aiResponse ? (
                <MarkdownResponse content={aiResponse} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-6">
                  <Sparkles size={24} className="text-slate-300" />
                  <p className="text-slate-400 text-[11px] leading-relaxed max-w-xs">
                    Ask me anything about scaling your salary at {company.name}! Select a suggested question below or write your custom query.
                  </p>
                </div>
              )}
            </div>

            {/* Suggested Prompt Chips */}
            <div className="flex flex-col gap-2 mb-4">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Suggested Queries:</span>
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskAi(q)}
                  disabled={aiLoading}
                  className="text-left text-[11px] font-semibold text-slate-600 hover:text-navy hover:bg-slate-100 hover:border-slate-300 border border-slate-200 bg-white px-3 py-2 rounded-lg transition-all focus:outline-none"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Prompt Input Form */}
            <form onSubmit={handlePromptSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about leveling, stocks, offers..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                disabled={aiLoading}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-navy focus:outline-none focus:border-sky-blue focus:ring-1 focus:ring-sky-blue disabled:opacity-50 transition-all"
              />
              <button
                type="submit"
                disabled={!aiPrompt.trim() || aiLoading}
                className="btn-primary py-2.5 px-3.5 rounded-xl shadow shadow-sky-blue/20 disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </form>

          </Card>
        </div>

      </div>

    </div>
  );
}
