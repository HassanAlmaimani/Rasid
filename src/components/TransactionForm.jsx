import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { useLanguage } from '../contexts/LanguageContext';
import './TransactionForm.css';

const TransactionForm = ({ onComplete }) => {
    const { addTransaction } = useFinance();
    const { t } = useLanguage();
    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !category || !date) return;

        addTransaction({
            type,
            amount: parseFloat(amount),
            category,
            date,
            description: note
        });

        // Reset form
        setAmount('');
        setCategory('');
        setNote('');

        if (onComplete) {
            onComplete();
        }
    };

    return (
        <div className="transaction-form-container">
            <h2>{t('addTransaction')}</h2>
            <form onSubmit={handleSubmit} className="transaction-form">
                <div className="form-group type-selector">
                    <button
                        type="button"
                        className={`type-btn ${type === 'income' ? 'active income' : ''}`}
                        onClick={() => setType('income')}
                    >
                        {t('income')}
                    </button>
                    <button
                        type="button"
                        className={`type-btn ${type === 'expense' ? 'active expense' : ''}`}
                        onClick={() => setType('expense')}
                    >
                        {t('expenses')}
                    </button>
                </div>

                <div className="form-group">
                    <label htmlFor="amount">{t('amount')}</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">{t('category')}</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder={t('categoryPlaceholder')}
                        required
                        list="category-suggestions"
                    />
                    <datalist id="category-suggestions">
                        <option value="Food" />
                        <option value="Transport" />
                        <option value="Utilities" />
                        <option value="Entertainment" />
                        <option value="Salary" />
                        <option value="Freelance" />
                    </datalist>
                </div>

                <div className="form-group">
                    <label htmlFor="date">{t('date')}</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="note">{t('note')}</label>
                    <textarea
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={t('notePlaceholder')}
                        rows="3"
                    />
                </div>

                <button type="submit" className="submit-btn">
                    {type === 'income' ? t('addIncome') : t('addExpense')}
                </button>
            </form>
        </div>
    );
};

export default TransactionForm;
