import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, TrendingUp, Users, DollarSign, BrainCircuit, ArrowRight, Layers, Sparkles,
  ShieldCheck, Lock, CheckCircle2, Cpu, Database, Network, Terminal, Activity, 
  ArrowUpRight, Zap, RefreshCw, Play, Trash2, Code, HelpCircle, User, Bell, 
  ChevronRight, HardDrive, BarChart2, Shield, Settings, AlertTriangle, Filter, 
  DatabaseZap, CheckCircle, FileCheck, Landmark, Briefcase, GraduationCap
} from 'lucide-react';
import { api } from '../lib/api';
import type { SalaryStats } from '../types/salary';
import type { Company } from '../types/company';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { formatCurrency, formatLargeCurrency } from '../lib/formatters';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<SalaryStats>({ medianTc: 0, count: 0, avgYoe: 0 });
  const [topCompanies, setTopCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Main Toggle State: 'DATA' or 'LEVELS'
  const [toggleMode, setToggleMode] = useState<'DATA' | 'LEVELS'>('DATA');
  
  // Tab State for "MARKET COMPENSATION INTELLIGENCE"
  const [activeTab, setActiveTab] = useState('Software Engineer');

  // Simulation State for the interactive part
  const [pingTime, setPingTime] = useState(36);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, companiesData] = await Promise.all([
          api.getStats(),
          api.getCompanies()
        ]);
        setStats(statsData);
        // Take top 3 highest paying companies
        const sorted = [...companiesData].sort((a, b) => b.stats.medianTc - a.stats.medianTc);
        setTopCompanies(sorted.slice(0, 3));
      } catch (e) {
        console.error('Error fetching home page data:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    const interval = setInterval(() => {
      setPingTime(Math.floor(Math.random() * (42 - 34 + 1)) + 34);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/salaries?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      backgroundColor: '#ffffff', 
      color: '#0f172a', 
      fontFamily: '"Inter", sans-serif',
      overflowX: 'hidden'
    }}>
      <div style={{ flex: 1 }}>
        
        {/* HERO SECTION: Snowflake-style Clean Grid Canvas with Wavy Radial Contour Background */}
        <section style={{ 
          position: 'relative',
          padding: '120px 24px 100px 24px', 
          background: 'radial-gradient(100% 100% at 50% 0%, #f0f7fc 0%, #ffffff 70%)',
          borderBottom: '1px solid #e2e8f0',
          textAlign: 'center',
          overflow: 'hidden'
        }}>
          {/* Wave/Contour Radiating Background lines (Pure CSS & SVG simulation) */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '1800px',
            height: '800px',
            opacity: 0.6,
            backgroundImage: `radial-gradient(circle at 50% 0%, transparent 100px, rgba(41, 182, 246, 0.03) 101px, rgba(41, 182, 246, 0.03) 103px, transparent 104px,
              transparent 200px, rgba(41, 182, 246, 0.03) 201px, rgba(41, 182, 246, 0.03) 203px, transparent 204px,
              transparent 300px, rgba(41, 182, 246, 0.03) 301px, rgba(41, 182, 246, 0.03) 303px, transparent 304px,
              transparent 400px, rgba(41, 182, 246, 0.03) 401px, rgba(41, 182, 246, 0.03) 403px, transparent 404px,
              transparent 500px, rgba(41, 182, 246, 0.03) 501px, rgba(41, 182, 246, 0.03) 503px, transparent 504px,
              transparent 600px, rgba(41, 182, 246, 0.03) 601px, rgba(41, 182, 246, 0.03) 603px, transparent 604px,
              transparent 700px, rgba(41, 182, 246, 0.03) 701px, rgba(41, 182, 246, 0.03) 703px, transparent 704px)`,
            pointerEvents: 'none',
            zIndex: 1
          }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto', zIndex: 10, position: 'relative' }}>
            
            {/* Huge Premium Title with DATA - LEVELS Toggle */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '24px', 
              marginBottom: '28px',
              flexWrap: 'wrap'
            }}>
              <span style={{ 
                fontSize: '84px', 
                fontWeight: '900', 
                color: '#29B6F6', 
                letterSpacing: '-3px',
                textShadow: '0 4px 20px rgba(41,182,246,0.15)'
              }}>
                DATA
              </span>

              {/* Dynamic Theme Toggle Pill Slider */}
              <button 
                onClick={() => setToggleMode(toggleMode === 'DATA' ? 'LEVELS' : 'DATA')}
                style={{
                  width: '110px',
                  height: '56px',
                  borderRadius: '9999px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 10px 25px rgba(0, 47, 86, 0.08)',
                  cursor: 'pointer',
                  padding: '5px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                title={`Switch to ${toggleMode === 'DATA' ? 'LEVELS' : 'DATA'} view mode`}
              >
                {/* Slidable glowing inner pill */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #29B6F6 0%, #00A3E0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 10px rgba(41, 182, 246, 0.4)',
                  position: 'absolute',
                  left: toggleMode === 'DATA' ? '5px' : '59px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  {toggleMode === 'DATA' ? <Database size={20} /> : <Layers size={20} />}
                </div>
                {/* Background micro icons */}
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', padding: '0 10px', opacity: 0.3, pointerEvents: 'none' }}>
                  <Database size={16} />
                  <Layers size={16} />
                </div>
              </button>

              <span style={{ 
                fontSize: '84px', 
                fontWeight: '900', 
                color: '#5A6E85', 
                letterSpacing: '-3px'
              }}>
                LEVELS
              </span>
            </div>

            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: '600', 
              color: '#002F56', 
              marginBottom: '20px'
            }}>
              Compare salaries. Understand engineering levels.
            </h2>

            <p style={{ 
              fontSize: '17px', 
              color: '#475569', 
              maxWidth: '680px', 
              margin: '0 auto 40px auto', 
              lineHeight: '1.6' 
            }}>
              Unlock structured, filterable, and anonymous compensation data.<br />
              Make informed decisions and navigate your engineering career with confidence.
            </p>

            {/* Premium Pill CTA buttons */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '64px' }}>
              <button 
                onClick={() => setToggleMode('DATA')}
                className="btn-primary" 
                style={{ 
                  padding: '16px 36px', 
                  fontSize: '15px', 
                  backgroundColor: '#29B6F6', 
                  borderColor: '#29B6F6',
                  boxShadow: toggleMode === 'DATA' ? '0 10px 25px rgba(41, 182, 246, 0.4)' : 'none'
                }}
              >
                Explore Salary Data
              </button>
              
              <button 
                onClick={() => setToggleMode('LEVELS')}
                className="btn-secondary" 
                style={{ 
                  padding: '16px 36px', 
                  fontSize: '15px',
                  backgroundColor: '#ffffff',
                  borderColor: '#cbd5e1',
                  color: '#002F56',
                  boxShadow: toggleMode === 'LEVELS' ? '0 10px 25px rgba(0, 47, 86, 0.08)' : 'none'
                }}
              >
                Research Levels
              </button>
            </div>

            {/* HUGE HIGH-FIDELITY INTERACTIVE INTEGRATED WORKSPACE CONSOLE */}
            <div style={{
              width: '100%',
              maxWidth: '1150px',
              margin: '0 auto',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 25px 60px rgba(0, 47, 86, 0.08)',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: '260px 1fr',
              zIndex: 10,
              position: 'relative',
              textAlign: 'left'
            }}>
              
              {/* SIDEBAR COMPONENT */}
              <div style={{
                backgroundColor: '#0c1a2e',
                borderRight: '1px solid #1e293b',
                color: '#94a3b8',
                display: 'flex',
                flexDirection: 'column',
                height: '620px',
                fontFamily: '"Inter", sans-serif'
              }}>
                {/* Sidebar Header */}
                <div style={{
                  padding: '24px 20px',
                  borderBottom: '1px solid #1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #29B6F6 0%, #00A3E0 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <DollarSign size={16} color="#ffffff" strokeWidth={2.5} />
                  </div>
                  <span style={{ color: '#ffffff', fontWeight: '800', fontSize: '18px', letterSpacing: '-0.5px' }}>
                    COMPENSATION APP
                  </span>
                </div>

                {/* Sidebar Sections */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 8px' }}>
                  
                  {/* SECTION 1: Career Streams */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ 
                      fontSize: '11px', 
                      fontWeight: '800', 
                      color: '#475569', 
                      textTransform: 'uppercase', 
                      padding: '0 12px 8px 12px',
                      letterSpacing: '1px'
                    }}>
                      Career Streams
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {[
                        { name: 'Engineering', icon: <Cpu size={15} /> },
                        { name: 'Product', icon: <Layers size={15} /> },
                        { name: 'Design', icon: <Briefcase size={15} /> },
                        { name: 'Data Science', icon: <TrendingUp size={15} />, highlight: true },
                        { name: 'Marketing', icon: <Activity size={15} /> },
                        { name: 'Sales', icon: <Users size={15} /> },
                        { name: 'HR & Ops', icon: <Settings size={15} /> }
                      ].map((item, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          color: item.highlight ? '#ffffff' : '#94a3b8',
                          backgroundColor: item.highlight ? 'rgba(41, 182, 246, 0.15)' : 'transparent',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if(!item.highlight) {
                            e.currentTarget.style.backgroundColor = '#1e293b';
                            e.currentTarget.style.color = '#ffffff';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if(!item.highlight) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#94a3b8';
                          }
                        }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {item.icon}
                            <span>{item.name}</span>
                          </div>
                          {item.highlight && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#29B6F6' }} />}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 2: Vault */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ 
                      fontSize: '11px', 
                      fontWeight: '800', 
                      color: '#475569', 
                      textTransform: 'uppercase', 
                      padding: '0 12px 8px 12px',
                      letterSpacing: '1px'
                    }}>
                      Compensation Vault
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {[
                        { name: 'Salary Explorer', icon: <Search size={15} /> },
                        { name: 'Company Profiles', icon: <Landmark size={15} /> },
                        { name: 'Benefit Packages', icon: <Shield size={15} /> }
                      ].map((item, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          gap: '10px',
                          color: '#94a3b8',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#1e293b';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#94a3b8';
                        }}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Sidebar Footer */}
                <div style={{
                  padding: '16px',
                  borderTop: '1px solid #1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#0a1526'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: '800', color: '#29B6F6', border: '1px solid rgba(41,182,246,0.3)'
                    }}>
                      CP
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>COMPENSATION APP</div>
                      <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600' }}>SALARY DATA PLATFORM</div>
                    </div>
                  </div>
                  <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                    <Bell size={16} />
                  </button>
                </div>

              </div>

              {/* MAIN CONTENT WORKSPACE */}
              <div style={{ display: 'flex', flexDirection: 'column', height: '620px', overflow: 'hidden' }}>
                
                {toggleMode === 'DATA' ? (
                  // =================== DATA WORKVIEW ===================
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0b1329' }}>
                    
                    {/* Header bar */}
                    <div style={{
                      height: '56px',
                      backgroundColor: '#0f172a',
                      borderBottom: '1px solid #1e293b',
                      padding: '0 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: '#ffffff'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Terminal size={16} color="#29B6F6" />
                        <span style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'monospace', color: '#e2e8f0' }}>
                          Compensation Salary Ledger v4.2.0
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', fontFamily: 'monospace', color: '#64748b' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                          LIVE_MARKET_SYNC
                        </span>
                        <span>Region: GLOBAL</span>
                        <span className="animate-pulse">STABLE</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ 
                      flex: 1, 
                      padding: '24px', 
                      fontFamily: '"JetBrains Mono", monospace', 
                      fontSize: '13px', 
                      color: '#e2e8f0', 
                      overflowY: 'auto',
                      lineHeight: '1.6'
                    }}>
                      <div style={{ color: '#64748b', marginBottom: '16px' }}>
                        * Ingesting anonymous compensation records...<br />
                        * Normalizing base, equity, and bonus coefficients...<br />
                        * Verified records: {loading ? '...' : stats.count.toLocaleString()}<br />
                        * Data refresh status: COMPLETED_SYNC 
                      </div>

                      {/* Search in terminal style */}
                      <form onSubmit={handleSearchSubmit} style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#29B6F6', marginBottom: '8px' }}>
                          <span>&gt; query market data for target company or role</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#29B6F6', fontWeight: 'bold' }}>$</span>
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search (e.g. Google, Meta, Senior Software Engineer)..."
                            style={{
                              width: '100%',
                              backgroundColor: '#0f172a',
                              border: '1px solid #1e293b',
                              borderRadius: '8px',
                              padding: '12px 12px 12px 28px',
                              color: '#ffffff',
                              fontFamily: '"JetBrains Mono", monospace',
                              fontSize: '13px',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                      </form>

                      {/* Top Companies Quick View */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                        gap: '16px',
                        marginBottom: '24px'
                      }}>
                        {loading ? (
                          [1, 2, 3].map(i => (
                            <div key={i} style={{ height: '100px', backgroundColor: '#090f1d', borderRadius: '8px', border: '1px solid #1e293b' }} className="shimmer" />
                          ))
                        ) : (
                          topCompanies.map((c, idx) => (
                            <div key={c.slug} style={{
                              backgroundColor: '#090f1d',
                              border: '1px solid #1e293b',
                              borderRadius: '8px',
                              padding: '16px',
                              cursor: 'pointer'
                            }} onClick={() => navigate(`/companies/${c.slug}`)}>
                              <div style={{ color: '#29B6F6', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>#{idx+1} {c.industry}</div>
                              <div style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '14px' }}>{c.name}</div>
                              <div style={{ color: '#10b981', fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>{formatCurrency(c.stats.medianTc)}</div>
                            </div>
                          ))
                        )}
                      </div>

                      <div style={{ color: '#475569', fontSize: '12px', fontStyle: 'italic', border: '1px dashed #1e293b', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                        Type a company or job title above and press enter to explore high-fidelity compensation distributions.
                      </div>

                    </div>

                  </div>
                ) : (
                  // =================== LEVELS WORKVIEW ===================
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f8fafc', overflowY: 'auto' }}>
                    
                    {/* Workspace Header */}
                    <div style={{
                      padding: '20px 24px',
                      borderBottom: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#002F56' }}>Leveling Analytics Dashboard</h3>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Precision benchmarking across industry standard levels</span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#ecfdf5', padding: '6px 12px', borderRadius: '9999px', border: '1px solid #d1fae5' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                          MARKET_STABLE
                        </div>
                      </div>
                    </div>

                    {/* Operational Widget Dashboard Grid */}
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      
                      {/* Metric cards */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 4px rgba(0,47,86,0.02)' }}>
                          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 'bold' }}>Median Total Comp</div>
                          <div style={{ fontSize: '24px', fontWeight: '900', color: '#002F56', marginTop: '6px' }}>{loading ? '...' : formatCurrency(stats.medianTc)}</div>
                          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px', fontWeight: 'bold' }}>Global Hardware/Software Average</div>
                        </div>

                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 4px rgba(0,47,86,0.02)' }}>
                          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 'bold' }}>Average Experience</div>
                          <div style={{ fontSize: '24px', fontWeight: '900', color: '#002F56', marginTop: '6px' }}>{loading ? '...' : stats.avgYoe} Years</div>
                          <div style={{ fontSize: '11px', color: '#00A3E0', marginTop: '4px', fontWeight: 'bold' }}>Standard Mid-Level Entry</div>
                        </div>

                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 4px rgba(0,47,86,0.02)' }}>
                          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 'bold' }}>Data Confidence</div>
                          <div style={{ fontSize: '24px', fontWeight: '900', color: '#002F56', marginTop: '6px' }}>99.8%</div>
                          <div style={{ fontSize: '11px', color: '#8b5cf6', marginTop: '4px', fontWeight: 'bold' }}>Verified by anonymized payrolls</div>
                        </div>
                      </div>

                      {/* Level Distribution Chart */}
                      <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: '0 2px 4px rgba(0,47,86,0.02)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '800', color: '#002F56' }}>salary_distribution_by_level (L3 - L8)</span>
                          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Industry Benchmarks</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'flex-end', height: '140px', gap: '8px', paddingBottom: '10px', borderBottom: '1px solid #cbd5e1' }}>
                          {[
                            { label: 'L3', height: 40 },
                            { label: 'L4', height: 60 },
                            { label: 'L5', height: 85 },
                            { label: 'L6', height: 110, highlight: true },
                            { label: 'L7', height: 130, highlight: true },
                            { label: 'L8', height: 140 },
                            { label: 'Dist.', height: 75 }
                          ].map((item, idx) => (
                            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                              <div style={{
                                width: '100%',
                                height: `${item.height}px`,
                                borderRadius: '4px 4px 0 0',
                                backgroundColor: item.highlight ? '#29B6F6' : '#cbd5e1',
                                transition: 'all 0.5s'
                              }} />
                              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Submissions Ledger */}
                      <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '16px'
                      }}>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#002F56', marginBottom: '12px' }}>Live Market Submissions Ledger</div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {[
                            { company: 'Google', level: 'L5', tc: '$385,000', label: 'Verified', status: 'Stable' },
                            { company: 'Meta', level: 'E6', tc: '$542,000', label: 'Verified', status: 'High' },
                            { company: 'Stripe', level: 'L4', tc: '$295,000', label: 'Verified', status: 'Stable' }
                          ].map((row, idx) => (
                            <div key={idx} style={{
                              display: 'grid',
                              gridTemplateColumns: '1.2fr 1fr 1fr 1.2fr 1fr',
                              padding: '10px 16px',
                              backgroundColor: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              fontSize: '12px',
                              alignItems: 'center'
                            }}>
                              <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#002F56' }}>{row.company}</span>
                              <span>{row.level}</span>
                              <span style={{ fontWeight: 'bold', color: '#10b981' }}>{row.tc}</span>
                              <span style={{ color: '#64748b', fontWeight: 'bold' }}>{row.label}</span>
                              <span style={{
                                width: 'fit-content',
                                padding: '3px 8px',
                                borderRadius: '9999px',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                color: '#10b981',
                                backgroundColor: '#ecfdf5',
                                border: '1px solid #d1fae5'
                              }}>{row.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>
        </section>

        {/* SECTION 2: SIMPLIFY COMPENSATION DATA */}
        <section style={{ 
          padding: '100px 24px', 
          backgroundColor: '#ffffff', 
          borderBottom: '1px solid #e2e8f0' 
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '80px', alignItems: 'center' }}>
            
            <div>
              <span style={{ color: '#29B6F6', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>
                Precision Compensation Intelligence
              </span>
              
              <h2 style={{ 
                fontSize: '44px', 
                fontWeight: '900', 
                color: '#002F56', 
                letterSpacing: '-1.5px',
                lineHeight: '1.1',
                marginBottom: '28px'
              }}>
                Compensation Data, Democratized Completely.
              </h2>

              <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.6', marginBottom: '40px' }}>
                Our platform provides an unbreakable link between career levels and real-world compensation. By aggregating anonymous but verified pay records across the tech ecosystem, engineering teams can negotiate with absolute certainty.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '8px',
                    backgroundColor: '#F4F9FC', border: '1px solid #cbd5e1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#29B6F6', flexShrink: 0
                  }}>
                    <BrainCircuit size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#002F56', margin: '0 0 6px 0' }}>AI-Powered Negotiation Coach</h4>
                    <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                      Leverage Gemini artificial intelligence primed with market salaries. Practice hard conversations and get immediate feedback on your offers.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '8px',
                    backgroundColor: '#F4F9FC', border: '1px solid #cbd5e1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#10b981', flexShrink: 0
                  }}>
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#002F56', margin: '0 0 6px 0' }}>Verified Market Benchmarks</h4>
                    <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                      Every salary record is normalized against industry standards, ensuring you're comparing apples to apples across base, equity, and target bonuses.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '8px',
                    backgroundColor: '#F4F9FC', border: '1px solid #cbd5e1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#8b5cf6', flexShrink: 0
                  }}>
                    <Layers size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#002F56', margin: '0 0 6px 0' }}>Universal Leveling Map</h4>
                    <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                      Understand how an L5 at Google translates to an E6 at Meta or a Senior III at Stripe. Move between companies with clear expectations.
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Performance Widget */}
            <div style={{
              backgroundColor: '#F4F9FC',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '36px',
              boxShadow: 'inset 0 4px 10px rgba(0,47,86,0.01)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase' }}>compensation_confidence_metrics</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#10b981', fontWeight: 'bold' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} /> Live
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>
                    <span>DATASET FRESHNESS</span>
                    <span style={{ color: '#002F56' }}>99%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: '99%', height: '100%', backgroundColor: '#29B6F6', borderRadius: '9999px' }} />
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>
                    <span>VERIFIED RECORD RATE</span>
                    <span style={{ color: '#002F56' }}>8.2k/mo</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: '75%', height: '100%', backgroundColor: '#10b981', borderRadius: '9999px' }} />
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>
                    <span>LEVELING CROSS-WALK ACCURACY</span>
                    <span style={{ color: '#002F56' }}>98.4%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: '94%', height: '100%', backgroundColor: '#8b5cf6', borderRadius: '9999px' }} />
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                border: '1px dashed #cbd5e1',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'center', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#e6f7ff', color: '#29B6F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={16} />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#002F56' }}>Submissions</span>
                </div>
                
                <ChevronRight size={16} style={{ color: '#cbd5e1' }} />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'center', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '32px', borderRadius: '6px', backgroundColor: '#ecfdf5', color: '#10b981', border: '1px solid #d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                    AI
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#002F56' }}>Normalization</span>
                </div>

                <ChevronRight size={16} style={{ color: '#cbd5e1' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'center', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#f5f3ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileCheck size={16} />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#002F56' }}>Market Ledger</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 3: MARKET COMPENSATION INTELLIGENCE */}
        <section style={{ 
          padding: '100px 24px', 
          backgroundColor: '#F4F9FC', 
          borderBottom: '1px solid #e2e8f0' 
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            
            <span style={{ color: '#29B6F6', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>
              Infinite Scale Benchmarking
            </span>
            
            <h2 style={{ 
              fontSize: '44px', 
              fontWeight: '900', 
              color: '#002F56', 
              letterSpacing: '-1.5px',
              marginBottom: '48px'
            }}>
              Market-Leading Salary Data. Smash Pay Gaps.
            </h2>

            {/* 4 grid columns details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '24px', marginBottom: '64px', textAlign: 'left' }}>
              
              {[
                { title: 'Data Collection', text: 'Real-time anonymous submissions, verified payroll verification, and secure market data feeds.', color: '#29B6F6' },
                { title: 'AI Benchmarking', text: 'Advanced regression models predicting compensation ranges based on experience, location, and level.', color: '#10b981' },
                { title: 'Privacy First', text: 'All data is anonymized and aggregated to protect individual identities while maintaining precision.', color: '#8b5cf6' },
                { title: 'Verified Profiles', text: 'Company profiles with verified median pay, benefits, and leveling transparency signatures.', color: '#f59e0b' }
              ].map((card, idx) => (
                <div key={idx} style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 4px 12px rgba(0,47,86,0.01)',
                  transition: 'all 0.2s'
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: card.color, marginBottom: '16px' }} />
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#002F56', margin: '0 0 10px 0' }}>{card.title}</h4>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>{card.text}</p>
                </div>
              ))}

            </div>

            {/* TAB SELECTOR */}
            <div style={{
              display: 'inline-flex',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '9999px',
              padding: '6px',
              gap: '4px',
              marginBottom: '32px',
              boxShadow: '0 4px 10px rgba(0,47,86,0.02)'
            }}>
              {['Software Engineer', 'Product Manager', 'Designer', 'Data Scientist', 'Engineering Manager'].map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    backgroundColor: activeTab === tab ? '#002F56' : 'transparent',
                    color: activeTab === tab ? '#ffffff' : '#475569',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '8px 20px',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB PREVIEW */}
            <div style={{
              width: '100%',
              maxWidth: '900px',
              margin: '0 auto',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,47,86,0.03)',
              padding: '28px',
              textAlign: 'left'
            }}>
              <div>
                <h4 style={{ color: '#002F56', margin: '0 0 10px 0', fontSize: '18px', fontWeight: '800' }}>{activeTab} Compensation Breakdown</h4>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
                  Explore the multi-dimensional pay structure for {activeTab}s across the industry.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px', backgroundColor: '#f8fafc' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Median Base</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#29B6F6', marginTop: '4px' }}>$185,000</div>
                  </div>
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px', backgroundColor: '#f8fafc' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Median Equity (RSU)</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6', marginTop: '4px' }}>$120,000 / yr</div>
                  </div>
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px', backgroundColor: '#f8fafc' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Median Bonus</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981', marginTop: '4px' }}>15% target</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* LOGOS GRID SECTION */}
        <section style={{ padding: '64px 24px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '32px' }}>
              DEMOCRATIZING DATA FOR THE WORLD'S BEST TEAMS
            </span>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-around', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '40px' 
            }}>
              {['Google', 'Meta', 'Amazon', 'Apple', 'Netflix', 'Microsoft'].map((logo, idx) => (
                <div 
                  key={idx}
                  style={{
                    fontSize: '24px',
                    fontWeight: '900',
                    color: '#cbd5e1',
                    letterSpacing: '-1.5px',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ECOSYSTEM */}
        <section style={{ padding: '100px 24px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span style={{ color: '#29B6F6', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>
                Infinite Insights
              </span>
              <h2 style={{ fontSize: '44px', fontWeight: '900', color: '#002F56', letterSpacing: '-1.5px' }}>
                the compensation data ecosystem.
              </h2>
              <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '600px', margin: '16px auto 0 auto' }}>
                Securely browse and contribute to the most accurate professional compensation ledger on the web.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
              
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '32px', backgroundColor: '#ffffff' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#e6f7ff', color: '#29B6F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Database size={20} />
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#002F56', margin: '0 0 10px 0' }}>Real-time Statistics</h4>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                  Get instant access to median TC, equity ranges, and benefit packages across thousands of verified entries.
                </p>
              </div>

              <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '32px', backgroundColor: '#ffffff' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <BrainCircuit size={20} />
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#002F56', margin: '0 0 10px 0' }}>AI Negotiations</h4>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                  Our AI Coach is trained on thousands of data points to help you secure the compensation you deserve.
                </p>
              </div>

              <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '32px', backgroundColor: '#ffffff' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f5f3ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <GraduationCap size={20} />
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#002F56', margin: '0 0 10px 0' }}>Career Guidance</h4>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                  Understand leveling maps and career trajectories to plan your next transition with high-fidelity data.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* BLUE CTA BLOCK */}
        <section style={{
          backgroundColor: '#00A3E0',
          backgroundImage: 'linear-gradient(135deg, #00A3E0 0%, #29B6F6 100%)',
          color: '#ffffff',
          padding: '80px 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          
          <div style={{ maxWidth: '800px', margin: '0 auto', zIndex: 10, position: 'relative' }}>
            <h2 style={{ 
              fontSize: '44px', 
              fontWeight: '900', 
              marginBottom: '20px', 
              letterSpacing: '-1.5px'
            }}>
              where career meets absolute transparency.
            </h2>
            
            <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
              Gain absolute compensation certainty without the guesswork. Join thousands of engineers today.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                to="/submit" 
                style={{ 
                  color: '#002F56', 
                  backgroundColor: '#ffffff',
                  fontWeight: '700', 
                  padding: '16px 36px', 
                  borderRadius: '9999px',
                  fontSize: '15px', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(0,47,86,0.1)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Submit Salary
              </Link>
              
              <Link 
                to="/salaries" 
                style={{ 
                  color: '#ffffff', 
                  border: '1px solid #ffffff',
                  fontWeight: '700', 
                  padding: '16px 32px', 
                  borderRadius: '9999px',
                  fontSize: '15px', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Browse Data
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default HomePage;
