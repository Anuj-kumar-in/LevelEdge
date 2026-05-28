import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, DollarSign, Layers, BrainCircuit, BarChart3, PlusCircle, ChevronDown } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const navItems = [
    { label: 'Salaries', path: '/salaries', icon: <DollarSign size={15} /> },
    { label: 'Companies', path: '/companies', icon: <Layers size={15} /> },
    { label: 'Compare', path: '/compare', icon: <BarChart3 size={15} /> },
    { label: 'AI Coach', path: '/ai-coach', icon: <BrainCircuit size={15} /> }
  ];

  const quickLinks = [
    { label: 'Engineering', query: 'Software Engineer' },
    { label: 'Product', query: 'Product Manager' },
    { label: 'Data', query: 'Data Scientist' },
    { label: 'AI', query: 'ML Engineer' },
    { label: 'City', query: 'San Francisco, CA' }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchValue.trim()) {
      navigate(`/salaries?search=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-sm">
       <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
         <div className="flex flex-col gap-3 py-4 lg:py-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-blue to-cyan shadow-md shadow-sky-blue/20 transition-transform duration-300 group-hover:scale-105">
                <span className="text-lg font-black text-white">II|</span>
              </div>
              <span className="text-lg font-black tracking-tight text-slate-950">
                LEVEL<span className="text-sky-blue">EDGE</span>
              </span>
            </Link>

            <form onSubmit={handleSearch} className="hidden flex-1 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 md:flex">
              <Search size={16} className="text-slate-400" />
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search by company, title, or city"
                className="w-full border-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button type="submit" className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700">
                Explore
              </button>
            </form>

            <div className="ml-auto flex items-center gap-2">
              <div className="hidden items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 lg:inline-flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Ready to Explore
              </div>
              <Link to="/submit" className="btn-primary hidden items-center gap-2 shadow-sm shadow-sky-blue/10 hover:shadow-sky-blue/20 sm:inline-flex">
                <PlusCircle size={15} />
                <span>Share Pay</span>
              </Link>
            </div>
          </div>

           <div className="flex flex-wrap items-center justify-center gap-3 overflow-x-auto pb-1">
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 lg:inline-flex">Browse</span>
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-all ${
                  isActive(item.path)
                    ? 'border-sky-blue/20 bg-sky-blue/10 text-slate-950'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            <div className="hidden h-6 w-px bg-slate-200 lg:block" />

            {quickLinks.map(item => (
              <Link
                key={item.label}
                to={`/salaries?search=${encodeURIComponent(item.query)}`}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 transition hover:border-sky-blue/20 hover:bg-sky-blue/5 hover:text-slate-900"
              >
                {item.label}
                <ChevronDown size={12} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
