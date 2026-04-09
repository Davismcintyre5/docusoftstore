import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import MobileMenu from './components/layout/MobileMenu';

// Pages
import HomePage from './pages/HomePage';
import DocumentsPage from './pages/DocumentsPage';
import SoftwarePage from './pages/SoftwarePage';
import CategoryPage from './pages/CategoryPage';
import ItemDetailPage from './pages/ItemDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import HelpPage from './pages/HelpPage';
import SearchPage from './pages/SearchPage';
import TermsPage from './pages/TermsPage';

// Components
import LoadingSpinner from './components/ui/LoadingSpinner';

function AppContent() {
  const { loading } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner text="Loading DocuSoft Store..." />
      </div>
    );
  }

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <MobileMenu />
      
      {/* Main content - full width on mobile, with sidebar on desktop */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="flex flex-col lg:flex-row lg:gap-6">
          {/* Sidebar - hidden on mobile (uses MobileMenu component), visible on desktop */}
          <div className="hidden lg:block lg:w-64 lg:shrink-0">
            <Sidebar />
          </div>
          
          {/* Main content - full width on mobile, takes remaining space on desktop */}
          <main className="flex-1 min-w-0">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/software" element={<SoftwarePage />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route path="/document/:id" element={<ItemDetailPage type="document" />} />
              <Route path="/software/:id" element={<ItemDetailPage type="software" />} />
              <Route path="/checkout/:id" element={<CheckoutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/terms" element={<TermsPage type="terms" />} />
              <Route path="/privacy" element={<TermsPage type="privacy" />} />
            </Routes>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <SettingsProvider>
          <ThemeProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: { background: '#363636', color: '#fff' },
                success: { duration: 3000, iconTheme: { primary: '#4ade80', secondary: '#fff' } },
                error: { duration: 4000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
            <AppContent />
          </ThemeProvider>
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;