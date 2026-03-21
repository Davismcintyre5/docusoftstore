import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';

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

function App() {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <div className="app">
            <Header />
            <div className="main-container">
              <Sidebar />
              <main className="content-area">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/software" element={<SoftwarePage />} />
                  <Route path="/category/:id" element={<CategoryPage />} />
                  <Route path="/document/:id" element={<ItemDetailPage type="document" />} />
                  <Route path="/software/:id" element={<ItemDetailPage type="software" />} />
                  <Route path="/checkout/:id" element={<CheckoutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/search" element={<SearchPage />} />
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;