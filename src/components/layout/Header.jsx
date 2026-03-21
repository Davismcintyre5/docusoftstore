import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search?q=${e.target.value}`);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          {settings?.businessName || 'DocuSoft'}
        </Link>
        
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search documents or software..." 
            onKeyPress={handleSearch}
          />
          <button>🔍</button>
        </div>

        <nav className="nav-links">
          <Link to="/documents" className="nav-link">Documents</Link>
          <Link to="/software" className="nav-link">Software</Link>
          <Link to="/help" className="nav-link">Help</Link>
          
          {user ? (
            <>
              <Link to="/profile" className="nav-link">Profile</Link>
              <button onClick={handleLogout} className="nav-link btn-login">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link btn-login">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;