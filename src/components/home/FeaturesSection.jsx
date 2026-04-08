import React from 'react';
import { Truck, Award, Clock, ShoppingBag } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    { icon: Truck, title: 'Free Shipping', description: 'On orders over Ksh 5,000' },
    { icon: Award, title: 'Quality Guarantee', description: '100% authentic products' },
    { icon: Clock, title: 'Fast Delivery', description: 'Delivery within 1-3 days' },
    { icon: ShoppingBag, title: 'Secure Shopping', description: 'Safe and secure payments' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {features.map((feature, idx) => (
        <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center hover:shadow-lg transition">
          <feature.icon className="w-12 h-12 text-primary-600 mx-auto mb-3" />
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{feature.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeaturesSection;