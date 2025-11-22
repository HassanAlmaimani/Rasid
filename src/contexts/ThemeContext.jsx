import React, { createContext, useContext, useEffect, useState } from 'react';
import { initDB, getDataById, updateData, STORES } from '../utils/database';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                await initDB();
                const savedTheme = await getDataById(STORES.SETTINGS, 'theme');

                // Migration from localStorage
                if (!savedTheme) {
                    const localTheme = localStorage.getItem('theme');
                    if (localTheme) {
                        await updateData(STORES.SETTINGS, { key: 'theme', value: localTheme });
                        setTheme(localTheme);
                        localStorage.removeItem('theme');
                    }
                } else {
                    setTheme(savedTheme.value);
                }

                setIsLoaded(true);
            } catch (error) {
                console.error('Error loading theme:', error);
                setIsLoaded(true);
            }
        };

        loadTheme();
    }, []);

    useEffect(() => {
        if (isLoaded) {
            updateData(STORES.SETTINGS, { key: 'theme', value: theme }).catch(err =>
                console.error('Error saving theme:', err)
            );
            document.documentElement.setAttribute('data-theme', theme);
        }
    }, [theme, isLoaded]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
