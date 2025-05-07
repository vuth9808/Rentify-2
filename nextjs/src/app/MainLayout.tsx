'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const [year, setYear] = useState(new Date().getFullYear());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // This ensures the year is correct when the component is hydrated
  useEffect(() => {
    setYear(new Date().getFullYear());
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('userName');
    
    if (token) {
      setIsLoggedIn(true);
      if (storedUserName) {
        setUserName(storedUserName);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
    window.location.href = '/';
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-blue-900">Rentify</a>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="font-medium text-gray-700 hover:text-blue-900">Home</a>
              <a href="/properties" className="font-medium text-gray-700 hover:text-blue-900">Properties</a>
              <a href="/about" className="font-medium text-gray-700 hover:text-blue-900">About</a>
              <a href="/contact" className="font-medium text-gray-700 hover:text-blue-900">Contact</a>
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="relative">
                  <button 
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-900 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-900">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span>{userName}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a>
                      {userName === 'admin' && (
                        <a href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Admin Dashboard</a>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <a href="/login" className="font-medium text-gray-700 hover:text-blue-900">Log In</a>
                  <a href="/signup" className="bg-blue-900 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-800 transition duration-300">
                    Sign Up
                  </a>
                </>
              )}
            </div>
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-3">
                <a href="/" className="font-medium text-gray-700 hover:text-blue-900 py-2">Home</a>
                <a href="/properties" className="font-medium text-gray-700 hover:text-blue-900 py-2">Properties</a>
                <a href="/about" className="font-medium text-gray-700 hover:text-blue-900 py-2">About</a>
                <a href="/contact" className="font-medium text-gray-700 hover:text-blue-900 py-2">Contact</a>
                
                {isLoggedIn ? (
                  <>
                    <div className="py-2 border-t border-gray-200">
                      <div className="flex items-center space-x-2 text-gray-700 mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-900">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <span>{userName}</span>
                      </div>
                      <div className="flex flex-col space-y-3 pl-10">
                        <a href="/profile" className="text-gray-700 hover:text-blue-900">Profile</a>
                        {userName === 'admin' && (
                          <a href="/admin" className="text-gray-700 hover:text-blue-900">Admin Dashboard</a>
                        )}
                        <button 
                          onClick={handleLogout}
                          className="text-left text-gray-700 hover:text-blue-900"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3 border-t border-gray-200 pt-3">
                    <a href="/login" className="font-medium text-gray-700 hover:text-blue-900">Log In</a>
                    <a href="/signup" className="bg-blue-900 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-800 transition duration-300 inline-block text-center">
                      Sign Up
                    </a>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Rentify</h3>
              <p className="text-gray-400">Find your perfect rental property with our trusted platform. We connect property owners with potential tenants.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="/properties" className="text-gray-400 hover:text-white">Properties</a></li>
                <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Property Rental</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Property Management</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Client Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <address className="text-gray-400 not-italic">
                <p>123 Property Street</p>
                <p>Ho Chi Minh City, Vietnam</p>
                <p className="mt-4">Email: info@rentify.com</p>
                <p>Phone: +84 123 456 789</p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {year} Rentify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
} 