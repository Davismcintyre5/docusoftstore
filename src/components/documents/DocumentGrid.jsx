import React from 'react';
import DocumentCard from '../items/DocumentCard';
import LoadingSpinner from '../common/LoadingSpinner';

const DocumentGrid = ({ documents, loading }) => {
  if (loading) return <LoadingSpinner />;
  if (!documents || documents.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>No documents found.</p>
      </div>
    );
  }

  return (
    <div className="card-grid">
      {documents.map(doc => (
        <DocumentCard key={doc._id} document={doc} />
      ))}
    </div>
  );
};

export default DocumentGrid;