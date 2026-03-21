import React from 'react';
import { Link } from 'react-router-dom';
import { formatKES } from '../../utils/formatters';

const DocumentCard = ({ document }) => {
  return (
    <div className="card">
      {document.isFree && <div className="card-badge free">FREE</div>}
      <div className="card-content">
        <h3 className="card-title">{document.title}</h3>
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