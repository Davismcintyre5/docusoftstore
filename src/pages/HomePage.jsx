import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import DocumentCard from '../components/items/DocumentCard';
import SoftwareCard from '../components/items/SoftwareCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage = () => {
  const [documents, setDocuments] = useState([]);
  const [software, setSoftware] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, softRes] = await Promise.all([
          api.get('/documents?limit=4'),
          api.get('/software?limit=4')
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

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="hero">
        <h1>Welcome to DocuSoft Store</h1>
        <p>Your one-stop destination for premium documents and software</p>
        <div className="hero-buttons">
          <Link to="/documents" className="hero-btn">Browse Documents</Link>
          <Link to="/software" className="hero-btn hero-btn-outline">Browse Software</Link>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="section-header">
        <h2 className="section-title">Recent Documents</h2>
        <Link to="/documents" className="view-all">View All →</Link>
      </div>
      <div className="card-grid">
        {documents.map(doc => <DocumentCard key={doc._id} document={doc} />)}
      </div>

      {/* Recent Software */}
      <div className="section-header" style={{ marginTop: '40px' }}>
        <h2 className="section-title">Recent Software</h2>
        <Link to="/software" className="view-all">View All →</Link>
      </div>
      <div className="card-grid">
        {software.map(soft => <SoftwareCard key={soft._id} software={soft} />)}
      </div>
    </div>
  );
};

export default HomePage;