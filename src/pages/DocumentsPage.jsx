import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DocumentGrid from '../components/documents/DocumentGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const { data } = await api.get('/documents');
        setDocuments(data);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">All Documents</h2>
      </div>
      <DocumentGrid documents={documents} loading={loading} />
    </div>
  );
};

export default DocumentsPage;