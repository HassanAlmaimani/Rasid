import React from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../utils/format';
import './BudgetPieChart.css';

const BudgetPieChart = () => {
    const { budgets, transactions } = useFinance();
    const { t } = useLanguage();

    // Calculate spending per budget category
    const getCategorySpending = () => {
        const categoryData = budgets.map(budget => {
            const spent = transactions
                .filter(t => t.type === 'expense' && t.category.toLowerCase() === budget.category.toLowerCase())
                .reduce((acc, t) => acc + Number(t.amount), 0);

            return {
                category: budget.category,
                spent: spent,
                limit: budget.limit
            };
        });

        return categoryData.filter(data => data.spent > 0);
    };

    const categoryData = getCategorySpending();
    const totalSpent = categoryData.reduce((acc, data) => acc + data.spent, 0);

    if (categoryData.length === 0) {
        return (
            <div className="pie-chart-container">
                <h3>{t('budgetBreakdown')}</h3>
                <p className="empty-state">{t('noSpendingData')}</p>
            </div>
        );
    }

    // Generate pie chart segments
    const generatePieSegments = () => {
        let currentAngle = 0;
        const radius = 80;
        const centerX = 100;
        const centerY = 100;

        const colors = [
            '#a3b18a', // sage green
            '#d4a373', // muted earth
            '#b5838d', // dusty rose
            '#8b9dc3', // soft blue
            '#c9ada7', // warm gray
            '#9c89b8', // soft purple
        ];

        return categoryData.map((data, index) => {
            const percentage = (data.spent / totalSpent) * 100;
            const angle = (percentage / 100) * 360;

            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            // Convert angles to radians
            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);

            // Calculate arc path
            const x1 = centerX + radius * Math.cos(startRad);
            const y1 = centerY + radius * Math.sin(startRad);
            const x2 = centerX + radius * Math.cos(endRad);
            const y2 = centerY + radius * Math.sin(endRad);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
            ].join(' ');

            currentAngle = endAngle;

            return {
                path: pathData,
                color: colors[index % colors.length],
                category: data.category,
                spent: data.spent,
                percentage: percentage.toFixed(1)
            };
        });
    };

    const segments = generatePieSegments();

    return (
        <div className="pie-chart-container">
            <h3>{t('budgetBreakdown')}</h3>
            <div className="pie-chart-content">
                <svg viewBox="0 0 200 200" className="pie-chart-svg">
                    {segments.map((segment, index) => (
                        <path
                            key={index}
                            d={segment.path}
                            fill={segment.color}
                            stroke="var(--color-bg)"
                            strokeWidth="2"
                            className="pie-segment"
                        />
                    ))}
                </svg>
                <div className="pie-chart-legend">
                    {segments.map((segment, index) => (
                        <div key={index} className="legend-item">
                            <div
                                className="legend-color"
                                style={{ backgroundColor: segment.color }}
                            ></div>
                            <div className="legend-info">
                                <span className="legend-category">{segment.category}</span>
                                <span className="legend-details">
                                    {formatCurrency(segment.spent)} ({segment.percentage}%)
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BudgetPieChart;
