import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Search, MapPin, Users, DollarSign, ArrowRight, Layers } from 'lucide-react';
import { api } from '../lib/api';
import type { Company } from '../types/company';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency } from '../lib/formatters';

export default function CompaniesPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadCompanies() {
      setLoading(true);
      try {
        const data = await api.getCompanies();
        setCompanies(data);
      } catch (e) {
        console.error('Error fetching companies:', e);
      } finally {
        setLoading(false);
      }
    }
    loadCompanies();
  }, []);

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 min-h-screen bg-white">
      
      {/* Title */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-navy flex items-center gap-2">
            <Layers className="text-sky-blue" />
            Company Database
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse company profiles, industries, headquarters, and aggregated median total compensation packages.
          </p>
        </div>
        <Badge variant="primary" className="self-start font-bold">
          {companies.length} Registered Profiles
        </Badge>
      </div>

      {/* Quick Search */}
      <div className="max-w-md mb-8 flex items-center p-1.5 rounded-full border border-slate-200 bg-white shadow-sm hover:shadow hover:border-slate-300 transition-all duration-300">
        <Search className="text-slate-400 ml-4 h-4 w-4" />
        <input
          type="text"
          placeholder="Filter companies by name or industry..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border-0 px-3 py-1.5 text-navy font-semibold focus:outline-none placeholder-slate-400 text-xs"
        />
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="glass-card bg-white h-48 rounded-2xl p-6 shimmer" />
          ))
        ) : filteredCompanies.length === 0 ? (
          <div className="col-span-full">
            <EmptyState 
              title="No Profiles Match Your Filter"
              description="Adjust your search keyword to find matching company profiles in our database."
              onActionClick={() => setSearchQuery('')}
            />
          </div>
        ) : (
          filteredCompanies.map(c => (
            <Card
              key={c.slug}
              onClick={() => navigate(`/companies/${c.slug}`)}
              className="relative group border-slate-200 p-6 flex flex-col justify-between"
            >
              
              {/* Logo block */}
              <div>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-navy to-slate-800 text-white text-xl font-black shadow-md">
                    {c.name[0]}
                  </div>
                  <Badge variant="primary" size="sm">
                    {c.stats.count} records
                  </Badge>
                </div>

                <h3 className="text-lg font-black text-navy tracking-tight mt-4 group-hover:text-sky-blue transition-colors flex items-center gap-1.5">
                  {c.name}
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-sky-blue" />
                </h3>

                <div className="flex flex-col gap-1 mt-3 text-[11px] font-semibold text-slate-500">
                  <span className="flex items-center gap-1"><MapPin size={11} /> {c.hq}</span>
                  <span className="flex items-center gap-1"><Building2 size={11} /> {c.industry}</span>
                </div>
              </div>

              {/* Aggregated block */}
              <div className="border-t border-slate-100 mt-5 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Median TC</span>
                  <span className="text-xl font-extrabold text-navy tabular-nums">
                    {formatCurrency(c.stats.medianTc)}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-sky-blue group-hover:text-cyan transition-colors">
                  View Profile
                </div>
              </div>

            </Card>
          ))
        )}
      </div>

    </div>
  );
}
