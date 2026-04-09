import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { categories } = useSettings();

  return (
    <>
      {/* Floating action button for mobile menu */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar overlay menu for mobile */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto animate-slide-in-left">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                <span className="font-bold text-gray-800 dark:text-white">Menu</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X size={20} />
              </button>
            </div>
            
            <nav className="p-4">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Main</h3>
                <ul className="space-y-2">
                  <li><Link to="/" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary-600">🏠 Home</Link></li>
                  <li><Link to="/documents" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary-600">📄 Documents</Link></li>
                  <li><Link to="/software" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary-600">💻 Software</Link></li>
                  <li><Link to="/help" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary-600">❓ Help</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Categories</h3>
                <ul className="space-y-2">
                  {categories.map(cat => (
                    <li key={cat._id}>
                      <Link 
                        to={`/category/${cat.slug || cat._id}`} 
                        onClick={() => setIsOpen(false)} 
                        className="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary-600"
                      >
                        📁 {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default MobileMenu;