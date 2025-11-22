/**
 * Data Export/Import Utilities for Rāsid Finance App
 * Provides functionality to backup and restore data
 */

import { getAllData, addData, clearStore, STORES } from './database';

/**
 * Export all data from the database
 * @returns {Promise<Object>} Object containing all transactions, budgets, and settings
 */
export const exportData = async () => {
    try {
        const transactions = await getAllData(STORES.TRANSACTIONS);
        const budgets = await getAllData(STORES.BUDGETS);
        const settings = await getAllData(STORES.SETTINGS);

        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            data: {
                transactions,
                budgets,
                settings
            }
        };

        return exportData;
    } catch (error) {
        console.error('Error exporting data:', error);
        throw error;
    }
};

/**
 * Download exported data as JSON file
 */
export const downloadDataAsJSON = async () => {
    try {
        const data = await exportData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `rasid-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading data:', error);
        throw error;
    }
};

/**
 * Import data from a backup file
 * @param {Object} importData - Data object to import
 * @param {boolean} clearExisting - Whether to clear existing data before import
 * @returns {Promise<void>}
 */
export const importData = async (importData, clearExisting = false) => {
    try {
        if (!importData || !importData.data) {
            throw new Error('Invalid import data format');
        }

        const { transactions, budgets, settings } = importData.data;

        // Clear existing data if requested
        if (clearExisting) {
            await clearStore(STORES.TRANSACTIONS);
            await clearStore(STORES.BUDGETS);
            await clearStore(STORES.SETTINGS);
        }

        // Import transactions
        if (transactions && Array.isArray(transactions)) {
            for (const transaction of transactions) {
                await addData(STORES.TRANSACTIONS, transaction);
            }
        }

        // Import budgets
        if (budgets && Array.isArray(budgets)) {
            for (const budget of budgets) {
                await addData(STORES.BUDGETS, budget);
            }
        }

        // Import settings
        if (settings && Array.isArray(settings)) {
            for (const setting of settings) {
                await addData(STORES.SETTINGS, setting);
            }
        }

        console.log('Data imported successfully');
    } catch (error) {
        console.error('Error importing data:', error);
        throw error;
    }
};

/**
 * Import data from a JSON file
 * @param {File} file - The file to import
 * @param {boolean} clearExisting - Whether to clear existing data before import
 * @returns {Promise<void>}
 */
export const importDataFromFile = async (file, clearExisting = false) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const importData = JSON.parse(event.target.result);
                await importData(importData, clearExisting);
                resolve();
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsText(file);
    });
};

/**
 * Get database statistics
 * @returns {Promise<Object>} Statistics about the database
 */
export const getDatabaseStats = async () => {
    try {
        const transactions = await getAllData(STORES.TRANSACTIONS);
        const budgets = await getAllData(STORES.BUDGETS);

        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        return {
            transactionCount: transactions.length,
            budgetCount: budgets.length,
            totalIncome,
            totalExpenses,
            balance: totalIncome - totalExpenses,
            oldestTransaction: transactions.length > 0
                ? new Date(Math.min(...transactions.map(t => new Date(t.date))))
                : null,
            newestTransaction: transactions.length > 0
                ? new Date(Math.max(...transactions.map(t => new Date(t.date))))
                : null
        };
    } catch (error) {
        console.error('Error getting database stats:', error);
        throw error;
    }
};
