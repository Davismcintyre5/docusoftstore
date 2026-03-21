import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import DocumentGrid from '../components/documents/DocumentGrid';
import SoftwareGrid from '../components/software/SoftwareGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CategoryPage = () => {
  const { id } = useParams();
  const [documents, setDocuments] = useState([]);
  const [software, setSoftware] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        const [categoryRes, docsRes, softRes] = await Promise.all([
          api.get(`/categories/${id}`),
          api.get(`/documents?category=${id}`),
          api.get(`/software?category=${id}`)
        ]);
        setCategory(categoryRes.data);
        setDocuments(docsRes.data);
        setSoftware(softRes.data);
      } catch (error) {
        console.error('Failed to fetch category items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryItems();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!category) return <div>Category not found</div>;

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">{category.name}</h2>
      </div>
      <p style={{ color: '#718096', marginBottom: '24px' }}>{category.description}</p>
      
      <h3 style={{ marginTop: '24px', marginBottom: '16px' }}>Documents</h3>
      <DocumentGrid documents={documents} loading={false} />
      
      <h3 style={{ marginTop: '32px', marginBottom: '16px' }}>Software</h3>
      <SoftwareGrid software={software} loading={false} />
    </div>
  );
};

export default CategoryPage;