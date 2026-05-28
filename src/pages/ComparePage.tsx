import React, { useEffect, useState } from 'react';
import { 
  Building2, ArrowRight, BarChart3, Plus, X, 
  MapPin, Globe, Sparkles, TrendingUp, Info
} from 'lucide-react';
import { api } from '../lib/api';
import type { Company, CompanyComparison } from '../types/company';
import { useComparison } from '../hooks/useComparison';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import { formatCurrency } from '../lib/formatters';

// Recharts imports for side-by-side comparison charts
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';

export default function ComparePage() {
  const { selectedSlugs, addCompany, removeCompany, setSelectedSlugs } = useComparison();
  
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [comparisonData, setComparisonData] = useState<CompanyComparison[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch full company lists on mount
  useEffect(() => {
    async function loadCompanies() {
      setLoadingList(true);
      try {
        const data = await api.getCompanies();
        setAllCompanies(data);
        
        // Auto-select standard defaults for the first run (e.g. Google and Meta)
        if (selectedSlugs.length === 0 && data.length >= 2) {
          const google = data.find(c => c.slug === 'google');
          const meta = data.find(c => c.slug === 'meta');
          if (google && meta) {
            setSelectedSlugs([google.slug, meta.slug]);
          }
        }
      } catch (e) {
        console.error('Error fetching companies list:', e);
      } finally {
        setLoadingList(false);
      }
    }
    loadCompanies();
  }, [setSelectedSlugs]);

  // Fetch side-by-side aggregated levels when selected list changes
  useEffect(() => {
    async function loadComparison() {
      if (selectedSlugs.length === 0) {
        setComparisonData([]);
        return;
      }
      setLoadingCompare(true);
      try {
        const data = await api.compareCompanies(selectedSlugs);
        setComparisonData(data);
      } catch (e) {
        console.error('Error loading comparison details:', e);
      } finally {
        setLoadingCompare(false);
      }
    }
    loadComparison();
  }, [selectedSlugs]);

  // Search filtered suggestions list
  const companySuggestions = allCompanies
    .filter(c => !selectedSlugs.includes(c.slug))
    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  const levelsToCompare = ['Entry', 'Mid', 'Senior', 'Staff', 'Principal'];

  // Process data for charts
  const chartData = levelsToCompare.map(lvl => {
    const dataPoint: any = { name: lvl };
    comparisonData.forEach(c => {
      const levelStat = c.levels.find(l => l.levelName === lvl);
      dataPoint[c.companyName] = levelStat ? Math.round(levelStat.medianTc / 1000) : 0;
    });
    return dataPoint;
  });

  // Calculate delta highlighter (which company pays the absolute highest at this level)
  const getHighestPayingCompany = (levelName: string) => {
    let highestTc = 0;
    let highestCompName = '';

    comparisonData.forEach(c => {
      const levelStat = c.levels.find(l => l.levelName === levelName);
      if (levelStat && levelStat.medianTc > highestTc) {
        highestTc = levelStat.medianTc;
        highestCompName = c.companyName;
      }
    });

    return { compName: highestCompName, tc: highestTc };
  };

  const getCompanyColor = (index: number) => {
    const colors = ['#002F56', '#29B6F6', '#10B981'];
    return colors[index % colors.length];
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 min-h-screen bg-white">
      
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-navy flex items-center gap-2">
          <BarChart3 className="text-sky-blue" />
          Comparison Hub
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Select up to 3 companies to run side-by-side total compensation comparisons broken down by equivalent career levels.
        </p>
      </div>

      {/* SELECTOR PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Company Slots */}
        {selectedSlugs.map((slug, idx) => {
          const comp = allCompanies.find(c => c.slug === slug);
          if (!comp) return null;
          return (
            <Card key={slug} hoverable={false} className="relative border-slate-200 bg-slate-50/50 p-5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-white font-black text-lg">
                  {comp.name[0]}
                </div>
                <div>
                  <h3 className="font-extrabold text-navy text-[14px]">{comp.name}</h3>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase mt-0.5">{comp.industry}</span>
                </div>
              </div>
              <button
                onClick={() => removeCompany(slug)}
                className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none"
              >
                <X size={16} />
              </button>
            </Card>
          );
        })}

        {/* Empty Search Add Slots */}
        {selectedSlugs.length < 3 && (
          <div className="relative border border-dashed border-slate-300 rounded-2xl p-5 flex flex-col justify-center bg-slate-50/20">
            <div className="flex items-center p-1.5 rounded-xl border border-slate-200 bg-white">
              <Plus className="text-slate-400 ml-2" size={16} />
              <input
                type="text"
                placeholder="Add company to compare..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 px-2 py-1 text-xs font-semibold text-navy focus:outline-none placeholder-slate-400"
              />
            </div>
            
            {/* Suggestions Overlay */}
            {searchQuery && companySuggestions.length > 0 && (
              <div className="absolute top-16 left-0 right-0 z-30 mt-1 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden flex flex-col">
                {companySuggestions.map(s => (
                  <button
                    key={s.slug}
                    onClick={() => {
                      addCompany(s.slug);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-navy hover:bg-slate-50 border-b border-slate-100 flex items-center gap-2"
                  >
                    <Building2 size={12} className="text-slate-400" />
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {selectedSlugs.length === 0 ? (
        <EmptyState 
          title="Select Companies to Compare"
          description="Type and add companies above to perform immediate cross-level pay scale analyses."
        />
      ) : (
        <div className="flex flex-col gap-10">
          
          {/* COMPARISON METRICS TABLE */}
          <Card padding="none" hoverable={false} className="border-slate-200 overflow-hidden shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs font-semibold text-slate-700">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Metric / Level</th>
                    {comparisonData.map((c, idx) => (
                      <th key={c.slug} className="px-6 py-4" style={{ color: getCompanyColor(idx) }}>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-extrabold">{c.companyName}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  
                  {/* HQ */}
                  <tr>
                    <td className="px-6 py-4 text-slate-400 uppercase tracking-wider text-[10px] font-bold">Headquarters</td>
                    {comparisonData.map(c => (
                      <td key={c.slug} className="px-6 py-4 text-slate-600 font-semibold">{c.hq}</td>
                    ))}
                  </tr>

                  {/* Overall Pay */}
                  <tr className="bg-slate-50/30">
                    <td className="px-6 py-4 text-slate-400 uppercase tracking-wider text-[10px] font-bold">Overall Median TC</td>
                    {comparisonData.map(c => (
                      <td key={c.slug} className="px-6 py-4 font-black text-navy text-[14px] tabular-nums">
                        {formatCurrency(c.overallStats.medianTc)}
                      </td>
                    ))}
                  </tr>

                  {/* Level Breaks */}
                  {levelsToCompare.map(lvl => {
                    const topPay = getHighestPayingCompany(lvl);
                    return (
                      <tr key={lvl} className="hover:bg-slate-50/20">
                        <td className="px-6 py-4 font-bold text-navy text-[13px]">{lvl} Level</td>
                        {comparisonData.map(c => {
                          const levelStat = c.levels.find(l => l.levelName === lvl);
                          if (!levelStat || levelStat.medianTc === 0) {
                            return <td key={c.slug} className="px-6 py-4 text-slate-300 italic font-medium">No Data Available</td>;
                          }
                          const isHighest = topPay.compName === c.companyName;
                          return (
                            <td key={c.slug} className={`px-6 py-4 tabular-nums text-[13px]`}>
                              <span className={isHighest ? 'text-emerald-600 font-black' : 'font-extrabold text-slate-700'}>
                                {formatCurrency(levelStat.medianTc)}
                              </span>
                              {isHighest && (
                                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ml-2">
                                  Top Pay
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}

                </tbody>
              </table>
            </div>
          </Card>

          {/* VISUAL RECHARTS BAR CHART */}
          {comparisonData.length > 0 && (
            <Card padding="md" hoverable={false} className="border-slate-200 bg-white shadow-sm">
              <div className="mb-6">
                <h3 className="text-sm font-bold text-navy uppercase tracking-wide">Pay Progression Comparison</h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Side-by-side total annual compensation progression in thousands (k) across generic equivalent career milestones.</p>
              </div>

              <div className="h-80 w-full">
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
                    <Legend 
                      wrapperStyle={{ 
                        fontFamily: 'Outfit, sans-serif', 
                        fontSize: '11px', 
                        fontWeight: 'bold',
                        paddingTop: '10px'
                      }}
                    />
                    {comparisonData.map((c, idx) => (
                      <Bar 
                        key={c.slug} 
                        dataKey={c.companyName} 
                        fill={getCompanyColor(idx)} 
                        radius={[4, 4, 0, 0]} 
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

        </div>
      )}

    </div>
  );
}
