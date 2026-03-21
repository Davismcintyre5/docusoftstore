import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SoftwareGrid from '../components/software/SoftwareGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SoftwarePage = () => {
  const [software, setSoftware] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSoftware = async () => {
      try {
        const { data } = await api.get('/software');
        setSoftware(data);
      } catch (error) {
        console.error('Failed to fetch software:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSoftware();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">All Software</h2>
      </div>
      <SoftwareGrid software={software} loading={loading} />
    </div>
  );
};

export default SoftwarePage;