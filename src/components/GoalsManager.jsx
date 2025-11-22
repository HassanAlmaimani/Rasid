import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../utils/format';
import { Target, Calendar, Plus, Minus } from 'lucide-react';
import GoalProgress from './GoalProgress';
import './GoalsManager.css';

const GoalsManager = () => {
    const { goals, addGoal, updateGoal, deleteGoal } = useFinance();
    const { t } = useLanguage();

    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalTarget, setNewGoalTarget] = useState('');
    const [newGoalDate, setNewGoalDate] = useState('');

    const [updateAmounts, setUpdateAmounts] = useState({});

    const handleAddGoal = (e) => {
        e.preventDefault();
        if (!newGoalName || !newGoalTarget) return;

        addGoal({
            name: newGoalName,
            targetAmount: parseFloat(newGoalTarget),
            targetDate: newGoalDate,
            currentAmount: 0
        });

        setNewGoalName('');
        setNewGoalTarget('');
        setNewGoalDate('');
    };

    const handleUpdateAmount = (id, amount, type) => {
        const goal = goals.find(g => g.id === id);
        if (!goal) return;

        const value = parseFloat(amount);
        if (isNaN(value) || value <= 0) return;

        let newAmount = goal.currentAmount;
        if (type === 'add') {
            newAmount += value;
        } else {
            newAmount = Math.max(0, newAmount - value);
        }

        updateGoal(id, { currentAmount: newAmount });

        // Clear input
        setUpdateAmounts(prev => ({ ...prev, [id]: '' }));
    };

    const handleInputChange = (id, value) => {
        setUpdateAmounts(prev => ({ ...prev, [id]: value }));
    };

    const calculateProgress = (current, target) => {
        return Math.min((current / target) * 100, 100);
    };

    return (
        <div className="goals-manager">
            <div className="add-goal-section">
                <h2>{t('addGoal')}</h2>
                <form onSubmit={handleAddGoal} className="goal-form">
                    <div className="input-group">
                        <input
                            type="text"
                            value={newGoalName}
                            onChange={(e) => setNewGoalName(e.target.value)}
                            placeholder={t('goalName')}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="number"
                            value={newGoalTarget}
                            onChange={(e) => setNewGoalTarget(e.target.value)}
                            placeholder={t('targetAmount')}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="date"
                            value={newGoalDate}
                            onChange={(e) => setNewGoalDate(e.target.value)}
                            placeholder={t('targetDate')}
                        />
                    </div>
                    <button type="submit">
                        <Plus size={18} style={{ marginRight: '0.5rem' }} />
                        {t('create')}
                    </button>
                </form>
            </div>

            <div className="goals-grid">
                {goals.length === 0 ? (
                    <p className="empty-state">{t('noGoals')}</p>
                ) : (
                    goals.map(goal => {
                        const percentage = calculateProgress(goal.currentAmount, goal.targetAmount);
                        const isReached = percentage >= 100;
                        const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

                        return (
                            <div key={goal.id} className="goal-card">
                                <div className="goal-header">
                                    <div>
                                        <div className="goal-title">{goal.name}</div>
                                        {goal.targetDate && (
                                            <div className="goal-date">
                                                <Calendar size={14} style={{ marginRight: '4px', display: 'inline' }} />
                                                {new Date(goal.targetDate).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteGoal(goal.id)}
                                        aria-label={t('deleteGoal')}
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="progress-circle-container">
                                    <GoalProgress
                                        percentage={percentage}
                                        radius={60}
                                        stroke={8}
                                    />
                                </div>

                                {isReached && <div className="goal-reached-badge">{t('goalReached')}</div>}

                                <div className="goal-details">
                                    <span>{t('currentAmount')}: {formatCurrency(goal.currentAmount)}</span>
                                    <span>{t('targetAmount')}: {formatCurrency(goal.targetAmount)}</span>
                                </div>

                                {!isReached && (
                                    <div className="goal-details" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
                                        <span style={{ color: 'var(--color-text-secondary)' }}>
                                            {t('remaining')}: {formatCurrency(remaining)}
                                        </span>
                                    </div>
                                )}

                                <div className="goal-actions">
                                    <input
                                        type="number"
                                        value={updateAmounts[goal.id] || ''}
                                        onChange={(e) => handleInputChange(goal.id, e.target.value)}
                                        placeholder={t('amount')}
                                        min="0"
                                        step="0.01"
                                    />
                                    <button
                                        className="action-btn add-funds"
                                        onClick={() => handleUpdateAmount(goal.id, updateAmounts[goal.id], 'add')}
                                        title={t('addIncome')}
                                    >
                                        <Plus size={16} />
                                    </button>
                                    <button
                                        className="action-btn remove-funds"
                                        onClick={() => handleUpdateAmount(goal.id, updateAmounts[goal.id], 'remove')}
                                        title={t('addExpense')}
                                    >
                                        <Minus size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default GoalsManager;
