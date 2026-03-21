import React from 'react';
import { Link } from 'react-router-dom';
import { formatKES } from '../../utils/formatters';

const SoftwareCard = ({ software }) => {
  return (
    <div className="card">
      {software.isFree && <div className="card-badge free">FREE</div>}
      <div className="card-content">
        <h3 className="card-title">{software.title}</h3>
        <p className="card-description">
          {software.description?.substring(0, 100)}...
        </p>
        <div className="card-footer">
          <span className={`card-price ${software.isFree ? 'free' : ''}`}>
            {software.isFree ? 'FREE' : formatKES(software.price)}
          </span>
          <Link to={`/software/${software._id}`} className="card-btn">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SoftwareCard;