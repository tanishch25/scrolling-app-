import React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';

import Login from './pages/Login';
import DashboardLayout from './pages/DashboardLayout';
import SeriesList from './pages/SeriesList';
import EpisodeManagement from './pages/EpisodeManagement';
import SpotlightManagement from './pages/SpotlightManagement';
import HomeLayoutPage from './pages/HomeLayout';
import UserManagement from './pages/UserManagement';
import SettingsPage from './pages/Settings';

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
              <Route path="episodes" element={<EpisodeManagement />} />
              <Route path="spotlight" element={<SpotlightManagement />} />
              <Route path="layout" element={<HomeLayoutPage />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
