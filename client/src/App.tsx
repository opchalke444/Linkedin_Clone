import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

import { ThemeProvider } from './contexts/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Layouts & Guards
import { AppLayout } from './layouts/AppLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { ProtectedRoute, PublicOnlyRoute } from './components/common/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FeedPage } from './pages/FeedPage';
import { ProfilePage } from './pages/ProfilePage';
import { NetworkPage } from './pages/NetworkPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SearchPage } from './pages/SearchPage';
import { GroupsPage } from './pages/GroupsPage';
import { GroupDetailPage } from './pages/GroupDetailPage';
import { AboutPage } from './pages/AboutPage';
import { SettingsPage } from './pages/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 2, // 2 minutes
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <SocketProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public landing page */}
                  <Route path="/" element={<LandingPage />} />

                  {/* Public-only authentication routes */}
                  <Route
                    element={
                      <PublicOnlyRoute>
                        <AuthLayout />
                      </PublicOnlyRoute>
                    }
                  >
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/signup" element={<Navigate to="/register" replace />} />
                  </Route>

                  {/* About page (accessible by all) */}
                  <Route
                    path="/about"
                    element={
                      <div className="min-h-screen flex flex-col bg-[#f4f2ee] dark:bg-[#1d2226] text-slate-900 dark:text-[#f3f2ef]">
                        <Navbar />
                        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                          <AboutPage />
                        </main>
                        <Footer />
                      </div>
                    }
                  />

                {/* Protected application routes */}
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/feed" element={<FeedPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/profile/:userId" element={<ProfilePage />} />
                  <Route path="/in/:userId" element={<ProfilePage />} />
                  <Route path="/network" element={<NetworkPage />} />
                  <Route path="/mynetwork" element={<NetworkPage />} />
                  <Route path="/opportunities" element={<OpportunitiesPage />} />
                  <Route path="/jobs" element={<OpportunitiesPage />} />
                  <Route path="/messages" element={<MessagesPage />} />
                  <Route path="/messages/:userId" element={<MessagesPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/groups" element={<GroupsPage />} />
                  <Route path="/groups/:slug" element={<GroupDetailPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </SocketProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
