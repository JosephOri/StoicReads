import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_Google_OAuth_Client_ID ?? ''}>
      <React.StrictMode>
    <App />
  </React.StrictMode>,
  </GoogleOAuthProvider>
)
