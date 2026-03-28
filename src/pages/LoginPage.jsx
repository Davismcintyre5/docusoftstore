import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import api from '@services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [businessName, setBusinessName] = useState('DocuSoft Store');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data.businessName) setBusinessName(data.businessName);
      } catch (error) {
        console.error('Failed to fetch business name', error);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data.user);
      
      const pending = sessionStorage.getItem('pendingPurchase');
      if (pending) {
        sessionStorage.removeItem('pendingPurchase');
        const { itemId } = JSON.parse(pending);
        navigate(`/checkout/${itemId}`);
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header with logo and back link */}
        <div style={styles.headerRow}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>📚</span>
            <span style={styles.logoText}>{businessName}</span>
          </div>
          <Link to="/" style={styles.backLink}>← Back to Store</Link>
        </div>

        <div style={styles.welcome}>
          <h2 style={styles.title}>Welcome Back! 👋</h2>
          <p style={styles.subtitle}>Sign in to continue</p>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <span style={styles.errorIcon}>❌</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>📧</span>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="your@email.com"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>🔒</span>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.loginBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine}></span>
          <span style={styles.dividerText}>or</span>
          <span style={styles.dividerLine}></span>
        </div>

        <div style={styles.registerSection}>
          <p style={styles.registerText}>New here?</p>
          <Link to="/register" style={styles.registerLink}>
            Create Account →
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '28px',
    padding: '32px 36px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoIcon: {
    fontSize: '24px',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2d3748',
    letterSpacing: '-0.3px',
  },
  backLink: {
    fontSize: '13px',
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s',
    ':hover': {
      color: '#5a67d8',
      textDecoration: 'underline',
    },
  },
  welcome: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#718096',
  },
  errorAlert: {
    backgroundColor: '#FED7D7',
    border: '1px solid #FEB2B2',
    borderRadius: '12px',
    padding: '10px 12px',
    marginBottom: '22px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#C53030',
    fontSize: '13px',
  },
  errorIcon: { fontSize: '16px' },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#4a5568',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  labelIcon: { fontSize: '14px' },
  input: {
    padding: '12px 14px',
    border: '2px solid #e2e8f0',
    borderRadius: '14px',
    fontSize: '14px',
    transition: 'all 0.3s',
    outline: 'none',
    backgroundColor: '#fafbfc',
    ':focus': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102,126,234,0.1)',
    },
  },
  loginBtn: {
    padding: '12px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '8px',
    ':hover': {
      backgroundColor: '#5a67d8',
      transform: 'translateY(-1px)',
    },
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '24px 0 18px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)',
  },
  dividerText: {
    color: '#a0aec0',
    fontSize: '12px',
    fontWeight: '500',
  },
  registerSection: {
    textAlign: 'center',
  },
  registerText: {
    color: '#718096',
    fontSize: '13px',
    marginBottom: '6px',
  },
  registerLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: '#667eea',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    padding: '6px 12px',
    borderRadius: '30px',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#ebf4ff',
      gap: '8px',
    },
  },
};

export default LoginPage;