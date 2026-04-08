import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [businessName, setBusinessName] = useState('DocuSoft');
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

    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data.user);
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      toast.success('Welcome back!');
      
      const pending = sessionStorage.getItem('pendingPurchase');
      if (pending) {
        sessionStorage.removeItem('pendingPurchase');
        const { itemId } = JSON.parse(pending);
        navigate(`/checkout/${itemId}`);
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 p-4">
      <div className="flex flex-col md:flex-row max-w-5xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Brand Section */}
        <div className="md:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl">📚</span>
              <span className="text-xl font-bold">{businessName}</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-white/80 mb-8">Sign in to access your account and continue shopping.</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <h4 className="font-semibold">Premium Documents</h4>
                <p className="text-sm text-white/70">Professional templates & contracts</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">💻</span>
              <div>
                <h4 className="font-semibold">Powerful Software</h4>
                <p className="text-sm text-white/70">Tools to boost productivity</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h4 className="font-semibold">Secure Payments</h4>
                <p className="text-sm text-white/70">M-Pesa integration with full security</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Login Form */}
        <div className="md:w-1/2 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign In</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Enter your credentials to continue</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="••••••••"
                  required
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
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">Forgot Password?</Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">Create Account</Link>
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400">← Back to Store</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;