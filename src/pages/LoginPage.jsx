import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import api from '@services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

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
        {/* Header with gradient */}
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back! 👋</h2>
          <p style={styles.subtitle}>Sign in to continue to your account</p>
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
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter your email"
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
              placeholder="Enter your password"
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
            {loading ? (
              <span style={styles.loadingSpinner}>⏳ Signing in...</span>
            ) : (
              '🔓 Sign In'
            )}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine}></span>
          <span style={styles.dividerText}>OR</span>
          <span style={styles.dividerLine}></span>
        </div>

        <div style={styles.registerSection}>
          <p style={styles.registerText}>Don't have an account?</p>
          <Link to="/register" style={styles.registerLink}>
            Create Account <span style={styles.arrow}>→</span>
          </Link>
        </div>
      </div>

      {/* Decorative elements */}
      <div style={styles.decorCircle1}></div>
      <div style={styles.decorCircle2}></div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 200px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    zIndex: 10,
    animation: 'slideUp 0.5s ease-out',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#718096',
  },
  errorAlert: {
    backgroundColor: '#FED7D7',
    border: '1px solid #FEB2B2',
    borderRadius: '10px',
    padding: '12px 16px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#C53030',
    fontSize: '14px',
  },
  errorIcon: {
    fontSize: '18px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4A5568',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  labelIcon: {
    fontSize: '16px',
  },
  input: {
    padding: '14px 16px',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '16px',
    transition: 'all 0.3s',
    outline: 'none',
    backgroundColor: '#F7FAFC',
    ':focus': {
      borderColor: '#667EEA',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    },
  },
  loginBtn: {
    padding: '16px',
    backgroundColor: '#667EEA',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    ':hover': {
      backgroundColor: '#5A67D8',
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 20px -5px rgba(102, 126, 234, 0.4)',
    },
  },
  loadingSpinner: {
    display: 'inline-block',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '30px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #E2E8F0, transparent)',
  },
  dividerText: {
    color: '#A0AEC0',
    fontSize: '14px',
    fontWeight: '500',
  },
  registerSection: {
    textAlign: 'center',
  },
  registerText: {
    color: '#718096',
    marginBottom: '10px',
  },
  registerLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#667EEA',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600',
    padding: '10px 20px',
    borderRadius: '30px',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#EBF4FF',
      transform: 'translateX(5px)',
    },
  },
  arrow: {
    fontSize: '18px',
  },
  decorCircle1: {
    position: 'absolute',
    top: '-50px',
    right: '-50px',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FC8181 0%, #FEB2B2 100%)',
    opacity: 0.3,
    zIndex: 1,
  },
  decorCircle2: {
    position: 'absolute',
    bottom: '-80px',
    left: '-80px',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #9F7AEA 0%, #B794F4 100%)',
    opacity: 0.2,
    zIndex: 1,
  },
};

// Add global animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;
document.head.appendChild(styleSheet);

export default LoginPage;