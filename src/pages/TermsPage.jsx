import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TermsPage = ({ type }) => {
  const [content, setContent] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await api.get('/settings');
        if (type === 'terms') {
          setContent(data.termsAndConditions?.content);
          setLastUpdated(data.termsAndConditions?.lastUpdated);
        } else {
          setContent(data.privacyPolicy?.content);
          setLastUpdated(data.privacyPolicy?.lastUpdated);
        }
      } catch (error) {
        console.error('Failed to fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [type]);

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '16px' }}>
          {type === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
        </h1>
        {lastUpdated && (
          <p style={{ color: '#718096', marginBottom: '24px', fontSize: '14px' }}>
            Last updated: {new Date(lastUpdated).toLocaleDateString()}
          </p>
        )}
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
          {content || 'Content not available'}
        </div>
      </div>
    </div>
  );
};

export default TermsPage;