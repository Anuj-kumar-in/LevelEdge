import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DollarSign, Layers, BrainCircuit, BarChart3, PlusCircle } from 'lucide-react';

export default function Header() {
  const location = useLocation();

  const navItems = [
    { label: 'Salaries Explorer', path: '/salaries', icon: <DollarSign size={16} /> },
    { label: 'Company Database', path: '/companies', icon: <Layers size={16} /> },
    { label: 'Compare Hub', path: '/compare', icon: <BarChart3 size={16} /> },
    { label: 'AI Salary Coach', path: '/ai-coach', icon: <BrainCircuit size={16} /> }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-blue to-cyan shadow-md shadow-sky-blue/20 transition-transform duration-300 group-hover:scale-105">
            <span className="text-lg font-black text-white">$</span>
          </div>
          <span className="text-xl font-black tracking-tight text-navy">
            LEVEL<span className="text-sky-blue">EDGE</span>
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-light-bg text-navy'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-navy'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Submit Pill CTA */}
        <div className="flex items-center gap-4">
          <Link to="/submit" className="btn-primary flex items-center gap-2 shadow-sm shadow-sky-blue/10 hover:shadow-sky-blue/20">
            <PlusCircle size={15} />
            <span>Share Pay</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
