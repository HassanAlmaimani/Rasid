import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../utils/translations';
import { initDB, getDataById, updateData, STORES } from '../utils/database';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                await initDB();
                const savedLanguage = await getDataById(STORES.SETTINGS, 'language');

                // Migration from localStorage
                if (!savedLanguage) {
                    const localLanguage = localStorage.getItem('finance_language');
                    if (localLanguage) {
                        await updateData(STORES.SETTINGS, { key: 'language', value: localLanguage });
                        setLanguage(localLanguage);
                        localStorage.removeItem('finance_language');
                    }
                } else {
                    setLanguage(savedLanguage.value);
                }

                setIsLoaded(true);
            } catch (error) {
                console.error('Error loading language:', error);
                setIsLoaded(true);
            }
        };

        loadLanguage();
    }, []);

    useEffect(() => {
        if (isLoaded) {
            updateData(STORES.SETTINGS, { key: 'language', value: language }).catch(err =>
                console.error('Error saving language:', err)
            );
            document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = language;
        }
    }, [language, isLoaded]);

    const t = (key) => {
        return translations[language][key] || key;
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'ar' : 'en');
    };

    const value = {
        language,
        t,
        toggleLanguage
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
