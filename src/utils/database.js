/**
 * IndexedDB Database Utility for Rāsid Finance App
 * Provides persistent storage for transactions and budgets
 */

const DB_NAME = 'RasidFinanceDB';
const DB_VERSION = 2;

// Object store names
const STORES = {
    TRANSACTIONS: 'transactions',
    BUDGETS: 'budgets',
    SETTINGS: 'settings'
};

/**
 * Initialize the IndexedDB database
 * @returns {Promise<IDBDatabase>}
 */
export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            reject(new Error('Failed to open database'));
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Create transactions store
            if (!db.objectStoreNames.contains(STORES.TRANSACTIONS)) {
                const transactionStore = db.createObjectStore(STORES.TRANSACTIONS, { keyPath: 'id' });
                transactionStore.createIndex('date', 'date', { unique: false });
                transactionStore.createIndex('type', 'type', { unique: false });
                transactionStore.createIndex('category', 'category', { unique: false });
            }

            // Create budgets store
            if (!db.objectStoreNames.contains(STORES.BUDGETS)) {
                const budgetStore = db.createObjectStore(STORES.BUDGETS, { keyPath: 'id' });
                budgetStore.createIndex('category', 'category', { unique: false });
            }

            // Create settings store
            if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
                db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
            }
        };
    });
};

/**
 * Generic function to add data to a store
 * @param {string} storeName - Name of the object store
 * @param {Object} data - Data to add
 * @returns {Promise<any>}
 */
export const addData = async (storeName, data) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(data);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(new Error(`Failed to add data to ${storeName}`));
        };
    });
};

/**
 * Generic function to update data in a store
 * @param {string} storeName - Name of the object store
 * @param {Object} data - Data to update (must include key)
 * @returns {Promise<any>}
 */
export const updateData = async (storeName, data) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(new Error(`Failed to update data in ${storeName}`));
        };
    });
};

/**
 * Generic function to delete data from a store
 * @param {string} storeName - Name of the object store
 * @param {string} id - ID of the item to delete
 * @returns {Promise<void>}
 */
export const deleteData = async (storeName, id) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            reject(new Error(`Failed to delete data from ${storeName}`));
        };
    });
};

/**
 * Generic function to get all data from a store
 * @param {string} storeName - Name of the object store
 * @returns {Promise<Array>}
 */
export const getAllData = async (storeName) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(new Error(`Failed to get data from ${storeName}`));
        };
    });
};

/**
 * Generic function to get a single item by ID
 * @param {string} storeName - Name of the object store
 * @param {string} id - ID of the item
 * @returns {Promise<Object|null>}
 */
export const getDataById = async (storeName, id) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);

        request.onsuccess = () => {
            resolve(request.result || null);
        };

        request.onerror = () => {
            reject(new Error(`Failed to get data from ${storeName}`));
        };
    });
};

/**
 * Clear all data from a store
 * @param {string} storeName - Name of the object store
 * @returns {Promise<void>}
 */
export const clearStore = async (storeName) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            reject(new Error(`Failed to clear ${storeName}`));
        };
    });
};

/**
 * Get data by index
 * @param {string} storeName - Name of the object store
 * @param {string} indexName - Name of the index
 * @param {any} value - Value to search for
 * @returns {Promise<Array>}
 */
export const getDataByIndex = async (storeName, indexName, value) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        const request = index.getAll(value);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(new Error(`Failed to get data by index from ${storeName}`));
        };
    });
};

// Export store names for use in other modules
export { STORES };
