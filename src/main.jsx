import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import UserPage from './components/UserPage'
import ErrorBoundary from './components/ErrorBoundary'
import './styles.css'

const path = window.location.pathname
const userMatch = path.match(/^\/user\/(.+)$/)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      {userMatch
        ? <UserPage username={decodeURIComponent(userMatch[1])} />
        : <App />
      }
    </ErrorBoundary>
  </React.StrictMode>
)
