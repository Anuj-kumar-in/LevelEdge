import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import Card from '../components/ui/Card';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-md px-6 py-20 min-h-[70vh] flex flex-col justify-center">
      <Card hoverable={false} className="border-slate-200 bg-white shadow-lg text-center p-8 flex flex-col items-center">
        
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500 mb-6 shadow-inner animate-bounce">
          <AlertTriangle size={32} />
        </div>

        <h1 className="text-2xl font-black text-navy tracking-tight mb-2">
          Page Not Found
        </h1>
        
        <p className="text-xs text-slate-500 max-w-xs mb-8 leading-relaxed">
          The compensation page or leveling guide you are looking for does not exist or has been shifted in our database.
        </p>

        <button
          onClick={() => navigate('/')}
          className="btn-primary py-3 px-6 text-center w-full justify-center"
        >
          <Home size={15} />
          <span>Return Home</span>
        </button>

      </Card>
    </div>
  );
}
