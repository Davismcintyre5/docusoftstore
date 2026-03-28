// client/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import DocumentCard from '../components/items/DocumentCard';
import SoftwareCard from '../components/items/SoftwareCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useSettings } from '../context/SettingsContext';

const HomePage = () => {
  const [documents, setDocuments] = useState([]);
  const [software, setSoftware] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, softRes] = await Promise.all([
          api.get('/documents?limit=6'),
          api.get('/software?limit=6')
        ]);
        setDocuments(docsRes.data);
        setSoftware(softRes.data);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner text="Loading DocuSoft Store..." />;

  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <h1>Welcome to {settings?.businessName || 'DocuSoft Store'}</h1>
        <p>Your one‑stop destination for premium documents and software</p>
        <div className="hero-buttons">
          <Link to="/documents" className="hero-btn">Browse Documents</Link>
          <Link to="/software" className="hero-btn hero-btn-outline">Browse Software</Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="section-header">
        <h2 className="section-title">Why Choose Us</h2>
      </div>
      <div className="card-grid" style={{ marginBottom: '40px' }}>
        <div className="card">
          <div className="card-content" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '40px' }}>⚡</span>
            <h3 style={{ marginTop: '12px' }}>Instant Download</h3>
            <p>Get immediate access right after payment</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '40px' }}>🔒</span>
            <h3 style={{ marginTop: '12px' }}>Secure Payments</h3>
            <p>M‑Pesa integration with full security</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '40px' }}>🔄</span>
            <h3 style={{ marginTop: '12px' }}>Lifetime Access</h3>
            <p>Download your items anytime, anywhere</p>
          </div>
        </div>
      </div>

      {/* Featured Items */}
      <div className="section-header">
        <h2 className="section-title">Popular This Week</h2>
        <Link to="/documents" className="view-all">View All →</Link>
      </div>
      <div className="card-grid">
        {[...documents, ...software].slice(0, 6).map((item) => {
          const isDocument = item.fileInfo?.extension === '.pdf' || item.fileInfo?.extension === '.doc';
          return isDocument ? (
            <DocumentCard key={item._id} document={item} />
          ) : (
            <SoftwareCard key={item._id} software={item} />
          );
        })}
      </div>

      {/* Recent Documents */}
      <div className="section-header" style={{ marginTop: '48px' }}>
        <h2 className="section-title">Recent Documents</h2>
        <Link to="/documents" className="view-all">View All →</Link>
      </div>
      <div className="card-grid">
        {documents.slice(0, 4).map(doc => (
          <DocumentCard key={doc._id} document={doc} />
        ))}
      </div>

      {/* Recent Software */}
      <div className="section-header" style={{ marginTop: '48px' }}>
        <h2 className="section-title">Recent Software</h2>
        <Link to="/software" className="view-all">View All →</Link>
      </div>
      <div className="card-grid">
        {software.slice(0, 4).map(soft => (
          <SoftwareCard key={soft._id} software={soft} />
        ))}
      </div>

      {/* Call‑to‑Action Banner */}
      <div className="hero" style={{ marginTop: '48px', background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' }}>
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of satisfied customers and access premium digital content today</p>
        <div className="hero-buttons">
          <Link to="/register" className="hero-btn" style={{ background: 'white', color: '#38a169' }}>Create Free Account</Link>
          <Link to="/help" className="hero-btn hero-btn-outline" style={{ borderColor: 'white' }}>Learn More</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;