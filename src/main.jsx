import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import UserPage from './components/UserPage'
import ErrorBoundary from './components/ErrorBoundary'
import { supabase } from './lib/supabase'
import './styles.css'

const path = window.location.pathname
const userMatch = path.match(/^\/user\/(.+)$/)

function Root() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  if (session === undefined) return null

  if (userMatch && !session) {
    return <UserPage username={decodeURIComponent(userMatch[1])} />
  }

  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  </React.StrictMode>
)
