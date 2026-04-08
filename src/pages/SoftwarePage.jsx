import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Search, Filter } from 'lucide-react';

const SoftwarePage = () => {
  const [software, setSoftware] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [priceFilter, setPriceFilter] = useState('all');

  useEffect(() => {
    fetchSoftware();
  }, []);

  useEffect(() => {
    filterSoftware();
  }, [software, searchTerm, priceFilter]);

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

  const filterSoftware = () => {
    let result = [...software];
    if (searchTerm) {
      result = result.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()) || (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase())));
    }
    if (priceFilter === 'free') {
      result = result.filter(s => s.isFree === true);
    } else if (priceFilter === 'paid') {
      result = result.filter(s => s.isFree !== true);
    }
    setFiltered(result);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search: searchTerm });
    filterSoftware();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">All Software</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search software..." className="input pr-10" />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2"><Search size={18} className="text-gray-400" /></button>
        </form>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="input w-32">
            <option value="all">All</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">Found {filtered.length} software item(s)</p>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <p className="text-gray-500">No software found. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(soft => <ProductCard key={soft._id} item={soft} type="software" />)}
        </div>
      )}
    </div>
  );
};

export default SoftwarePage;