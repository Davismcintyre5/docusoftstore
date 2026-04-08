import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📚</span>
              <span className="text-lg font-bold text-white">{settings?.businessName || 'DocuSoft'}</span>
            </div>
            <p className="text-sm text-gray-400">Your trusted source for digital documents and software solutions.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/documents" className="hover:text-white transition">Documents</Link></li>
              <li><Link to="/software" className="hover:text-white transition">Software</Link></li>
              <li><Link to="/help" className="hover:text-white transition">Help Center</Link></li>
              <li><Link to="/profile" className="hover:text-white transition">My Account</Link></li>
            </ul>
          </div>

          {/* Contact Info – fully dynamic */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={14} /> {settings?.businessPhoneNumber || '0768784909'}
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} /> {settings?.contactEmail || 'support@docusoft.com'}
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} /> {settings?.address || 'Nairobi, Kenya'}
              </li>
            </ul>
            {/* Social links – only show if URL exists */}
            <div className="flex gap-3 mt-4">
              {settings?.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  <Facebook size={18} />
                </a>
              )}
              {settings?.twitter && (
                <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  <Twitter size={18} />
                </a>
              )}
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  <Instagram size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-white font-semibold mb-4">Business Hours</h3>
            <ul className="space-y-1 text-sm">
              {settings?.businessHours ? (
                Object.entries(settings.businessHours).map(([day, hours]) => (
                  <li key={day} className="capitalize flex justify-between">
                    <span>{day}:</span> <span>{hours}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex justify-between"><span>Monday - Friday:</span><span>9am - 5pm</span></li>
                  <li className="flex justify-between"><span>Saturday:</span><span>Closed</span></li>
                  <li className="flex justify-between"><span>Sunday:</span><span>Closed</span></li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          &copy; {year} {settings?.businessName || 'DocuSoft Store'}. All rights reserved. | Developed by Davix HDM
        </div>
      </div>
    </footer>
  );
};

export default Footer;