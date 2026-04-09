import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';
import ProductCard from '../components/ui/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings, categories } = useSettings(); // Get categories from context

  const gradients = [
    'from-primary-600 to-primary-800',
    'from-green-600 to-teal-700',
    'from-orange-600 to-red-700',
    'from-purple-600 to-pink-700',
    'from-blue-600 to-cyan-700',
    'from-indigo-600 to-purple-800',
    'from-rose-600 to-orange-700',
    'from-emerald-600 to-teal-800',
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [docsRes, softRes] = await Promise.all([
          api.get('/documents'),
          api.get('/software')
        ]);

        const documents = docsRes.data.map(doc => ({ ...doc, type: 'document' }));
        const software = softRes.data.map(soft => ({ ...soft, type: 'software' }));
        const allProducts = [...documents, ...software].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setFeatured(allProducts.slice(0, 8));
        setNewArrivals(allProducts.slice(8, 12));
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Build slides from categories (from context)
  const welcomeSlide = {
    title: `Welcome to ${settings?.businessName || 'DocuSoft'}`,
    subtitle: 'Your one-stop shop for quality digital products',
    cta: 'Shop Now',
    link: '/documents',
    gradient: 'from-primary-600 to-primary-800'
  };

  const documentsSlide = {
    title: 'Premium Documents',
    subtitle: 'Professional templates, contracts, and more',
    cta: 'Explore Documents',
    link: '/documents',
    gradient: 'from-green-600 to-teal-700'
  };

  const softwareSlide = {
    title: 'Powerful Software',
    subtitle: 'Tools to boost your productivity',
    cta: 'Browse Software',
    link: '/software',
    gradient: 'from-orange-600 to-red-700'
  };

  const categorySlides = categories.map((cat, index) => ({
    title: cat.name,
    subtitle: cat.description || `Browse all ${cat.name} items`,
    cta: 'Explore',
    link: `/category/${cat.slug || cat._id}`,
    gradient: gradients[(index + 3) % gradients.length]
  }));

  const slides = [welcomeSlide, documentsSlide, softwareSlide, ...categorySlides];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Slider */}
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="rounded-xl overflow-hidden mb-12 h-[300px] md:h-[380px]"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className={`relative h-full bg-gradient-to-r ${slide.gradient}`}>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                <h1 className="text-3xl md:text-5xl font-bold mb-3 animate-fade-in">{slide.title}</h1>
                <p className="text-base md:text-lg mb-6 max-w-2xl opacity-90">{slide.subtitle}</p>
                <Link
                  to={slide.link}
                  className="bg-white text-gray-900 px-5 md:px-7 py-2 md:py-2.5 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg text-sm md:text-base"
                >
                  {slide.cta || 'Shop Now'}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Featured Products */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
          <Link to="/documents" className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map(product => (
            <ProductCard key={product._id} item={product} type={product.type} />
          ))}
        </div>
      </div>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">New Arrivals</h2>
            <Link to="/software" className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.map(product => (
              <ProductCard key={product._id} item={product} type={product.type} />
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-8 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Shop?</h2>
        <p className="mb-6">Visit our store or shop online for the best deals</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/documents" className="bg-white text-primary-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition">
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;