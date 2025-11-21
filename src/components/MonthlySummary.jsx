import React from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../utils/format';
import './MonthlySummary.css';

const MonthlySummary = () => {
    const { transactions } = useFinance();
    const { t } = useLanguage();

    const getMonthlyData = () => {
        const today = new Date();
        const data = [];

        for (let i = 11; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const monthLabel = d.toLocaleString('default', { month: 'short' });

            const income = transactions
                .filter(t => t.type === 'income' && t.date.startsWith(monthKey))
                .reduce((acc, t) => acc + Number(t.amount), 0);

            const expense = transactions
                .filter(t => t.type === 'expense' && t.date.startsWith(monthKey))
                .reduce((acc, t) => acc + Number(t.amount), 0);

            data.push({
                label: monthLabel,
                income,
                expense,
                savings: income - expense
            });
        }
        return data;
    };

    const monthlyData = getMonthlyData();
    const maxAmount = Math.max(
        ...monthlyData.map(d => Math.max(d.income, d.expense)),
        1 // Avoid division by zero
    );

    return (
        <div className="monthly-summary">
            <h2>{t('yearlyOverview')}</h2>
            <div className="chart-container">
                {monthlyData.map((data, index) => (
                    <div key={index} className="chart-column">
                        <div className="bars-wrapper">
                            <div
                                className="bar income"
                                style={{ height: `${(data.income / maxAmount) * 100}%` }}
                                title={`${t('income')}: ${formatCurrency(data.income)}`}
                            ></div>
                            <div
                                className="bar expense"
                                style={{ height: `${(data.expense / maxAmount) * 100}%` }}
                                title={`${t('expenses')}: ${formatCurrency(data.expense)}`}
                            ></div>
                        </div>
                        <span className="month-label">{data.label}</span>
                    </div>
                ))}
            </div>

            <div className="summary-legend">
                <div className="legend-item">
                    <span className="dot income"></span> {t('income')}
                </div>
                <div className="legend-item">
                    <span className="dot expense"></span> {t('expenses')}
                </div>
            </div>

            <div className="summary-table-container">
                <table className="summary-table">
                    <thead>
                        <tr>
                            <th>{t('month')}</th>
                            <th>{t('income')}</th>
                            <th>{t('expenses')}</th>
                            <th>{t('savings')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...monthlyData].reverse().map((data, index) => (
                            <tr key={index}>
                                <td>{data.label}</td>
                                <td className="positive">{formatCurrency(data.income)}</td>
                                <td className="negative">{formatCurrency(data.expense)}</td>
                                <td className={data.savings >= 0 ? 'positive' : 'negative'}>
                                    {formatCurrency(data.savings)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MonthlySummary;
