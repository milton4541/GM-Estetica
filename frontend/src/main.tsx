import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/usuarios/AuthContext';
import AppRouter from './router';
import './index.css'; 
import Notification from './components/notification';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
      <Notification/>
        <AppRouter />   {/* <- NO montar otro Router adentro */}
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
