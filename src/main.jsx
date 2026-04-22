import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="19017215022-ahedt7uifarl4rs4lo9g2m0lgr28ipj5.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);