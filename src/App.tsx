import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';

import Login from './pages/Login';
import DashboardLayout from './pages/DashboardLayout';
import SeriesList from './pages/SeriesList';
import SpotlightManagement from './pages/SpotlightManagement';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<SeriesList />} />
              <Route path="spotlight" element={<SpotlightManagement />} />
              {/* Settings placeholder */}
              <Route path="settings" element={<div className="text-zinc-500">Settings coming soon</div>} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
