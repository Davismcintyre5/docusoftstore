import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatDate } from '../utils/formatters';

const TermsPage = () => {
  const { type } = useParams(); // 'terms' or 'privacy'
  const [content, setContent] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, [type]);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      if (type === 'terms') {
        setContent(data.termsAndConditions?.content || 'Default Terms and Conditions. Please update in admin settings.');
        setLastUpdated(data.termsAndConditions?.lastUpdated);
      } else {
        setContent(data.privacyPolicy?.content || 'Default Privacy Policy. Please update in admin settings.');
        setLastUpdated(data.privacyPolicy?.lastUpdated);
      }
    } catch (error) {
      console.error('Failed to fetch legal content:', error);
      setContent('Content not available. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{type === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}</h1>
      {lastUpdated && <p className="text-sm text-gray-500 mb-6">Last updated: {formatDate(lastUpdated)}</p>}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 prose dark:prose-invert max-w-none">
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  );
};

export default TermsPage;