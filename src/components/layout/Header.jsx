import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useTheme } from '../../context/ThemeContext';
import { Search, ShoppingBag, User, Menu, X, Sun, Moon } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-3xl">📚</span>
            <span className="text-xl font-bold text-gray-800 dark:text-white hidden sm:inline">
              {settings?.businessName || 'DocuSoft'}
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearch}
              placeholder="Search documents or software..."
              className="input pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/documents" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 transition">Documents</Link>
            <Link to="/software" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 transition">Software</Link>
            <Link to="/help" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 transition">Help</Link>
            
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary-600">
                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline">{user.name?.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">My Profile</Link>
                  <Link to="/profile?tab=purchases" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">My Purchases</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary-600">Login</Link>
                <Link to="/register" className="btn-primary py-2 px-4">Sign Up</Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Search - Below header on mobile */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearch}
              placeholder="Search..."
              className="input pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-50 p-6 animate-slide-in-right">
            <div className="flex justify-end">
              <button onClick={() => setMobileMenuOpen(false)} className="p-2"><X size={24} /></button>
            </div>
            <nav className="flex flex-col gap-4 mt-6">
              <Link to="/documents" className="text-gray-700 dark:text-gray-200 py-2">Documents</Link>
              <Link to="/software" className="text-gray-700 dark:text-gray-200 py-2">Software</Link>
              <Link to="/help" className="text-gray-700 dark:text-gray-200 py-2">Help</Link>
              <hr className="my-2" />
              <button onClick={toggleTheme} className="flex items-center gap-2 text-gray-700 dark:text-gray-200 py-2">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} Toggle Theme
              </button>
              {user ? (
                <>
                  <Link to="/profile" className="text-gray-700 dark:text-gray-200 py-2">Profile</Link>
                  <button onClick={handleLogout} className="text-red-600 py-2 text-left">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 dark:text-gray-200 py-2">Login</Link>
                  <Link to="/register" className="btn-primary text-center py-2">Sign Up</Link>
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;