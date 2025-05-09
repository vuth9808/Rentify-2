'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { buildingService, BuildingSearchResponse } from "../services/buildingService";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [featuredProperties, setFeaturedProperties] = useState<BuildingSearchResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);

    // Fetch featured properties from API
    const loadFeaturedProperties = async () => {
      try {
        setLoading(true);
        const properties = await buildingService.getBuildings();
        // Take the first 3 properties for the featured section
        setFeaturedProperties(properties.slice(0, 3));
      } catch (error) {
        console.error("Error loading featured properties:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProperties();
  }, []);

  // Function to format address
  const formatAddress = (address: string) => {
    return address.split(',').slice(0, 2).join(', ');
  };

  // Function to get district from address
  const getDistrict = (address: string) => {
    const parts = address.split(',');
    return parts.length > 2 ? parts[2].trim() : 'District 1';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with improved animation */}
      <section className="relative h-[85vh] flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 1.5 }}
          >
            <Image
              src="/images/buildings/building1.jpg"
              alt="City skyline"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </motion.div>
        </div>
        <div className="container mx-auto px-6 z-10 text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Find Your Perfect Rental Property
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Rentify offers the best selection of commercial and residential properties for rent in prime locations.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              href="/properties"
              className="bg-white text-blue-900 font-medium py-3 px-8 rounded-md shadow-lg hover:bg-blue-50 hover:scale-105 transition duration-300"
            >
              Browse Properties
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white font-medium py-3 px-8 rounded-md hover:bg-white/10 hover:scale-105 transition duration-300"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
        {/* Custom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#f9fafb" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,160C960,160,1056,128,1152,106.7C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-3 text-gray-800">Featured Properties</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover our handpicked selection of premium properties that match your needs and expectations.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeletons
              [...Array(3)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                >
                  <div className="h-56 bg-gray-300 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-4 animate-pulse"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-4 animate-pulse"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-5 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              // Actual property data
              featuredProperties.map((property, i) => (
                <motion.div 
                  key={property.id} 
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                  whileHover={{ y: -10 }}
                >
                  <div className="h-56 bg-gray-300 relative overflow-hidden">
                    <Image
                      src="/images/buildings/building2.jpg"
                      alt={property.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="hover:scale-110 transition duration-700"
                    />
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">Available</span>
                      <span className="text-gray-500 text-sm">Commercial</span>
                    </div>
                    <h3 className="font-bold text-xl mb-2">{property.name}</h3>
                    <p className="text-gray-600 mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {formatAddress(property.address)}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-900 font-bold">${property.rentPrice}/month</span>
                      <Link 
                        href={`/properties/${property.id}`}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          <motion.div 
            className="text-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link 
              href="/properties"
              className="inline-block bg-blue-900 text-white font-medium py-3 px-8 rounded-md hover:bg-blue-800 hover:scale-105 transition duration-300"
            >
              View All Properties
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-3 text-gray-800">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive solutions to meet all your property rental needs.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Property Rental",
                description: "Find the perfect property that meets all your requirements from our extensive listings.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
                delay: 0.3
              },
              {
                title: "Property Management",
                description: "We help landlords manage their properties efficiently with our comprehensive management services.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                delay: 0.4
              },
              {
                title: "Client Support",
                description: "Our dedicated team provides ongoing support to ensure a smooth rental experience.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                delay: 0.5
              }
            ].map((service, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-xl transition duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: service.delay }}
                whileHover={{ y: -10 }}
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-center text-gray-800">{service.title}</h3>
                <p className="text-gray-600 text-center">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - New */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-3 text-gray-800">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Hear from our satisfied customers about their experience with Rentify.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "John Smith",
                position: "Office Manager",
                quote: "Rentify made finding our new office space incredibly simple. The team was responsive and understood our needs perfectly.",
                delay: 0.3
              },
              {
                name: "Sarah Johnson",
                position: "Business Owner",
                quote: "We've been using Rentify for all our property management needs. Their platform is intuitive and saves us countless hours every month.",
                delay: 0.4
              },
              {
                name: "Michael Brown",
                position: "Startup Founder",
                quote: "As a startup, finding an affordable yet professional space was crucial. Rentify helped us find the perfect match within our budget.",
                delay: 0.5
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: testimonial.delay }}
              >
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 inline-block" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-900 text-white">
        
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Perfect Rental?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of satisfied users who have found their ideal property with Rentify.
            </p>
            <Link 
              href="/properties"
              className="bg-white text-blue-900 px-8 py-3 rounded-md font-medium hover:bg-blue-50 hover:scale-105 transition duration-300 inline-block"
            >
              Get Started Today
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
