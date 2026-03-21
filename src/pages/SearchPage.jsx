import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import DocumentGrid from '../components/documents/DocumentGrid';
import SoftwareGrid from '../components/software/SoftwareGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [documents, setDocuments] = useState([]);
  const [software, setSoftware] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchItems = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      try {
        const [docsRes, softRes] = await Promise.all([
          api.get(`/documents?search=${query}`),
          api.get(`/software?search=${query}`)
        ]);
        setDocuments(docsRes.data);
        setSoftware(softRes.data);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };
    searchItems();
  }, [query]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Search Results for "{query}"</h2>
      </div>
      
      {documents.length === 0 && software.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <p>No results found for "{query}"</p>
        </div>
      ) : (
        <>
          {documents.length > 0 && (
            <>
              <h3 style={{ marginBottom: '16px' }}>Documents ({documents.length})</h3>
              <DocumentGrid documents={documents} loading={false} />
            </>
          )}
          
          {software.length > 0 && (
            <>
              <h3 style={{ marginTop: '32px', marginBottom: '16px' }}>Software ({software.length})</h3>
              <SoftwareGrid software={software} loading={false} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;