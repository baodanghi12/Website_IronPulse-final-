import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ShopContext } from '../context/ShopContext';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import NewsletterBox from '../components/NewsletterBox';

const Layout = ({ children }) => {
  const { setShowSearch } = useContext(ShopContext);
  const [location] = useLocation();
  const [showNewsletter, setShowNewsletter] = useState(true);

  // Hide newsletter on cart and checkout pages
  useEffect(() => {
    if (location.includes('cart') || location.includes('checkout')) {
      setShowNewsletter(false);
    } else {
      setShowNewsletter(true);
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <SearchBar />
      
      <main className="flex-grow">
        {children}
      </main>
      
      {showNewsletter && (
        <div className="bg-gray-100 py-12 px-4 mt-16">
          <div className="max-w-2xl mx-auto">
            <NewsletterBox />
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Layout;