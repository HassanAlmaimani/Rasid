import React, { useState, useMemo } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../utils/format';
import BudgetPieChart from './BudgetPieChart';
import { Filter, ChevronDown } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const { getSummary, transactions, deleteTransaction } = useFinance();
    const { t } = useLanguage();
    const { income, expenses, balance } = getSummary();

    // Filter states
    const [filters, setFilters] = useState({
        type: 'all', // 'all', 'expense', 'income'
        sortBy: 'newest', // 'newest', 'oldest', 'ascending', 'descending'
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Toggle filter
    const toggleFilter = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType] === value ? (filterType === 'type' ? 'all' : 'newest') : value
        }));
    };

    // Apply filters and sorting
    const filteredTransactions = useMemo(() => {
        let result = [...transactions];

        // Filter by type
        if (filters.type !== 'all') {
            result = result.filter(t => t.type === filters.type);
        }

        // Sort
        switch (filters.sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'ascending':
                result.sort((a, b) => Number(a.amount) - Number(b.amount));
                break;
            case 'descending':
                result.sort((a, b) => Number(b.amount) - Number(a.amount));
                break;
            default:
                break;
        }

        return result;
    }, [transactions, filters]);

    // Count active filters
    const activeFilterCount = (filters.type !== 'all' ? 1 : 0) + (filters.sortBy !== 'newest' ? 1 : 0);

    return (
        <div className="dashboard">
            <section className="summary-cards">
                <div className="card balance-card">
                    <h3>{t('totalBalance')}</h3>
                    <p className="amount">{formatCurrency(balance)}</p>
                </div>
                <div className="card income-card">
                    <h3>{t('income')}</h3>
                    <p className="amount positive">{formatCurrency(income)}</p>
                </div>
                <div className="card expense-card">
                    <h3>{t('expenses')}</h3>
                    <p className="amount negative">{formatCurrency(expenses)}</p>
                </div>
            </section>

            <BudgetPieChart />

            <section className="transactions-section">
                <div className="transactions-header">
                    <h3>{t('transactions')}</h3>
                    <div className="filter-dropdown-container">
                        <button
                            className="filter-dropdown-btn"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <Filter size={18} />
                            <span>{t('filterBy')}</span>
                            {activeFilterCount > 0 && (
                                <span className="filter-badge">{activeFilterCount}</span>
                            )}
                            <ChevronDown size={18} className={`chevron ${isFilterOpen ? 'open' : ''}`} />
                        </button>

                        {isFilterOpen && (
                            <div className="filter-dropdown-menu">
                                <div className="filter-group">
                                    <span className="filter-group-label">{t('type')}</span>
                                    <button
                                        className={`filter-option ${filters.type === 'expense' ? 'active' : ''}`}
                                        onClick={() => toggleFilter('type', 'expense')}
                                    >
                                        {t('expensesOnly')}
                                    </button>
                                    <button
                                        className={`filter-option ${filters.type === 'income' ? 'active' : ''}`}
                                        onClick={() => toggleFilter('type', 'income')}
                                    >
                                        {t('incomeOnly')}
                                    </button>
                                </div>

                                <div className="filter-divider"></div>

                                <div className="filter-group">
                                    <span className="filter-group-label">{t('sortBy')}</span>
                                    <button
                                        className={`filter-option ${filters.sortBy === 'ascending' ? 'active' : ''}`}
                                        onClick={() => toggleFilter('sortBy', 'ascending')}
                                    >
                                        {t('ascending')}
                                    </button>
                                    <button
                                        className={`filter-option ${filters.sortBy === 'descending' ? 'active' : ''}`}
                                        onClick={() => toggleFilter('sortBy', 'descending')}
                                    >
                                        {t('descending')}
                                    </button>
                                    <button
                                        className={`filter-option ${filters.sortBy === 'newest' ? 'active' : ''}`}
                                        onClick={() => toggleFilter('sortBy', 'newest')}
                                    >
                                        {t('newestFirst')}
                                    </button>
                                    <button
                                        className={`filter-option ${filters.sortBy === 'oldest' ? 'active' : ''}`}
                                        onClick={() => toggleFilter('sortBy', 'oldest')}
                                    >
                                        {t('oldestFirst')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {filteredTransactions.length === 0 ? (
                    <p className="empty-state">{t('noTransactions')}</p>
                ) : (
                    <ul className="transaction-list">
                        {filteredTransactions.map(t => (
                            <li key={t.id} className={`transaction-item ${t.type}`}>
                                <div className="transaction-info">
                                    <span className="category">{t.category}</span>
                                    <span className="date">{new Date(t.date).toLocaleDateString()}</span>
                                </div>
                                <div className="transaction-actions">
                                    <span className={`amount ${t.type === 'income' ? 'positive' : 'negative'}`}>
                                        {t.type === 'income' ? '+' : '-'}{formatCurrency(Number(t.amount))}
                                    </span>
                                    <button
                                        className="delete-transaction-btn"
                                        onClick={() => deleteTransaction(t.id)}
                                        aria-label="Delete transaction"
                                    >
                                        ×
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};

export default Dashboard;
