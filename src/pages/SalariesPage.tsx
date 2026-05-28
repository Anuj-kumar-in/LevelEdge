import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, ChevronLeft, ChevronRight, 
  ArrowUpDown, BadgeCheck, MapPin, SlidersHorizontal
} from 'lucide-react';
import { List } from 'react-window';
import { api } from '../lib/api';
import type { Salary } from '../types/salary';
import { useFilters } from '../hooks/useFilters';
import { useDebounce } from '../hooks/useDebounce';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import { formatCurrency, formatCompactCurrency, formatDate } from '../lib/formatters';
import { AVAILABLE_COMPANIES, AVAILABLE_ROLES, AVAILABLE_LOCATIONS } from '../lib/constants';

export default function SalariesPage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const { filters, setFilter, resetFilters, nextPage, prevPage, setFilters } = useFilters();
  
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(initialSearch);

  // Sync initial URL search query to filter state
  useEffect(() => {
    if (initialSearch) {
      setFilter('search', initialSearch);
      setSearchInput(initialSearch);
    }
  }, [initialSearch, setFilter]);

  // Debounce search input for performance (prevent API calls on every keystroke)
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    setFilter('search', debouncedSearch);
  }, [debouncedSearch, setFilter]);

  // Load salary list
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const response = await api.getSalaries(filters);
        setSalaries(response.salaries);
        setTotal(response.total);
        setTotalPages(response.totalPages);
      } catch (e) {
        console.error('Error loading salaries:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [filters]);

  const handleReset = () => {
    resetFilters();
    setSearchInput('');
  };

  const handleSort = (field: string) => {
    const isSameField = filters.sortBy === field;
    const newOrder = isSameField && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: newOrder,
      page: 1
    }));
  };

  const renderSortArrow = (field: string) => {
    if (filters.sortBy !== field) return <ArrowUpDown size={12} className="opacity-40" />;
    return filters.sortOrder === 'asc' ? '▲' : '▼';
  };

  // Virtualized Row Renderer
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const s = salaries[index];
    if (!s) return null;

    return (
      <div 
        style={style}
        className="flex items-center border-b border-slate-100 px-6 hover:bg-slate-50/50 transition-colors duration-150 text-xs font-semibold text-slate-700"
      >
        {/* Company Name */}
        <div className="w-1/4 flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-navy text-[13px]">{s.company}</span>
            {s.verified && (
              <span title="W2 Verified Submission">
                <BadgeCheck size={14} className="text-sky-blue fill-sky-blue/10" />
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-0.5 mt-0.5">
            <MapPin size={10} />
            {s.location}
          </span>
        </div>

        {/* Role & Level */}
        <div className="w-1/4">
          <span className="font-bold text-slate-800 text-[13px] block">{s.role}</span>
          <span className="inline-block mt-1">
            <Badge variant="primary" size="sm">{s.level}</Badge>
          </span>
        </div>

        {/* Total Compensation */}
        <div className="w-1/6 text-right pr-4">
          <span className="text-sm font-black text-navy tracking-tight">{formatCurrency(s.tc)}</span>
          <div className="md:hidden text-[9px] text-slate-400 mt-1">
            {formatCompactCurrency(s.base)} / {formatCompactCurrency(s.stock)} / {formatCompactCurrency(s.bonus)}
          </div>
        </div>

        {/* Breakdown */}
        <div className="hidden md:flex w-1/4 justify-end gap-2 text-[10px] text-slate-500 font-bold tabular-nums">
          <div className="flex flex-col items-end">
            <span className="text-[8px] text-slate-300 uppercase tracking-tighter">Base</span>
            <span>{formatCompactCurrency(s.base)}</span>
          </div>
          <div className="h-6 w-px bg-slate-100 mx-1" />
          <div className="flex flex-col items-end">
            <span className="text-[8px] text-slate-300 uppercase tracking-tighter">Stock</span>
            <span>{formatCompactCurrency(s.stock)}</span>
          </div>
          <div className="h-6 w-px bg-slate-100 mx-1" />
          <div className="flex flex-col items-end">
            <span className="text-[8px] text-slate-300 uppercase tracking-tighter">Bonus</span>
            <span>{formatCompactCurrency(s.bonus)}</span>
          </div>
        </div>

        {/* YOE */}
        <div className="w-1/12 text-center">
          <span className="font-bold text-slate-700">{s.yoe}y</span>
        </div>

        {/* Date */}
        <div className="w-1/12 text-center text-[11px] text-slate-400 font-bold">
          {formatDate(s.date)}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 min-h-screen bg-white">
      
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-navy">
          Salaries Explorer
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore and search crowdsourced total compensation records across engineering roles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR FILTER PANEL */}
        <aside className="lg:col-span-1 flex flex-col gap-6">
          <Card padding="md" hoverable={false} className="border-slate-200 bg-slate-50/50">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <span className="text-sm font-bold text-navy flex items-center gap-2 uppercase tracking-wide">
                <SlidersHorizontal size={14} />
                Filters
              </span>
              <button
                onClick={handleReset}
                className="text-[11px] font-bold text-sky-blue hover:text-cyan transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="mb-6">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Company</label>
              <select
                value={filters.company}
                onChange={(e) => setFilter('company', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-navy focus:outline-none focus:border-sky-blue transition-colors"
              >
                <option value="">All Companies</option>
                {AVAILABLE_COMPANIES.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Job Family</label>
              <select
                value={filters.role}
                onChange={(e) => setFilter('role', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-navy focus:outline-none focus:border-sky-blue transition-colors"
              >
                <option value="">All Roles</option>
                {AVAILABLE_ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Geography</label>
              <select
                value={filters.location}
                onChange={(e) => setFilter('location', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-navy focus:outline-none focus:border-sky-blue transition-colors"
              >
                <option value="">All Locations</option>
                {AVAILABLE_LOCATIONS.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Experience (YOE)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minYoe}
                  onChange={(e) => setFilter('minYoe', e.target.value)}
                  className="w-1/2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy text-center focus:outline-none focus:border-sky-blue"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxYoe}
                  onChange={(e) => setFilter('maxYoe', e.target.value)}
                  className="w-1/2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy text-center focus:outline-none focus:border-sky-blue"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Total Comp (TC)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min $"
                  value={filters.minTc}
                  onChange={(e) => setFilter('minTc', e.target.value)}
                  className="w-1/2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy text-center focus:outline-none focus:border-sky-blue"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max $"
                  value={filters.maxTc}
                  onChange={(e) => setFilter('maxTc', e.target.value)}
                  className="w-1/2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy text-center focus:outline-none focus:border-sky-blue"
                />
              </div>
            </div>
          </Card>
        </aside>

        <section className="lg:col-span-3 flex flex-col gap-6">
          <div className="flex items-center p-1.5 rounded-full border border-slate-200 bg-white shadow-sm hover:shadow hover:border-slate-300 transition-all duration-300">
            <Search className="text-slate-400 ml-4 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by company or role keyword..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-transparent border-0 px-3 py-2 text-navy font-semibold focus:outline-none placeholder-slate-400 text-xs"
            />
          </div>

          <Card padding="none" hoverable={false} className="overflow-hidden border-slate-200 bg-white shadow-sm min-h-[600px] flex flex-col">
            <div className="flex items-center bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-6 py-4 border-b border-slate-200">
              <div className="w-1/4 cursor-pointer hover:text-navy transition-colors select-none" onClick={() => handleSort('company')}>
                <div className="flex items-center gap-1">Company {renderSortArrow('company')}</div>
              </div>
              <div className="w-1/4 cursor-pointer hover:text-navy transition-colors select-none" onClick={() => handleSort('role')}>
                <div className="flex items-center gap-1">Role & Level {renderSortArrow('role')}</div>
              </div>
              <div className="w-1/6 text-right pr-4 cursor-pointer hover:text-navy transition-colors select-none" onClick={() => handleSort('tc')}>
                <div className="flex items-center gap-1 justify-end">TC {renderSortArrow('tc')}</div>
              </div>
              <div className="hidden md:block w-1/4 text-right select-none pr-2">Base / Stock / Bonus</div>
              <div className="w-1/12 text-center cursor-pointer hover:text-navy transition-colors select-none" onClick={() => handleSort('yoe')}>
                <div className="flex items-center gap-1 justify-center">YOE {renderSortArrow('yoe')}</div>
              </div>
              <div className="w-1/12 text-center cursor-pointer hover:text-navy transition-colors select-none" onClick={() => handleSort('date')}>
                <div className="flex items-center gap-1 justify-center">Offer Date {renderSortArrow('date')}</div>
              </div>
            </div>

            <div className="flex-1 min-h-[550px]">
              {loading ? (
                <div className="p-6 space-y-4">
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <div key={idx} className="flex gap-4">
                      <Skeleton className="h-6 w-1/4" />
                      <Skeleton className="h-6 w-1/4" />
                      <Skeleton className="h-6 w-1/6" />
                      <Skeleton className="h-6 w-1/4" />
                      <Skeleton className="h-6 w-1/12" />
                    </div>
                  ))}
                </div>
              ) : salaries.length === 0 ? (
                <div className="p-8">
                  <EmptyState onActionClick={handleReset} />
                </div>
              ) : (
                  <List<{}>
                    style={{ height: 550, width: '100%' }}
                    rowCount={salaries.length}
                    rowHeight={72}
                    rowComponent={Row}
                    rowProps={{}}
                  />
              )}
            </div>
          </Card>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Showing <span className="text-navy">{salaries.length}</span> of <span className="text-navy">{total}</span> records
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevPage}
                  disabled={filters.page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-navy hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={14} />
                  Prev
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setFilters(f => ({ ...f, page: pageNum }))}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          filters.page === pageNum 
                            ? 'bg-navy text-white shadow-md shadow-navy/20' 
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={nextPage}
                  disabled={filters.page === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-navy hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
