import React from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../utils/format';
import BudgetPieChart from './BudgetPieChart';
import './Dashboard.css';

const Dashboard = () => {
    const { getSummary, transactions, deleteTransaction } = useFinance();
    const { t } = useLanguage();
    const { income, expenses, balance } = getSummary();

    const recentTransactions = transactions.slice(0, 5);

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

            <section className="recent-transactions">
                <h3>{t('recentTransactions')}</h3>
                {recentTransactions.length === 0 ? (
                    <p className="empty-state">{t('noTransactions')}</p>
                ) : (
                    <ul className="transaction-list">
                        {recentTransactions.map(t => (
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
