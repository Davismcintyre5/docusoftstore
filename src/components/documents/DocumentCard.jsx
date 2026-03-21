import React from 'react';
import { Link } from 'react-router-dom';
import { formatKES } from '../../utils/formatters';

const DocumentCard = ({ document }) => {
  const getFileIcon = () => {
    const ext = document.fileInfo?.extension?.toLowerCase();
    if (ext === '.pdf') return '📄';
    if (ext === '.doc' || ext === '.docx') return '📝';
    if (ext === '.zip' || ext === '.rar') return '🗜️';
    if (ext === '.txt') return '📃';
    return '📁';
  };

  const getFileTypeLabel = () => {
    const ext = document.fileInfo?.extension?.toLowerCase();
    if (ext === '.zip' || ext === '.rar') return 'Archive';
    return 'Document';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const mb = bytes / 1024 / 1024;
    return mb < 1 ? `${(bytes / 1024).toFixed(0)} KB` : `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="card">
      {document.isFree && <div className="card-badge free">FREE</div>}
      <div className="card-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '24px' }}>{getFileIcon()}</span>
          <h3 className="card-title" style={{ margin: 0 }}>{document.title}</h3>
        </div>
        <div style={{ fontSize: '11px', color: '#a0aec0', marginBottom: '8px' }}>
          {getFileTypeLabel()} • {document.fileInfo?.extension?.toUpperCase() || 'FILE'} • {formatFileSize(document.fileInfo?.size)}
        </div>
        <p className="card-description">
          {document.description?.substring(0, 100)}...
        </p>
        <div className="card-footer">
          <span className={`card-price ${document.isFree ? 'free' : ''}`}>
            {document.isFree ? 'FREE' : formatKES(document.price)}
          </span>
          <Link to={`/document/${document._id}`} className="card-btn">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;