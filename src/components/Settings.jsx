import React, { useState } from 'react';
import { Download, Upload, Trash2, Info, Database, AlertTriangle } from 'lucide-react';
import { downloadDataAsJSON, importDataFromFile } from '../utils/dataExport';
import { clearStore, STORES } from '../utils/database';
import { useLanguage } from '../contexts/LanguageContext';
import './Settings.css';

const Settings = () => {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

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
            // Reload the page to reflect cleared data
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            setMessage({ text: t('clearError') || 'Failed to clear data', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1>{t('settings') || 'Settings'}</h1>
            </div>

            {message.text && (
                <div className={`settings-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="settings-content">
                <section className="settings-card">
                    <div className="card-header">
                        <Database size={20} />
                        <h2>{t('dataManagement') || 'Data Management'}</h2>
                    </div>
                    <p className="card-description">
                        {t('dataManagementDesc') || 'Export your data for backup or import previously saved data.'}
                    </p>

                    <div className="action-list">
                        <div className="action-item">
                            <div className="action-info">
                                <span className="action-title">{t('exportData') || 'Export Data'}</span>
                                <span className="action-desc">Download a backup of your transactions and budgets.</span>
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={handleExport}
                                disabled={isLoading}
                            >
                                <Download size={18} />
                                {t('exportData') || 'Export'}
                            </button>
                        </div>

                        <div className="action-item">
                            <div className="action-info">
                                <span className="action-title">{t('importData') || 'Import Data'}</span>
                                <span className="action-desc">Restore data from a previously exported JSON file.</span>
                            </div>
                            <label className="btn btn-secondary upload-btn">
                                <Upload size={18} />
                                {t('importData') || 'Import'}
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleImport}
                                    disabled={isLoading}
                                />
                            </label>
                        </div>

                        <div className="action-item danger-zone">
                            <div className="action-info">
                                <span className="action-title text-danger">{t('clearAllData') || 'Clear All Data'}</span>
                                <span className="action-desc">Permanently delete all your data. This cannot be undone.</span>
                            </div>
                            <button
                                className="btn btn-danger"
                                onClick={handleClearData}
                                disabled={isLoading}
                            >
                                <Trash2 size={18} />
                                {t('clearAllData') || 'Clear'}
                            </button>
                        </div>
                    </div>
                </section>

                <section className="settings-card">
                    <div className="card-header">
                        <Info size={20} />
                        <h2>{t('about') || 'About'}</h2>
                    </div>
                    <div className="about-info">
                        <div className="info-row">
                            <span className="info-label">{t('appTitle')}</span>
                            <span className="info-value">{t('appDescription') || 'Personal Finance Management Application'}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">{t('version') || 'Version'}</span>
                            <span className="info-value">1.0.0</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Storage</span>
                            <span className="info-value">{t('storageInfo') || 'Local IndexedDB'}</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
