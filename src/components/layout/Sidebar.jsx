import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { ChevronDown, ChevronRight } from 'lucide-react';

const Sidebar = () => {
  const { settings, categories } = useSettings(); // Get categories from context
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden sticky top-24">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-800 dark:text-white"
        >
          <span>📂 Categories</span>
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
        
        {expanded && (
          <nav className="p-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm transition ${
                  isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              🏠 All Items
            </NavLink>
            {categories.map(cat => (
              <NavLink
                key={cat._id}
                to={`/category/${cat.slug || cat._id}`}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm transition ${
                    isActive 
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                📁 {cat.name}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Contact Card */}
        <div className="m-4 p-4 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl text-white">
          <h4 className="font-semibold mb-2">📞 Need Help?</h4>
          <p className="text-sm opacity-90 mb-2">Call or WhatsApp us</p>
          <p className="text-sm font-mono mb-3">{settings?.businessPhoneNumber || '0768784909'}</p>
          <a
            href={`https://wa.me/254${(settings?.whatsappNumber || '0768784909').slice(1)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full text-center bg-white text-primary-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
          >
            💬 Chat on WhatsApp
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;