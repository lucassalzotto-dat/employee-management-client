// src/index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa `createRoot` desde `react-dom/client`
import App from './App';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root')); 

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
