import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import './index.css'
import { BrowserRouter } from "react-router-dom"
import ShopContextProvider from "./context/ShopContext.jsx"
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Environment } from "./environments/environment.js"
import './i18n';
const clientId = Environment.GG_CLIENT_ID
ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={clientId}>
    <BrowserRouter>
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
  
)
console.log('Google Client ID:', clientId);

