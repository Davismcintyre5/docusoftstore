import React, { useState, useEffect } from 'react';
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
    confirmPassword: '',
    acceptedTerms: false,
    acceptedPrivacy: false
  });
  const [settings, setSettings] = useState(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data);
      } catch (error) {
        console.error('Failed to fetch settings', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const validateForm = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!validateEmail(form.email)) return 'Valid email is required';
    if (!validatePhone(form.phone)) return 'Valid Kenyan phone number required (e.g., 0712345678)';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    
    if (settings?.requireTermsAcceptance !== false) {
      if (!form.acceptedTerms) return 'You must accept the Terms & Conditions';
      if (!form.acceptedPrivacy) return 'You must accept the Privacy Policy';
    }
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
        password: form.password,
        acceptedTerms: form.acceptedTerms,
        acceptedPrivacy: form.acceptedPrivacy
      });
      login(data.token, data.user);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const businessName = settings?.businessName || 'DocuSoft Store';

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
          <h2 style={styles.title}>Create Account 🚀</h2>
          <p style={styles.subtitle}>Join our community</p>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <span style={styles.errorIcon}>❌</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} style={styles.input} placeholder="John Doe" required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} style={styles.input} placeholder="john@example.com" required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} style={styles.input} placeholder="0712345678" required />
            <small style={styles.hint}>Format: 0712345678 or +254712345678</small>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} style={styles.input} placeholder="••••••••" required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} style={styles.input} placeholder="••••••••" required />
          </div>

          {(settings?.requireTermsAcceptance !== false) && (
            <div style={styles.termsContainer}>
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="acceptedTerms"
                  checked={form.acceptedTerms}
                  onChange={handleChange}
                  id="acceptedTerms"
                />
                <label htmlFor="acceptedTerms">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    style={styles.linkButton}
                  >
                    Terms & Conditions
                  </button>
                </label>
              </div>

              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="acceptedPrivacy"
                  checked={form.acceptedPrivacy}
                  onChange={handleChange}
                  id="acceptedPrivacy"
                />
                <label htmlFor="acceptedPrivacy">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    style={styles.linkButton}
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>
            </div>
          )}

          <button type="submit" style={{ ...styles.registerBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine}></span>
          <span style={styles.dividerText}>or</span>
          <span style={styles.dividerLine}></span>
        </div>

        <div style={styles.loginSection}>
          <p style={styles.loginText}>Already have an account?</p>
          <Link to="/login" style={styles.loginLink}>Sign In →</Link>
        </div>
      </div>

      {/* Terms Modal */}
      {showTermsModal && settings?.termsAndConditions?.content && (
        <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '80vh' }}>
            <div className="modal-header">
              <h3>Terms & Conditions</h3>
              <button className="modal-close" onClick={() => setShowTermsModal(false)}>×</button>
            </div>
            <div className="modal-body" style={{ overflowY: 'auto' }}>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {settings.termsAndConditions.content}
              </div>
              {settings.termsAndConditions.lastUpdated && (
                <p style={{ marginTop: '20px', fontSize: '12px', color: '#718096' }}>
                  Last updated: {new Date(settings.termsAndConditions.lastUpdated).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && settings?.privacyPolicy?.content && (
        <div className="modal-overlay" onClick={() => setShowPrivacyModal(false)}>
          <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '80vh' }}>
            <div className="modal-header">
              <h3>Privacy Policy</h3>
              <button className="modal-close" onClick={() => setShowPrivacyModal(false)}>×</button>
            </div>
            <div className="modal-body" style={{ overflowY: 'auto' }}>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {settings.privacyPolicy.content}
              </div>
              {settings.privacyPolicy.lastUpdated && (
                <p style={{ marginTop: '20px', fontSize: '12px', color: '#718096' }}>
                  Last updated: {new Date(settings.privacyPolicy.lastUpdated).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
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
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '28px',
    padding: '32px 40px',
    width: '100%',
    maxWidth: '640px',
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
    color: '#48bb78',
    textDecoration: 'none',
    fontWeight: '500',
    ':hover': {
      textDecoration: 'underline',
      color: '#38a169',
    },
  },
  welcome: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
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
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#4a5568',
  },
  input: {
    padding: '10px 14px',
    border: '2px solid #e2e8f0',
    borderRadius: '14px',
    fontSize: '14px',
    transition: 'all 0.3s',
    outline: 'none',
    backgroundColor: '#fafbfc',
    ':focus': {
      borderColor: '#48bb78',
      boxShadow: '0 0 0 3px rgba(72,187,120,0.1)',
    },
  },
  hint: {
    fontSize: '11px',
    color: '#a0aec0',
    marginTop: '2px',
  },
  termsContainer: {
    marginTop: '4px',
    marginBottom: '6px',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '6px',
    fontSize: '13px',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#48bb78',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '13px',
    padding: 0,
  },
  registerBtn: {
    padding: '12px',
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '8px',
    ':hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(72,187,120,0.3)',
    },
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '22px 0 18px',
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
  loginSection: {
    textAlign: 'center',
  },
  loginText: {
    color: '#718096',
    fontSize: '13px',
    marginBottom: '6px',
  },
  loginLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: '#48bb78',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    padding: '6px 12px',
    borderRadius: '30px',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#f0fdf4',
      gap: '8px',
    },
  },
};

export default RegisterPage;