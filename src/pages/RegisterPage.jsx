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
            <label style={styles.label}>👤 Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} style={styles.input} placeholder="John Doe" required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>📧 Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} style={styles.input} placeholder="john@example.com" required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>📱 Phone Number</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} style={styles.input} placeholder="0712345678" required />
            <small style={styles.hint}>Format: 0712345678 or +254712345678</small>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>🔒 Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} style={styles.input} placeholder="••••••••" required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>✓ Confirm Password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} style={styles.input} placeholder="••••••••" required />
          </div>

          {/* Terms & Privacy Checkboxes */}
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
                  I have read and agree to the{' '}
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
                  I have read and agree to the{' '}
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

          <button type="submit" style={{ ...styles.registerBtn, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }} disabled={loading}>
            {loading ? '⏳ Creating Account...' : '✨ Create Account'}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine}></span>
          <span style={styles.dividerText}>OR</span>
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '80vh' }}>
            <div className="modal-header">
              <h3>Terms & Conditions</h3>
              <button className="modal-close" onClick={() => setShowTermsModal(false)}>×</button>
            </div>
            <div className="modal-body" style={{ overflowY: 'auto', maxHeight: 'calc(80vh - 80px)' }}>
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '80vh' }}>
            <div className="modal-header">
              <h3>Privacy Policy</h3>
              <button className="modal-close" onClick={() => setShowPrivacyModal(false)}>×</button>
            </div>
            <div className="modal-body" style={{ overflowY: 'auto', maxHeight: 'calc(80vh - 80px)' }}>
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
  },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { fontSize: '32px', fontWeight: '700', background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' },
  subtitle: { fontSize: '16px', color: '#718096' },
  errorAlert: { backgroundColor: '#FED7D7', border: '1px solid #FEB2B2', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#C53030', fontSize: '14px' },
  errorIcon: { fontSize: '18px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#4A5568', display: 'flex', alignItems: 'center', gap: '8px' },
  input: { padding: '12px 16px', border: '2px solid #E2E8F0', borderRadius: '10px', fontSize: '15px', transition: 'all 0.3s', outline: 'none', backgroundColor: '#F7FAFC' },
  hint: { fontSize: '11px', color: '#A0AEC0', marginTop: '4px' },
  termsContainer: { marginTop: '10px', marginBottom: '10px' },
  checkboxGroup: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', fontSize: '13px' },
  linkButton: { background: 'none', border: 'none', color: '#48bb78', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px', padding: 0 },
  registerBtn: { padding: '16px', background: 'linear-gradient(135deg, #48BB78 0%, #38A169 100%)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s', marginTop: '10px' },
  divider: { display: 'flex', alignItems: 'center', gap: '10px', margin: '30px 0' },
  dividerLine: { flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #E2E8F0, transparent)' },
  dividerText: { color: '#A0AEC0', fontSize: '14px', fontWeight: '500' },
  loginSection: { textAlign: 'center' },
  loginText: { color: '#718096', marginBottom: '10px' },
  loginLink: { display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#48BB78', textDecoration: 'none', fontSize: '16px', fontWeight: '600', padding: '10px 20px', borderRadius: '30px', transition: 'all 0.3s' }
};

export default RegisterPage;