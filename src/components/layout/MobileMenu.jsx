import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary-600 text-white p-3 rounded-full shadow-lg"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl z-50 p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Menu</h3>
              <button onClick={() => setIsOpen(false)} className="p-2"><X size={20} /></button>
            </div>
            <nav className="flex flex-col gap-3">
              <Link to="/" onClick={() => setIsOpen(false)} className="py-2 text-gray-700 dark:text-gray-200">Home</Link>
              <Link to="/documents" onClick={() => setIsOpen(false)} className="py-2 text-gray-700 dark:text-gray-200">Documents</Link>
              <Link to="/software" onClick={() => setIsOpen(false)} className="py-2 text-gray-700 dark:text-gray-200">Software</Link>
              <Link to="/help" onClick={() => setIsOpen(false)} className="py-2 text-gray-700 dark:text-gray-200">Help</Link>
              <Link to="/profile" onClick={() => setIsOpen(false)} className="py-2 text-gray-700 dark:text-gray-200">Profile</Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default MobileMenu;