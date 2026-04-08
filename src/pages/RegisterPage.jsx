import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
    acceptedPrivacy: false
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [businessName, setBusinessName] = useState('DocuSoft');
  const [settings, setSettings] = useState(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data);
        if (data.businessName) setBusinessName(data.businessName);
      } catch (error) {
        console.error('Failed to fetch settings', error);
      }
    };
    fetchSettings();
  }, []);

  const validatePhone = (phone) => {
    const regex = /^(?:\+254|0)[17]\d{8}$/;
    return regex.test(phone);
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };

  const getPasswordStrengthInfo = (strength) => {
    switch(strength) {
      case 0: return { text: 'Very Weak', color: '#dc3545', width: '25%' };
      case 1: return { text: 'Weak', color: '#ff6b35', width: '50%' };
      case 2: return { text: 'Fair', color: '#ffc107', width: '75%' };
      case 3: return { text: 'Good', color: '#28a745', width: '90%' };
      case 4: return { text: 'Strong', color: '#28a745', width: '100%' };
      default: return { text: 'Very Weak', color: '#dc3545', width: '25%' };
    }
  };

  const passwordStrength = calculatePasswordStrength(formData.password);
  const strengthInfo = getPasswordStrengthInfo(passwordStrength);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(formData.phone)) newErrors.phone = 'Valid Kenyan phone number required (e.g., 0712345678)';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    else if (passwordStrength < 2) newErrors.password = 'Password is too weak';
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (settings?.requireTermsAcceptance !== false) {
      if (!formData.acceptedTerms) newErrors.acceptedTerms = 'You must accept the Terms & Conditions';
      if (!formData.acceptedPrivacy) newErrors.acceptedPrivacy = 'You must accept the Privacy Policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const { data } = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        acceptedTerms: formData.acceptedTerms,
        acceptedPrivacy: formData.acceptedPrivacy
      });
      
      login(data.token, data.user);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-teal-700 p-4">
      <div className="flex flex-col md:flex-row max-w-6xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Brand Section */}
        <div className="md:w-2/5 bg-gradient-to-br from-green-600 to-teal-700 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl">📚</span>
              <span className="text-xl font-bold">{businessName}</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">Join Us!</h1>
            <p className="text-white/80 mb-8">Create an account to access premium documents and software.</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h4 className="font-semibold">Instant Access</h4>
                <p className="text-sm text-white/70">Download immediately after purchase</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔄</span>
              <div>
                <h4 className="font-semibold">Lifetime Access</h4>
                <p className="text-sm text-white/70">Download your items anytime</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">💬</span>
              <div>
                <h4 className="font-semibold">24/7 Support</h4>
                <p className="text-sm text-white/70">We're here to help you</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Registration Form */}
        <div className="md:w-3/5 p-8 overflow-y-auto max-h-[90vh]">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Get started with your free account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📱</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder="0712345678"
                  disabled={loading}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              <p className="text-gray-400 text-xs mt-1">Format: 0712345678 or +254712345678</p>
            </div>
            
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder="Create a strong password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              
              {formData.password && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: strengthInfo.width, backgroundColor: strengthInfo.color }}></div>
                  </div>
                  <p className="text-xs mt-1" style={{ color: strengthInfo.color }}>{strengthInfo.text} Password</p>
                  <ul className="text-xs text-gray-500 mt-2 space-y-1">
                    <li className={formData.password.length >= 6 ? 'text-green-600' : ''}>✓ At least 6 characters</li>
                    <li className={/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? 'text-green-600' : ''}>✓ Uppercase & lowercase letters</li>
                    <li className={/\d/.test(formData.password) ? 'text-green-600' : ''}>✓ At least one number</li>
                  </ul>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            
            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔐</span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            
            {/* Terms & Conditions Checkboxes */}
            {(settings?.requireTermsAcceptance !== false) && (
              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    name="acceptedTerms"
                    checked={formData.acceptedTerms}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span>
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="text-green-600 hover:text-green-700 underline"
                    >
                      Terms & Conditions
                    </button>
                  </span>
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    name="acceptedPrivacy"
                    checked={formData.acceptedPrivacy}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span>
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setShowPrivacyModal(true)}
                      className="text-green-600 hover:text-green-700 underline"
                    >
                      Privacy Policy
                    </button>
                  </span>
                </label>
                {errors.acceptedTerms && <p className="text-red-500 text-xs">{errors.acceptedTerms}</p>}
                {errors.acceptedPrivacy && <p className="text-red-500 text-xs">{errors.acceptedPrivacy}</p>}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">Sign In</Link>
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400">← Back to Store</Link>
          </div>
        </div>
      </div>
      
      {/* Terms Modal */}
      {showTermsModal && settings?.termsAndConditions?.content && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowTermsModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Terms & Conditions</h3>
              <button onClick={() => setShowTermsModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-400 leading-relaxed">
                {settings.termsAndConditions.content}
              </div>
              {settings.termsAndConditions.lastUpdated && (
                <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  Last updated: {new Date(settings.termsAndConditions.lastUpdated).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button onClick={() => setShowTermsModal(false)} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Privacy Modal */}
      {showPrivacyModal && settings?.privacyPolicy?.content && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowPrivacyModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy Policy</h3>
              <button onClick={() => setShowPrivacyModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-400 leading-relaxed">
                {settings.privacyPolicy.content}
              </div>
              {settings.privacyPolicy.lastUpdated && (
                <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  Last updated: {new Date(settings.privacyPolicy.lastUpdated).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button onClick={() => setShowPrivacyModal(false)} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;