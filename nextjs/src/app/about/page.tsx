'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-900 text-white py-24">
        <div className="container mx-auto px-6">
          <div className={`max-w-3xl transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Rentify</h1>
            <p className="text-xl text-blue-100">
              We are on a mission to make property rental simple, transparent, and accessible for everyone.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </div>

      {/* Our Story */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Rentify was founded in 2023 with a simple idea: make property rental as easy as booking a hotel room. We noticed that finding and renting properties was often a frustrating, time-consuming process filled with paperwork and uncertainty.
            </p>
            <p className="text-gray-600 mb-4">
              Our team of real estate experts and technology enthusiasts came together to create a platform that streamlines the entire rental process. We connect property owners with potential tenants, providing a transparent and efficient marketplace for both parties.
            </p>
            <p className="text-gray-600">
              Today, Rentify has grown to become one of the leading property rental platforms in Vietnam, helping thousands of people find their perfect rental property.
            </p>
          </div>
          <div className={`transition-all duration-1000 delay-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                {/* Replace with actual image when available */}
                {/* <div className="text-gray-400 text-lg">Our Office Image</div> */}
                <Image
              src="/images/buildings/building8.jpg"
              alt="Contact background"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className={`text-center mb-12 transition-all duration-1000 delay-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold text-gray-800">Our Values</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              At Rentify, our work is guided by these core principles that shape everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`bg-white p-8 rounded-lg shadow-md transition-all duration-1000 delay-800 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="text-blue-900 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Trust & Transparency</h3>
              <p className="text-gray-600">
                We believe in complete honesty in all our dealings. We provide accurate information about properties and maintain transparency in our fees and processes.
              </p>
            </div>

            <div className={`bg-white p-8 rounded-lg shadow-md transition-all duration-1000 delay-900 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="text-blue-900 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously strive to improve our platform and services. We embrace technology to make property rental more efficient and user-friendly.
              </p>
            </div>

            <div className={`bg-white p-8 rounded-lg shadow-md transition-all duration-1000 delay-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="text-blue-900 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Customer Focus</h3>
              <p className="text-gray-600">
                Our users are at the heart of everything we do. We listen to feedback and continuously work to improve the experience for both property owners and tenants.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="container mx-auto px-6 py-16">
        <div className={`text-center mb-12 transition-all duration-1000 delay-1100 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-gray-800">Meet Our Team</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            The passionate people behind Rentify who are dedicated to making property rental simple and accessible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'John Doe', title: 'CEO & Founder', delay: 1200 },
            { name: 'Jane Smith', title: 'CTO', delay: 1300 },
            { name: 'Robert Johnson', title: 'Head of Operations', delay: 1400 },
            { name: 'Anna Williams', title: 'Customer Success Manager', delay: 1500 }
          ].map((member, index) => (
            <div key={index} className={`text-center transition-all duration-1000 delay-${member.delay} transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="bg-gray-200 rounded-full h-40 w-40 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-lg">Photo</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
              <p className="text-blue-700">{member.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <div className={`transition-all duration-1000 delay-1600 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Rental?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied users who have found their ideal property with Rentify.
            </p>
            <Link href="/properties" className="bg-white text-blue-900 px-8 py-3 rounded-md font-medium hover:bg-blue-50 transition duration-300 inline-block">
              Explore Properties
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 