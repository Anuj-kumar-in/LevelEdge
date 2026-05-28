import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Building2,
  MapPin,
  Users,
  ChevronRight,
  Sparkles,
  TrendingUp,
  BarChart3,
  BrainCircuit,
  Target,
  Flame,
  Globe
} from 'lucide-react';
import { api } from '../lib/api';
import type { Company } from '../types/company';
import type { Salary, SalaryStats } from '../types/salary';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import {
  formatCurrency,
  formatCompactCurrency,
  formatDate,
  formatRelativeTime
} from '../lib/formatters';
import { AVAILABLE_COMPANIES, AVAILABLE_LOCATIONS, AVAILABLE_ROLES } from '../lib/constants';
import { initialFilterState } from '../types/filters';

const levelPills = ['L3', 'L4', 'L5', 'L6', 'L7', 'E4', 'E5', 'Staff', 'Principal'];


interface DynamicImageBannerProps {
  currentTime: Date;
  stats: SalaryStats;
  loading: boolean;
}

const ROTATING_TAGS = [
  'Real compensation. No estimates.',
  'Anonymously submitted. Community verified.',
  'Updated daily by engineers like you.',
  'Know your worth before you negotiate.',
  'Data from top-tier tech companies.',
];

function DynamicImageBanner({ currentTime, stats, loading }: DynamicImageBannerProps) {
  const [tagIndex, setTagIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [visible, setVisible] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setTagIndex(i => (i + 1) % ROTATING_TAGS.length);
        setFadeIn(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden mb-6 mt-6"
      style={{ minHeight: '320px' }}
    >
      {/* Base image */}
      <img
        src="/homepage.png"
        alt="Homepage"
        className="w-full h-auto block"
        style={{
          transition: 'transform 0.6s ease',
          transform: visible ? 'scale(1)' : 'scale(1.04)',
        }}
      />

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(2,8,23,0.82) 0%, rgba(2,8,23,0.55) 55%, rgba(2,8,23,0.2) 100%)',
        }}
      />

      {/* Dynamic text content */}
      <div
        className="absolute inset-0 flex flex-col justify-between p-8 sm:p-10 lg:p-12"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
        }}
      >
        {/* Top row — live status + clock */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-full bg-emerald-400"
              style={{ animation: 'pulse 1.8s ease-in-out infinite' }}
            />
            <span className="text-base font-bold tracking-widest text-emerald-300 uppercase">
              We Are Live
            </span>
          </div>
          <div className="text-right">
            <div className="text-white font-mono text-2xl font-black tabular-nums drop-shadow">
              {timeStr}
            </div>
            <div className="text-slate-300 text-sm font-semibold mt-0.5">{dateStr}</div>
          </div>
        </div>

        {/* Center — large rotating tagline */}
        <div className="flex flex-col gap-3">
          <p
            className="text-white font-black tracking-tight drop-shadow-lg leading-tight"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              maxWidth: '720px',
            }}
          >
            {ROTATING_TAGS[tagIndex]}
          </p>
          {/* Progress dots */}
          <div className="flex gap-2 mt-1">
            {ROTATING_TAGS.map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === tagIndex ? '28px' : '8px',
                  backgroundColor: i === tagIndex ? 'white' : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom row — live stats pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2.5">
            <BarChart3 size={18} className="text-sky-300" />
            <span className="text-white text-base font-bold">
              {loading ? '—' : `${stats.count.toLocaleString()} Submission`}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2.5">
            <TrendingUp size={18} className="text-emerald-300" />
            <span className="text-white text-base font-bold">
              {loading ? '—' : `Median TC ${formatCurrency(stats.medianTc)}`}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2.5">
            <Users size={18} className="text-violet-300" />
            <span className="text-white text-base font-bold">
              {loading ? '—' : `Avg ${stats.avgYoe} yrs experience`}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}
const insightCards = [
  {
    title: 'Salary Explorer',
    description: 'Filter compensation by company, role, location, level, and total comp.',
    icon: Search,
    to: '/salaries'
  },
  {
    title: 'Company Profiles',
    description: 'Browse aggregated compensation, headcount, and market position.',
    icon: Building2,
    to: '/companies'
  },
  {
    title: 'Compare Companies',
    description: 'Benchmark side-by-side compensation across multiple companies.',
    icon: BarChart3,
    to: '/compare'
  },
  {
    title: 'AI Coach',
    description: 'Ask negotiation questions grounded in real-world data,',
    icon: BrainCircuit,
    to: '/ai-coach'
  }
];

export default function HomePage() {
  const navigate = useNavigate();
   const [searchQuery, setSearchQuery] = useState('');
   const [stats, setStats] = useState<SalaryStats>({ medianTc: 0, count: 0, avgYoe: 0 });
   const [companies, setCompanies] = useState<Company[]>([]);
   const [recentSalaries, setRecentSalaries] = useState<Salary[]>([]);
   const [loading, setLoading] = useState(true);
   const [currentTime, setCurrentTime] = useState(new Date());

   useEffect(() => {
     async function loadHomeData() {
       setLoading(true);
       try {
         const [statsData, companiesData, salaryData] = await Promise.all([
           api.getStats(),
           api.getCompanies(),
           api.getSalaries({ ...initialFilterState, page: 1, sortBy: 'date', sortOrder: 'desc' })
         ]);

         setStats(statsData);
         setCompanies(companiesData);
         setRecentSalaries(salaryData.salaries.slice(0, 6));
       } catch (error) {
         console.error('Error loading home page data:', error);
       } finally {
         setLoading(false);
       }
     }

     loadHomeData();
   }, []);

   useEffect(() => {
     const timer = setInterval(() => {
       setCurrentTime(new Date());
     }, 1000);
     return () => clearInterval(timer);
   }, []);

  const topCompanies = [...companies]
    .sort((left, right) => right.stats.medianTc - left.stats.medianTc)
    .slice(0, 6);

  const featuredCompanies = AVAILABLE_COMPANIES.slice(0, 6);
  const featuredRoles = AVAILABLE_ROLES;
  const featuredCities = AVAILABLE_LOCATIONS;

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/salaries?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const quickSearch = (value: string) => navigate(`/salaries?search=${encodeURIComponent(value)}`);

  return (
    <div className="page-canvas">
      <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8 lg:space-y-10">
         <section className="hero-surface overflow-hidden rounded-[32px] p-6 sm:p-8 lg:p-10">
    
           <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                <Badge variant="primary" className="tracking-[0.25em]">MARKET DATA</Badge>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1">
                  <Flame size={12} className="text-amber-500" />
                  Compensation intelligence
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950">
                  Browse compensation by company, level, and role.
                </h1>
                <p className="max-w-2xl text-sm sm:text-base leading-7 text-slate-600">
                  Explore compensation by company, role, level, and location with ranked profiles, level mapping, and recent submissions.
                </p>
              </div>

              <form onSubmit={handleSearchSubmit} className="search-shell flex items-center gap-3 rounded-full px-4 py-3">
                <Search className="text-slate-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by company, title, or city"
                  className="w-full border-0 bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                <button type="submit" className="btn-primary rounded-full px-5 py-2 text-xs">
                  Search
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {featuredRoles.map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => quickSearch(role)}
                    className="pill-chip"
                  >
                    {role}
                  </button>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Card hoverable={false} className="metric-card" padding="md">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Records</div>
                  <div className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                    {loading ? '...' : stats.count.toLocaleString()}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">Anonymous submissions</div>
                </Card>
                <Card hoverable={false} className="metric-card" padding="md">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Median TC</div>
                  <div className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                    {loading ? '...' : formatCurrency(stats.medianTc)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">Cross-company compensation baseline</div>
                </Card>
                <Card hoverable={false} className="metric-card" padding="md">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Average YOE</div>
                  <div className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                    {loading ? '...' : `${stats.avgYoe} yrs`}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">Experience level in the market</div>
                </Card>
                <Card hoverable={false} className="metric-card" padding="md">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Company Profiles</div>
                  <div className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                    {loading ? '...' : companies.length}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">Company pages and aggregations</div>
                </Card>
              </div>
            </div>

            <Card hoverable={false} className="hero-side-panel p-6 sm:p-8" padding="none">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Market Overview</div>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Quick access to core sections</h2>
                </div>
                <Sparkles className="text-sky-blue" size={18} />
              </div>

              <div className="mt-6 space-y-3">
                {featuredCompanies.map(company => (
                  <button
                    key={company.slug}
                    type="button"
                    onClick={() => navigate(`/companies/${company.slug}`)}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-slate-300"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-950">{company.name}</div>
                      <div className="text-xs text-slate-500">Company profile and medians</div>
                    </div>
                    <ArrowRight size={16} className="text-slate-400" />
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Common searches</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {levelPills.map(level => (
                    <button key={level} type="button" onClick={() => quickSearch(level)} className="pill-chip pill-chip--muted">
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
                  <DynamicImageBanner currentTime={currentTime} stats={stats} loading={loading} />
        </section>
        

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <Card hoverable={false} className="section-panel" padding="lg">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="section-kicker">Top Companies</div>
                <h2 className="section-title">Ranked by median total compensation</h2>
                <p className="section-copy">Click any company to open the profile page and inspect level distributions.</p>
              </div>
              <Link to="/companies" className="inline-flex items-center gap-1 text-sm font-bold text-sky-blue hover:text-cyan">
                View all <ChevronRight size={15} />
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {topCompanies.map((company, index) => (
                <Card
                  key={company.slug}
                  onClick={() => navigate(`/companies/${company.slug}`)}
                  className="company-card"
                  padding="md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">#{index + 1}</span>
                        <Badge variant="primary" size="sm">{company.stats.count} records</Badge>
                      </div>
                      <h3 className="mt-3 text-lg font-black tracking-tight text-slate-950 group-hover:text-sky-blue">{company.name}</h3>
                    </div>
                    <div className="rounded-2xl bg-slate-100 p-3 text-sky-blue">
                      <TrendingUp size={18} />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2"><Building2 size={14} className="text-slate-400" /> {company.industry}</div>
                    <div className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" /> {company.hq}</div>
                    <div className="flex items-center gap-2"><Users size={14} className="text-slate-400" /> {company.employeeCount}</div>
                  </div>

                  <div className="mt-5 border-t border-slate-200 pt-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Median TC</div>
                    <div className="mt-1 text-2xl font-black tracking-tight text-slate-950">{formatCurrency(company.stats.medianTc)}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      View {company.stats.count} salary submissions
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          <Card hoverable={false} className="section-panel" padding="lg">
            <div className="section-kicker">Level Bands</div>
            <h2 className="section-title">Navigate compensation by seniority</h2>
            <p className="section-copy">Review commonly used leveling bands across large companies and compare compensation ranges.</p>

            <div className="mt-6 space-y-3">
              {levelPills.map((level, index) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => quickSearch(level)}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-sky-blue/30 hover:bg-sky-50/40"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-950">{level}</div>
                    <div className="text-xs text-slate-500">
                      {index < 3 ? 'Entry to mid-level roles' : index < 6 ? 'Senior engineer tracks' : 'Staff and principal tracks'}
                    </div>
                  </div>
                  <div className="text-sky-blue">
                    <ChevronRight size={16} />
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card hoverable={false} className="section-panel lg:col-span-2" padding="lg">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="section-kicker">Recent Submissions</div>
                <h2 className="section-title">Fresh salary records</h2>
                <p className="section-copy">Latest entries help surface the current market shape and location mix.</p>
              </div>
              <Badge variant="secondary">{loading ? '...' : recentSalaries.length} visible</Badge>
            </div>

            <div className="mt-6 space-y-3">
              {recentSalaries.map(record => (
                <div key={record._id} className="recent-row">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-950">{record.company}</span>
                      <Badge variant="primary" size="sm">{record.level}</Badge>
                      {record.verified && <Badge variant="success" size="sm">Verified</Badge>}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      {record.role} · {record.location}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black tracking-tight text-slate-950">
                      {formatCurrency(record.tc)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatCompactCurrency(record.base)} base · {formatCompactCurrency(record.stock)} stock · {formatCompactCurrency(record.bonus)} bonus
                    </div>
                  </div>

                  <div className="text-right text-xs text-slate-500">
                    <div>{formatRelativeTime(record.date)}</div>
                    <div className="mt-1">{formatDate(record.date)}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card hoverable={false} className="section-panel" padding="lg">
            <div className="section-kicker">Research Tools</div>
            <h2 className="section-title">Additional research areas</h2>
            <p className="section-copy">Access the main product areas used for salary analysis and company benchmarking.</p>

            <div className="mt-5 space-y-3">
              {insightCards.map(({ title, description, icon: Icon, to }) => (
                <Link key={title} to={to} className="tool-card">
                  <div className="tool-card-icon">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-950">{title}</div>
                    <div className="text-xs text-slate-500">{description}</div>
                  </div>
                  <ArrowRight size={16} className="text-slate-400" />
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-3xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
                <Globe size={16} className="text-sky-blue" />
                Browse by location
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {featuredCities.map(city => (
                  <button key={city} type="button" onClick={() => quickSearch(city)} className="pill-chip pill-chip--muted">
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Card hoverable={false} className="section-panel" padding="lg">
            <div className="section-kicker">Companies</div>
            <h2 className="section-title">Start from a company profile</h2>
            <p className="section-copy">Open a profile to review compensation medians and level distributions.</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {featuredCompanies.map(company => (
                <button
                  key={company.slug}
                  type="button"
                  onClick={() => navigate(`/companies/${company.slug}`)}
                  className="pill-chip"
                >
                  {company.name}
                </button>
              ))}
            </div>
          </Card>

          <Card hoverable={false} className="section-panel" padding="lg">
            <div className="section-kicker">Roles</div>
            <h2 className="section-title">Common job families</h2>
            <p className="section-copy">Use role filters to focus on the function you want to research.</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {featuredRoles.map(role => (
                <button key={role} type="button" onClick={() => quickSearch(role)} className="pill-chip">
                  {role}
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Target size={16} className="text-sky-blue" />
                Compare compensation across companies and levels
              </span>
              <Link to="/compare" className="font-bold text-sky-blue hover:text-cyan">
                Open compare
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}