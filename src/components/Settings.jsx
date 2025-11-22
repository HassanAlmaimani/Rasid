import React, { useState, useEffect } from 'react';
import { Download, Upload, Database, Trash2, Info } from 'lucide-react';
import { downloadDataAsJSON, importDataFromFile, getDatabaseStats } from '../utils/dataExport';
import { clearStore, STORES } from '../utils/database';
import { useLanguage } from '../contexts/LanguageContext';
import './Settings.css';

const Settings = () => {
    const { t } = useLanguage();
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const dbStats = await getDatabaseStats();
            setStats(dbStats);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const handleExport = async () => {
        setIsLoading(true);
        setMessage({ text: '', type: '' });
        try {
            await downloadDataAsJSON();
            setMessage({ text: t('exportSuccess') || 'Data exported successfully!', type: 'success' });
        } catch (error) {
            setMessage({ text: t('exportError') || 'Failed to export data', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsLoading(true);
        setMessage({ text: '', type: '' });
        try {
            await importDataFromFile(file, false);
            setMessage({ text: t('importSuccess') || 'Data imported successfully!', type: 'success' });
            await loadStats();
            // Reload the page to reflect imported data
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            setMessage({ text: t('importError') || 'Failed to import data', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearData = async () => {
        const confirmed = window.confirm(
            t('confirmClearData') || 'Are you sure you want to delete all data? This action cannot be undone!'
        );

        if (!confirmed) return;

        setIsLoading(true);
        setMessage({ text: '', type: '' });
        try {
            await clearStore(STORES.TRANSACTIONS);
            await clearStore(STORES.BUDGETS);
            setMessage({ text: t('clearSuccess') || 'All data cleared successfully!', type: 'success' });
            await loadStats();
            // Reload the page to reflect cleared data
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            setMessage({ text: t('clearError') || 'Failed to clear data', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <Database size={32} />
                <h1>{t('settings') || 'Settings'}</h1>
            </div>

            {message.text && (
                <div className={`settings-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="settings-section">
                <div className="section-header">
                    <Info size={20} />
                    <h2>{t('databaseInfo') || 'Database Information'}</h2>
                </div>
                {stats && (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <span className="stat-label">{t('totalTransactions') || 'Total Transactions'}</span>
                            <span className="stat-value">{stats.transactionCount}</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">{t('totalBudgets') || 'Total Budgets'}</span>
                            <span className="stat-value">{stats.budgetCount}</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">{t('totalIncome') || 'Total Income'}</span>
                            <span className="stat-value">${stats.totalIncome.toFixed(2)}</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">{t('totalExpenses') || 'Total Expenses'}</span>
                            <span className="stat-value">${stats.totalExpenses.toFixed(2)}</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">{t('balance') || 'Balance'}</span>
                            <span className="stat-value">${stats.balance.toFixed(2)}</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">{t('dateRange') || 'Date Range'}</span>
                            <span className="stat-value">
                                {formatDate(stats.oldestTransaction)} - {formatDate(stats.newestTransaction)}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div className="settings-section">
                <div className="section-header">
                    <Database size={20} />
                    <h2>{t('dataManagement') || 'Data Management'}</h2>
                </div>
                <p className="section-description">
                    {t('dataManagementDesc') || 'Export your data for backup or import previously saved data.'}
                </p>

                <div className="settings-actions">
                    <button
                        className="settings-btn export-btn"
                        onClick={handleExport}
                        disabled={isLoading}
                    >
                        <Download size={20} />
                        <span>{t('exportData') || 'Export Data'}</span>
                    </button>

                    <label className="settings-btn import-btn" style={{ cursor: 'pointer' }}>
                        <Upload size={20} />
                        <span>{t('importData') || 'Import Data'}</span>
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            style={{ display: 'none' }}
                            disabled={isLoading}
                        />
                    </label>

                    <button
                        className="settings-btn clear-btn"
                        onClick={handleClearData}
                        disabled={isLoading}
                    >
                        <Trash2 size={20} />
                        <span>{t('clearAllData') || 'Clear All Data'}</span>
                    </button>
                </div>
            </div>

            <div className="settings-section">
                <div className="section-header">
                    <Info size={20} />
                    <h2>{t('about') || 'About'}</h2>
                </div>
                <div className="about-content">
                    <p><strong>{t('appTitle')}</strong> - {t('appDescription') || 'Personal Finance Management Application'}</p>
                    <p>{t('version') || 'Version'}: 1.0.0</p>
                    <p>{t('storageInfo') || 'All data is stored locally in your browser using IndexedDB for maximum privacy and security.'}</p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
