import React from 'react';
import { Link } from 'react-router-dom';
import { formatKES } from '../../utils/formatters';
import { FileText, Monitor } from 'lucide-react';

const ProductCard = ({ item, type }) => {
  const isDocument = type === 'document';
  const detailPath = isDocument ? `/document/${item._id}` : `/software/${item._id}`;

  return (
    <div className="card group w-full max-w-full overflow-hidden">
      <Link to={detailPath} className="block">
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
          {isDocument ? (
            <FileText size={64} className="text-gray-400 group-hover:scale-110 transition" />
          ) : (
            <Monitor size={64} className="text-gray-400 group-hover:scale-110 transition" />
          )}
          {item.isFree && (
            <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              FREE
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 dark:text-white truncate">{item.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.description || 'No description'}</p>
          <div className="flex justify-between items-center mt-3">
            <span className={`text-xl font-bold ${item.isFree ? 'text-green-600' : 'text-primary-600'}`}>
              {item.isFree ? 'FREE' : formatKES(item.price)}
            </span>
            <span className="text-xs text-gray-400">⬇️ {item.downloadCount || 0}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;