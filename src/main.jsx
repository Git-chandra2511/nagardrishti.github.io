import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import './index.css'
import { LanguageProvider } from './i18n'

// Nagar Drishti uses the complete light theme by default.
if (typeof document !== 'undefined') {
  document.body.classList.add('light-theme')
  document.documentElement.setAttribute('data-theme', 'light')
}
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
