import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, GitBranch, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/80 py-10 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Pitch */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-white text-xs font-black">
                $
              </div>
              <span className="text-md font-bold tracking-tight text-navy">
                LEVEL<span className="text-sky-blue">EDGE</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs text-center md:text-left">
              High-fidelity compensation intelligence and salary benchmarking for engineering teams.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-semibold text-slate-600">
            <Link to="/salaries" className="hover:text-navy transition-colors">Explorer</Link>
            <Link to="/companies" className="hover:text-navy transition-colors">Database</Link>
            <Link to="/compare" className="hover:text-navy transition-colors">Comparison Hub</Link>
            <Link to="/ai-coach" className="hover:text-navy transition-colors">AI Negotiator</Link>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Ready to explore
            </span>
            <span className="flex items-center gap-1">
              <Cpu size={12} />
              IndexedDB cache
            </span>
          </div>

        </div>

        <div className="mt-8 border-t border-slate-200/60 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} LevelEdge Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <span className="hover:text-slate-600 cursor-pointer">Market data</span>
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
