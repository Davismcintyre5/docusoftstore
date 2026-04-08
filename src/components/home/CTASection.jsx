import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-center text-white mb-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Shop?</h2>
      <p className="mb-6">Visit our store or shop online for the best deals</p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/documents" className="bg-white text-primary-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition">
          Shop Now
        </Link>
        <Link to="/branches" className="border-2 border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white/10 transition">
          Find a Store
        </Link>
      </div>
    </div>
  );
};

export default CTASection;