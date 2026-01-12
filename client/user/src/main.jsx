// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/auth.context';
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast'
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" richColors />
    </AuthProvider>
);