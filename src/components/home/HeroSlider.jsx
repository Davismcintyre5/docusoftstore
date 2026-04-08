import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HeroSlider = ({ businessName = 'DocuSoft' }) => {
  const slides = [
    {
      title: `Welcome to ${businessName}`,
      subtitle: 'Your one-stop shop for quality digital products',
      cta: 'Shop Now',
      link: '/documents',
      gradient: 'from-primary-600 to-primary-800'
    },
    {
      title: 'Premium Documents',
      subtitle: 'Professional templates, contracts, and more',
      cta: 'Explore Documents',
      link: '/documents',
      gradient: 'from-green-600 to-teal-700'
    },
    {
      title: 'Powerful Software',
      subtitle: 'Tools to boost your productivity',
      cta: 'Browse Software',
      link: '/software',
      gradient: 'from-orange-600 to-red-700'
    }
  ];

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      className="rounded-2xl overflow-hidden mb-12 h-[400px] md:h-[500px]"
    >
      {slides.map((slide, idx) => (
        <SwiperSlide key={idx}>
          <div className={`relative h-full bg-gradient-to-r ${slide.gradient}`}>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
                {slide.title}
              </h1>
              <p className="text-base md:text-lg lg:text-xl mb-8 max-w-2xl opacity-90">
                {slide.subtitle}
              </p>
              <Link
                to={slide.link}
                className="bg-white text-gray-900 px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSlider;