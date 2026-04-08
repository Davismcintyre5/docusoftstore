import React, { useState, useEffect } from 'react';
import { MapPin, Phone } from 'lucide-react';
import api from '../../services/api';

const BranchesSection = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        // If you have a branches endpoint, otherwise use placeholder
        const { data } = await api.get('/branches').catch(() => ({ data: [] }));
        setBranches(data.length ? data : [
          { _id: '1', name: 'Nairobi CBD', address: 'Kenya Avenue, Nairobi', phone: '0768784909', images: [] },
          { _id: '2', name: 'Mombasa', address: 'Moi Avenue, Mombasa', phone: '0768784910', images: [] },
          { _id: '3', name: 'Kisumu', address: 'Oginga Odinga Road, Kisumu', phone: '0768784911', images: [] },
        ]);
      } catch (error) {
        console.error('Failed to fetch branches:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  if (loading || branches.length === 0) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Our Branches</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {branches.slice(0, 3).map(branch => (
          <div key={branch._id} className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
            {branch.images && branch.images[0] && (
              <img src={branch.images[0]} alt={branch.name} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{branch.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm flex items-start gap-2">
                <MapPin size={16} className="mt-0.5" /> {branch.address}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-2 mt-2">
                <Phone size={16} /> {branch.phone}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchesSection;