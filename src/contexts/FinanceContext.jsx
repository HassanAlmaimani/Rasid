import React, { createContext, useState, useEffect, useContext } from 'react';
import { initDB, getAllData, addData, updateData, deleteData, STORES } from '../utils/database';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize database and load data
    useEffect(() => {
        const initializeData = async () => {
            try {
                // Initialize the database
                await initDB();

                // Check if we need to migrate from localStorage
                const localTransactions = localStorage.getItem('finance_transactions');
                const localBudgets = localStorage.getItem('finance_budgets');

                // Load data from IndexedDB
                const dbTransactions = await getAllData(STORES.TRANSACTIONS);
                const dbBudgets = await getAllData(STORES.BUDGETS);

                // If IndexedDB is empty but localStorage has data, migrate it
                if (dbTransactions.length === 0 && localTransactions) {
                    console.log('Migrating transactions from localStorage to IndexedDB...');
                    const parsedTransactions = JSON.parse(localTransactions);
                    for (const transaction of parsedTransactions) {
                        await addData(STORES.TRANSACTIONS, transaction);
                    }
                    setTransactions(parsedTransactions);
                    // Clear localStorage after migration
                    localStorage.removeItem('finance_transactions');
                } else {
                    setTransactions(dbTransactions);
                }

                if (dbBudgets.length === 0 && localBudgets) {
                    console.log('Migrating budgets from localStorage to IndexedDB...');
                    const parsedBudgets = JSON.parse(localBudgets);
                    for (const budget of parsedBudgets) {
                        await addData(STORES.BUDGETS, budget);
                    }
                    setBudgets(parsedBudgets);
                    // Clear localStorage after migration
                    localStorage.removeItem('finance_budgets');
                } else {
                    setBudgets(dbBudgets);
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Error initializing database:', error);
                setIsLoading(false);
            }
        };

        initializeData();
    }, []);

    // Transaction Actions
    const addTransaction = async (transaction) => {
        const newTransaction = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...transaction
        };

        try {
            await addData(STORES.TRANSACTIONS, newTransaction);
            setTransactions(prev => [newTransaction, ...prev]);
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const deleteTransaction = async (id) => {
        try {
            await deleteData(STORES.TRANSACTIONS, id);
            setTransactions(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    // Budget Actions
    const addBudget = async (budget) => {
        const newBudget = {
            id: Date.now().toString(),
            ...budget
        };

        try {
            await addData(STORES.BUDGETS, newBudget);
            setBudgets(prev => [...prev, newBudget]);
        } catch (error) {
            console.error('Error adding budget:', error);
        }
    };

    const updateBudget = async (id, updatedBudget) => {
        try {
            const budgetToUpdate = { id, ...updatedBudget };
            await updateData(STORES.BUDGETS, budgetToUpdate);
            setBudgets(prev => prev.map(b => b.id === id ? budgetToUpdate : b));
        } catch (error) {
            console.error('Error updating budget:', error);
        }
    };

    const deleteBudget = async (id) => {
        try {
            await deleteData(STORES.BUDGETS, id);
            setBudgets(prev => prev.filter(b => b.id !== id));
        } catch (error) {
            console.error('Error deleting budget:', error);
        }
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
        getSummary,
        isLoading
    };

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
};
