import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../utils/format';
import './BudgetManager.css';

const BudgetManager = () => {
    const { budgets, transactions, addBudget, deleteBudget } = useFinance();
    const { t } = useLanguage();
    const [category, setCategory] = useState('');
    const [limit, setLimit] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!category || !limit) return;

        addBudget({
            category,
            limit: parseFloat(limit)
        });

        setCategory('');
        setLimit('');
    };

    const getSpentAmount = (category) => {
        return transactions
            .filter(t => t.type === 'expense' && t.category.toLowerCase() === category.toLowerCase())
            .reduce((acc, t) => acc + Number(t.amount), 0);
    };

    return (
        <div className="budget-manager">
            <div className="add-budget-section">
                <h2>{t('manageBudgets')}</h2>
                <form onSubmit={handleSubmit} className="budget-form">
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder={t('categoryPlaceholder')}
                        required
                    />
                    <input
                        type="number"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        placeholder={t('limitAmount')}
                        required
                    />
                    <button type="submit">{t('addBudget')}</button>
                </form>
            </div>

            <div className="budget-list">
                {budgets.length === 0 ? (
                    <p className="empty-state">{t('noBudgets')}</p>
                ) : (
                    budgets.map(budget => {
                        const spent = getSpentAmount(budget.category);
                        const percentage = Math.min((spent / budget.limit) * 100, 100);
                        const isOverBudget = spent > budget.limit;

                        return (
                            <div key={budget.id} className="budget-card">
                                <div className="budget-header">
                                    <span className="budget-category">{budget.category}</span>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteBudget(budget.id)}
                                        aria-label="Delete budget"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="budget-progress-container">
                                    <div className="budget-info">
                                        <span>{formatCurrency(spent)} {t('spent')}</span>
                                        <span>{t('of')} {formatCurrency(budget.limit)}</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div
                                            className={`progress-bar-fill ${isOverBudget ? 'over-budget' : ''}`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    {isOverBudget && <span className="warning-text">{t('overBudget')}</span>}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default BudgetManager;
