import React, { useState } from 'react';
import { BrainCircuit, Sparkles, Send, RefreshCw, HelpCircle, Check } from 'lucide-react';
import { api } from '../lib/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import MarkdownResponse from '../components/ai/MarkdownResponse';

export default function AiCoachPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const templates = [
    {
      title: 'Compare Meta vs Google',
      desc: 'Compare salary, stocks, and culture side-by-side.',
      query: 'Compare Meta vs Google for senior software engineers'
    },
    {
      title: 'Senior SWE Market Pay',
      desc: 'What is the median base/stock/bonus breakdown?',
      query: 'What is the typical total compensation for L5 at Google?'
    },
    {
      title: 'Negotiation Strategy',
      desc: 'Get actionable negotiation tips for counteroffers.',
      query: 'Give me 3 actionable tips to negotiate a staff engineer offer with a competitor counteroffer'
    }
  ];

  const handleAsk = async (queryToSend: string) => {
    if (!queryToSend.trim() || loading) return;
    setLoading(true);
    setResponse('');
    
    try {
      const result = await api.getAiInsights(queryToSend);
      setResponse(result.response);
    } catch (e) {
      console.error('Error in AI Coach:', e);
      setResponse('I apologize, but my AI negotiation engine encountered a brief connection glitch. Please try asking again shortly!');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(prompt);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 min-h-screen bg-white">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-navy text-sky-blue mb-4 shadow-lg animate-pulse-soft">
          <BrainCircuit size={22} />
        </div>
        <h1 className="text-3xl font-black text-navy tracking-tight">
          AI Career & Salary Coach
        </h1>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Ask our Gemini-powered AI Negotiation Assistant about tech leveling structure, stock compensation vesting, promotion tracks, or tips to maximize your next counteroffer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Input form & templates */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Templates */}
          <div className="flex flex-col gap-3">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Interactive Templates</span>
            
            {templates.map((t, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(t.query);
                  handleAsk(t.query);
                }}
                disabled={loading}
                className="w-full text-left p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-md hover:-translate-y-px transition-all duration-300 focus:outline-none"
              >
                <h4 className="text-xs font-black text-navy tracking-tight flex items-center gap-1">
                  <Sparkles size={12} className="text-sky-blue" />
                  {t.title}
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-relaxed">
                  {t.desc}
                </p>
              </button>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Terminal playground */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card padding="md" hoverable={false} className="border-slate-200/80 bg-slate-50/20 shadow-lg min-h-125 flex flex-col">
            
            {/* Active connection header */}
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="primary" size="sm" className="font-extrabold tracking-widest text-[9px]">GEMINI_PRO_V1</Badge>
                <span className="text-[11px] font-bold text-slate-400">Negotiation Engine Online</span>
              </div>
              <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-50">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

            {/* Response Area */}
            <div className="flex-1 rounded-xl border border-slate-200/80 bg-white p-5 overflow-y-auto mb-4 text-xs font-semibold text-slate-700 leading-relaxed shadow-inner max-h-96 min-h-64">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-sky-blue">
                  <RefreshCw size={28} className="animate-spin" />
                  <span className="text-[10px] uppercase font-black tracking-widest animate-pulse">[GEMINI VM] INGESTING SALARY DATABASE AND SCALING OFFER INSIGHTS...</span>
                </div>
              ) : response ? (
                <MarkdownResponse content={response} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
                  <HelpCircle size={32} className="text-slate-300" />
                  <div>
                    <h4 className="text-xs font-black text-navy uppercase tracking-wider mb-1">Waiting for Query</h4>
                    <p className="text-slate-400 text-[10px] leading-relaxed max-w-xs mx-auto">
                      Select one of the quick templates on the left or type your custom career/offer query in the input below.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200/40 pt-4 mt-auto">
              <input
                type="text"
                placeholder="Ask: 'Typical base salary for Netflix Staff engineer?'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-semibold text-navy focus:outline-none focus:border-sky-blue focus:ring-1 focus:ring-sky-blue disabled:opacity-50 transition-all"
              />
              <button
                type="submit"
                disabled={!prompt.trim() || loading}
                className="btn-primary py-3 px-5 rounded-xl shadow-md shadow-sky-blue/20 disabled:opacity-50"
              >
                <Send size={15} />
              </button>
            </form>

          </Card>
        </div>

      </div>

    </div>
  );
}
