# Database Implementation for Rāsid Finance App

## Overview

This document describes the database implementation for the Rāsid personal finance application. The app now uses **IndexedDB** for persistent data storage, replacing the previous localStorage implementation.

## Why IndexedDB?

IndexedDB was chosen over localStorage for several important reasons:

1. **Larger Storage Capacity**: IndexedDB can store much more data than localStorage (typically 50MB+ vs 5-10MB)
2. **Better Performance**: Asynchronous operations don't block the UI
3. **Structured Data**: Supports complex queries and indexes
4. **Transactional**: Ensures data integrity with ACID properties
5. **Persistent**: Data survives browser restarts and is not easily cleared

## Database Structure

### Database Name
`RasidFinanceDB` (Version 1)

### Object Stores

#### 1. **transactions**
- **Key Path**: `id`
- **Indexes**:
  - `date`: For querying transactions by date
  - `type`: For filtering by income/expense
  - `category`: For category-based queries
- **Data Structure**:
  ```javascript
  {
    id: "unique-id",
    date: "ISO-8601-date-string",
    type: "income" | "expense",
    amount: number,
    category: "string",
    note: "string"
  }
  ```

#### 2. **budgets**
- **Key Path**: `id`
- **Indexes**:
  - `category`: For category-based queries
- **Data Structure**:
  ```javascript
  {
    id: "unique-id",
    category: "string",
    limit: number
  }
  ```

#### 3. **settings**
- **Key Path**: `key`
- **Data Structure**:
  ```javascript
  {
    key: "setting-name",
    value: any
  }
  ```
- **Stored Settings**:
  - `theme`: User's theme preference (light/dark)
  - `language`: User's language preference (en/ar)

## Implementation Files

### Core Database Module
**File**: `src/utils/database.js`

Provides low-level database operations:
- `initDB()`: Initialize the database
- `addData(storeName, data)`: Add new data
- `updateData(storeName, data)`: Update existing data
- `deleteData(storeName, id)`: Delete data by ID
- `getAllData(storeName)`: Retrieve all data from a store
- `getDataById(storeName, id)`: Get a single item
- `clearStore(storeName)`: Clear all data from a store
- `getDataByIndex(storeName, indexName, value)`: Query by index

### Data Export/Import Module
**File**: `src/utils/dataExport.js`

Provides backup and restore functionality:
- `exportData()`: Export all data as JSON object
- `downloadDataAsJSON()`: Download data as a JSON file
- `importData(data, clearExisting)`: Import data from JSON
- `importDataFromFile(file, clearExisting)`: Import from file
- `getDatabaseStats()`: Get database statistics

### Context Updates

#### FinanceContext
**File**: `src/contexts/FinanceContext.jsx`

- Migrated from localStorage to IndexedDB
- Automatic migration of existing localStorage data on first load
- All CRUD operations now use async/await with IndexedDB
- Added `isLoading` state for data initialization

#### ThemeContext
**File**: `src/contexts/ThemeContext.jsx`

- Now stores theme preference in IndexedDB settings store
- Automatic migration from localStorage
- Persists theme across sessions

#### LanguageContext
**File**: `src/contexts/LanguageContext.jsx`

- Now stores language preference in IndexedDB settings store
- Automatic migration from localStorage
- Persists language preference across sessions

### Settings Component
**File**: `src/components/Settings.jsx`

New settings page providing:
- **Database Statistics**: View transaction count, budget count, totals, and date ranges
- **Export Data**: Download all data as JSON for backup
- **Import Data**: Restore data from a backup file
- **Clear Data**: Delete all transactions and budgets (with confirmation)
- **About Section**: App information and storage details

## Data Migration

The app automatically migrates data from localStorage to IndexedDB on first load:

1. On initialization, the app checks if IndexedDB stores are empty
2. If empty, it looks for data in localStorage
3. If localStorage data exists, it's migrated to IndexedDB
4. After successful migration, localStorage data is cleared
5. All subsequent operations use IndexedDB

This ensures a seamless transition for existing users.

## Usage Examples

### Adding a Transaction
```javascript
import { useFinance } from './contexts/FinanceContext';

const { addTransaction } = useFinance();

await addTransaction({
  type: 'expense',
  amount: 50.00,
  category: 'Groceries',
  note: 'Weekly shopping'
});
```

### Exporting Data
```javascript
import { downloadDataAsJSON } from './utils/dataExport';

await downloadDataAsJSON();
// Downloads: rasid-backup-YYYY-MM-DD.json
```

### Importing Data
```javascript
import { importDataFromFile } from './utils/dataExport';

const fileInput = document.getElementById('file-input');
const file = fileInput.files[0];

await importDataFromFile(file, false); // false = don't clear existing data
```

### Getting Database Statistics
```javascript
import { getDatabaseStats } from './utils/dataExport';

const stats = await getDatabaseStats();
console.log(stats);
// {
//   transactionCount: 150,
//   budgetCount: 5,
//   totalIncome: 5000,
//   totalExpenses: 3200,
//   balance: 1800,
//   oldestTransaction: Date,
//   newestTransaction: Date
// }
```

## Browser Compatibility

IndexedDB is supported in all modern browsers:
- Chrome 24+
- Firefox 16+
- Safari 10+
- Edge 12+
- Opera 15+

## Data Privacy & Security

- **Local Storage Only**: All data is stored locally in the user's browser
- **No Server Communication**: Data never leaves the user's device
- **User Control**: Users can export, import, and delete their data at any time
- **Browser Isolation**: Data is isolated per domain and cannot be accessed by other websites

## Backup Recommendations

Users should regularly export their data:
1. Navigate to Settings page
2. Click "Export Data"
3. Save the JSON file in a secure location
4. Store backups in multiple locations (cloud storage, external drive, etc.)

## Future Enhancements

Potential improvements for future versions:
- Automatic periodic backups
- Cloud sync (optional, with encryption)
- Data compression for large datasets
- Advanced query capabilities
- Data visualization of storage usage
- Import/export in multiple formats (CSV, Excel)

## Troubleshooting

### Data Not Persisting
- Check browser's IndexedDB storage quota
- Ensure the browser allows IndexedDB
- Check browser console for errors

### Migration Issues
- Clear browser cache and reload
- Export data before clearing if possible
- Check browser console for migration errors

### Performance Issues
- Consider clearing old transactions
- Export and archive old data
- Check available storage space

## Technical Notes

- Database operations are asynchronous and return Promises
- All contexts handle loading states during initialization
- Error handling is implemented with try-catch blocks
- Console logging helps with debugging (can be removed in production)

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-22  
**Database Version**: 1
