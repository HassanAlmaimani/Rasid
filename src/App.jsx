import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import BudgetManager from './components/BudgetManager';
import MonthlySummary from './components/MonthlySummary';
import { LayoutDashboard, PlusCircle, Wallet, PieChart, Languages, TrendingUp, Moon, Sun } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'add':
        return <TransactionForm onComplete={() => setActiveTab('dashboard')} />;
      case 'budgets':
        return <BudgetManager />;
      case 'reports':
        return <MonthlySummary />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <aside className="app-sidebar">
        <div className="sidebar-header">
          <TrendingUp size={32} className="app-logo" />
          <h1>{t('appTitle')}</h1>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>{t('dashboard')}</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            <PlusCircle size={20} />
            <span>{t('addTransaction')}</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'budgets' ? 'active' : ''}`}
            onClick={() => setActiveTab('budgets')}
          >
            <Wallet size={20} />
            <span>{t('budgets')}</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <PieChart size={20} />
            <span>{t('reports')}</span>
          </button>

          <div className="nav-divider" style={{ margin: '1rem 0', marginTop: 'auto', borderTop: '1px solid var(--color-border)' }}></div>

          <button className="nav-item" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          <p className="language-label">{t('languagePreference')}</p>
          <button className="nav-item" onClick={toggleLanguage}>
            <Languages size={20} />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </nav>
      </aside>

      <main className="app-main">
        {renderContent()}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
