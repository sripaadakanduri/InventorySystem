import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
        <GoogleOAuthProvider clientId="191516415302-10jq0v0qseiurn4ilpblp7nou04t0ga6.apps.googleusercontent.com">
            <App />
        </GoogleOAuthProvider>
)

