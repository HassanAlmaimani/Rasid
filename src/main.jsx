import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FinanceProvider } from './contexts/FinanceContext'
import { LanguageProvider } from './contexts/LanguageContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <FinanceProvider>
        <App />
      </FinanceProvider>
    </LanguageProvider>
  </StrictMode>,
)
