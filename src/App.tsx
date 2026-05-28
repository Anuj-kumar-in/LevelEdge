import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import SalariesPage from './pages/SalariesPage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyPage from './pages/CompanyPage';
import ComparePage from './pages/ComparePage';
import SubmitPage from './pages/SubmitPage';
import AiCoachPage from './pages/AiCoachPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/salaries" element={<SalariesPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/companies/:slug" element={<CompanyPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/ai-coach" element={<AiCoachPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
