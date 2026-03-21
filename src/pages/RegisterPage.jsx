import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import api from '@services/api';
import { validatePhone, validateEmail } from '@utils/validators';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!validateEmail(form.email)) return 'Valid email is required';
    if (!validatePhone(form.phone)) return 'Valid Kenyan phone number required (e.g., 0712345678)';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password
      });
      login(data.token, data.user);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create Account 🚀</h2>
          <p style={styles.subtitle}>Join our community today</p>
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
              <span style={styles.labelIcon}>👤</span>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="John Doe"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>📧</span>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="john@example.com"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>📱</span>
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              style={styles.input}
              placeholder="0712345678"
              required
            />
            <small style={styles.hint}>Format: 0712345678 or +254712345678</small>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>🔒</span>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>✓</span>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <div style={styles.terms}>
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <a href="/terms" style={styles.termsLink}>Terms of Service</a> and <a href="/privacy" style={styles.termsLink}>Privacy Policy</a>
            </label>
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.registerBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? (
              <span style={styles.loadingSpinner}>⏳ Creating Account...</span>
            ) : (
              '✨ Create Account'
            )}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine}></span>
          <span style={styles.dividerText}>OR</span>
          <span style={styles.dividerLine}></span>
        </div>

        <div style={styles.loginSection}>
          <p style={styles.loginText}>Already have an account?</p>
          <Link to="/login" style={styles.loginLink}>
            Sign In <span style={styles.arrow}>→</span>
          </Link>
        </div>
      </div>

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
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '500px',
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
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
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
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
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
    padding: '12px 16px',
    border: '2px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '15px',
    transition: 'all 0.3s',
    outline: 'none',
    backgroundColor: '#F7FAFC',
    ':focus': {
      borderColor: '#48BB78',
      boxShadow: '0 0 0 3px rgba(72, 187, 120, 0.1)',
    },
  },
  hint: {
    fontSize: '11px',
    color: '#A0AEC0',
    marginTop: '4px',
  },
  terms: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '10px',
    fontSize: '14px',
    color: '#718096',
  },
  termsLink: {
    color: '#48BB78',
    textDecoration: 'none',
    fontWeight: '500',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  registerBtn: {
    padding: '16px',
    background: 'linear-gradient(135deg, #48BB78 0%, #38A169 100%)',
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
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 20px -5px rgba(72, 187, 120, 0.4)',
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
  loginSection: {
    textAlign: 'center',
  },
  loginText: {
    color: '#718096',
    marginBottom: '10px',
  },
  loginLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#48BB78',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600',
    padding: '10px 20px',
    borderRadius: '30px',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#F0FFF4',
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
    background: 'linear-gradient(135deg, #9AE6B4 0%, #C6F6D5 100%)',
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
    background: 'linear-gradient(135deg, #68D391 0%, #9AE6B4 100%)',
    opacity: 0.2,
    zIndex: 1,
  },
};

export default RegisterPage;