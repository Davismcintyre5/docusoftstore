import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const { settings } = useSettings();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">📂 Categories</h3>
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/" end>🏠 All Items</NavLink>
        </li>
        {categories.map(cat => (
          <li key={cat._id}>
            <NavLink to={`/category/${cat.slug || cat._id}`}>📁 {cat.name}</NavLink>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '32px', padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', color: 'white' }}>
        <h4 style={{ fontSize: '16px', marginBottom: '12px' }}>📞 Contact Us</h4>
        <p style={{ fontSize: '13px', marginBottom: '8px' }}>
          <strong>Phone:</strong> {settings?.businessPhoneNumber || '0768784909'}
        </p>
        <p style={{ fontSize: '13px', marginBottom: '8px' }}>
          <strong>WhatsApp:</strong> {settings?.whatsappNumber || '0768784909'}
        </p>
        <a 
          href={`https://wa.me/254${(settings?.whatsappNumber || '0768784909').slice(1)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', marginTop: '12px', padding: '8px 16px', background: '#25D366', color: 'white', textDecoration: 'none', borderRadius: '30px', fontSize: '13px' }}
        >
          💬 Chat on WhatsApp
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;