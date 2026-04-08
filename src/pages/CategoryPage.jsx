import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';

const CategoryPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [software, setSoftware] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryAndItems();
  }, [id]);

  const fetchCategoryAndItems = async () => {
    setLoading(true);
    try {
      const [catRes, docsRes, softRes] = await Promise.all([
        api.get(`/categories/${id}`),
        api.get('/documents'),
        api.get('/software')
      ]);
      setCategory(catRes.data);
      const categoryId = catRes.data._id;
      setDocuments(docsRes.data.filter(d => d.category?._id === categoryId || d.category === categoryId));
      setSoftware(softRes.data.filter(s => s.category?._id === categoryId || s.category === categoryId));
    } catch (error) {
      console.error('Failed to fetch category:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!category) return <div className="text-center py-12">Category not found</div>;

  const allItems = [...documents, ...software];
  const freeItems = allItems.filter(i => i.isFree).length;

  return (
    <div className="animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-1 text-primary-600 mb-4"><ArrowLeft size={16} /> Back to Home</Link>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">{category.name}</h1>
        {category.description && <p className="text-gray-600 dark:text-gray-300 mt-1">{category.description}</p>}
        <p className="text-sm text-gray-500 mt-2">{allItems.length} items • {freeItems} free</p>
      </div>

      {allItems.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <p className="text-gray-500">No items in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documents.map(doc => <ProductCard key={doc._id} item={doc} type="document" />)}
          {software.map(soft => <ProductCard key={soft._id} item={soft} type="software" />)}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;