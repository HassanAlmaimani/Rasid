import React, { createContext, useState, useEffect, useContext } from 'react';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
    // Initial state from localStorage or defaults
    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('finance_transactions');
        return saved ? JSON.parse(saved) : [];
    });

    const [budgets, setBudgets] = useState(() => {
        const saved = localStorage.getItem('finance_budgets');
        return saved ? JSON.parse(saved) : [];
    });

    // Persistence effects
    useEffect(() => {
        localStorage.setItem('finance_transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('finance_budgets', JSON.stringify(budgets));
    }, [budgets]);

    // Transaction Actions
    const addTransaction = (transaction) => {
        const newTransaction = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...transaction
        };
        setTransactions(prev => [newTransaction, ...prev]);
    };

    const deleteTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    // Budget Actions
    const addBudget = (budget) => {
        const newBudget = {
            id: Date.now().toString(),
            ...budget
        };
        setBudgets(prev => [...prev, newBudget]);
    };

    const updateBudget = (id, updatedBudget) => {
        setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...updatedBudget } : b));
    };

    const deleteBudget = (id) => {
        setBudgets(prev => prev.filter(b => b.id !== id));
    };

    // Helper to get summary
    const getSummary = () => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + Number(t.amount), 0);

        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + Number(t.amount), 0);

        return {
            income,
            expenses,
            balance: income - expenses
        };
    };

    const value = {
        transactions,
        budgets,
        addTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        getSummary
    };

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
};
