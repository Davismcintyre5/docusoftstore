import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Search } from 'lucide-react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [documents, setDocuments] = useState([]);
  const [software, setSoftware] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetchResults();
    } else {
      setLoading(false);
    }
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const [docsRes, softRes] = await Promise.all([
        api.get(`/documents?search=${encodeURIComponent(query)}`),
        api.get(`/software?search=${encodeURIComponent(query)}`)
      ]);
      setDocuments(docsRes.data);
      setSoftware(softRes.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const totalResults = documents.length + software.length;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-500 mb-6">Found {totalResults} result(s) for "{query}"</p>

      {totalResults === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <Search size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No items found. Try different keywords.</p>
          <Link to="/" className="text-primary-600 mt-2 inline-block">Browse all items</Link>
        </div>
      ) : (
        <>
          {documents.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Documents ({documents.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {documents.map(doc => <ProductCard key={doc._id} item={doc} type="document" />)}
              </div>
            </div>
          )}
          {software.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Software ({software.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {software.map(soft => <ProductCard key={soft._id} item={soft} type="software" />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;