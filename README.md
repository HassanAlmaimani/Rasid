# Rāsid (راصِد) - Personal Finance Management App

A modern, bilingual personal finance management application built with React and Vite. Track your income, expenses, budgets, and financial goals with ease.

## Features

### 💰 Financial Tracking
- **Transaction Management**: Add, view, and delete income and expense transactions
- **Budget Management**: Set and monitor budgets for different categories
- **Monthly Reports**: View yearly overview with monthly breakdowns
- **Cost Breakdown**: Visual pie chart showing expense distribution by category
- **Real-time Balance**: Track your total balance, income, and expenses

### 🎨 User Experience
- **Bilingual Support**: Full support for English and Arabic (RTL)
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, minimalistic interface with smooth animations

### 💾 Data Management
- **Persistent Storage**: All data stored locally using IndexedDB
- **Data Export**: Download your data as JSON for backup
- **Data Import**: Restore data from backup files
- **Database Statistics**: View comprehensive statistics about your financial data
- **Privacy First**: All data stays on your device - no server communication

### 🔍 Advanced Features
- **Transaction Filtering**: Filter by type (income/expense) and category
- **Sorting Options**: Sort by amount, date (newest/oldest)
- **Search & Filter**: Quickly find specific transactions
- **Budget Tracking**: Visual indicators for budget usage and overspending

## Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **IndexedDB** - Local database for persistent storage
- **Lucide React** - Icon library
- **CSS3** - Styling with CSS variables for theming

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd white-rosette
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Database

This app uses **IndexedDB** for persistent local storage. See [DATABASE.md](./DATABASE.md) for detailed information about:
- Database structure and schema
- Data migration from localStorage
- Export/Import functionality
- Usage examples and API reference

## Project Structure

```
white-rosette/
├── src/
│   ├── components/        # React components
│   │   ├── Dashboard.jsx
│   │   ├── TransactionForm.jsx
│   │   ├── BudgetManager.jsx
│   │   ├── MonthlySummary.jsx
│   │   ├── Settings.jsx
│   │   └── ...
│   ├── contexts/          # React contexts
│   │   ├── FinanceContext.jsx
│   │   ├── LanguageContext.jsx
│   │   └── ThemeContext.jsx
│   ├── utils/             # Utility functions
│   │   ├── database.js    # IndexedDB operations
│   │   ├── dataExport.js  # Export/Import utilities
│   │   └── translations.js
│   ├── App.jsx            # Main app component
│   └── main.jsx           # App entry point
├── DATABASE.md            # Database documentation
└── README.md              # This file
```

## Features in Detail

### Settings Page
Access the Settings page to:
- View database statistics (transaction count, totals, date ranges)
- Export your data as JSON for backup
- Import previously exported data
- Clear all data (with confirmation)
- View app information

### Bilingual Support
- Switch between English and Arabic seamlessly
- Full RTL (Right-to-Left) support for Arabic
- All UI elements and text are translated
- Language preference is saved locally

### Theme Support
- Light and Dark modes
- Smooth transitions between themes
- Theme preference is saved locally
- Consistent color scheme across all components

## Browser Compatibility

- Chrome 24+
- Firefox 16+
- Safari 10+
- Edge 12+
- Opera 15+

## Data Privacy

- **100% Local**: All data is stored locally in your browser using IndexedDB
- **No Tracking**: No analytics, no tracking, no external requests
- **User Control**: Export, import, or delete your data at any time
- **Secure**: Data is isolated per domain and cannot be accessed by other websites

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-22
