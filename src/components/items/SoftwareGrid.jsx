import React from 'react';
import SoftwareCard from '../items/SoftwareCard';
import LoadingSpinner from '../common/LoadingSpinner';

const SoftwareGrid = ({ software, loading }) => {
  if (loading) return <LoadingSpinner />;
  if (!software || software.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>No software found.</p>
      </div>
    );
  }

  return (
    <div className="card-grid">
      {software.map(soft => (
        <SoftwareCard key={soft._id} software={soft} />
      ))}
    </div>
  );
};

export default SoftwareGrid;