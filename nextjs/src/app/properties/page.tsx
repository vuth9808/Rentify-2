'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { buildingService, BuildingSearchResponse } from '@/services/buildingService';

export default function PropertiesPage() {
  const [buildings, setBuildings] = useState<BuildingSearchResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState({
    name: '',
    district: '',
    rentPriceFrom: '',
    rentPriceTo: ''
  });

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const data = await buildingService.getBuildings();
      setBuildings(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch buildings:', err);
      setError('Failed to load properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBuildings();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearFilters = () => {
    setSearchParams({
      name: '',
      district: '',
      rentPriceFrom: '',
      rentPriceTo: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 bg-blue-900 text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">Properties</h1>
          <p className="text-xl text-blue-100">Find your perfect commercial or residential property</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        {/* Search Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Search Properties</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Property Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={searchParams.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="e.g. Vinhomes Central Park"
              />
            </div>
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <select
                id="district"
                name="district"
                value={searchParams.district}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              >
                <option value="">All Districts</option>
                <option value="District 1">District 1</option>
                <option value="District 2">District 2</option>
                <option value="District 3">District 3</option>
                <option value="Binh Thanh">Binh Thanh</option>
                <option value="Thu Duc">Thu Duc</option>
              </select>
            </div>
            <div>
              <label htmlFor="rentPriceFrom" className="block text-sm font-medium text-gray-700 mb-2">Price From ($)</label>
              <input
                type="number"
                id="rentPriceFrom"
                name="rentPriceFrom"
                value={searchParams.rentPriceFrom}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Min price"
              />
            </div>
            <div>
              <label htmlFor="rentPriceTo" className="block text-sm font-medium text-gray-700 mb-2">Price To ($)</label>
              <input
                type="number"
                id="rentPriceTo"
                name="rentPriceTo"
                value={searchParams.rentPriceTo}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Max price"
              />
            </div>
            <div className="md:col-span-4 flex justify-center gap-4">
              <button
                type="submit"
                className="bg-blue-900 text-white py-3 px-8 rounded-md hover:bg-blue-800 transition-colors duration-300 font-medium shadow-md"
              >
                Search Properties
              </button>
              {(searchParams.name || searchParams.district || searchParams.rentPriceFrom || searchParams.rentPriceTo) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="bg-gray-200 text-gray-800 py-3 px-8 rounded-md hover:bg-gray-300 transition-colors duration-300 font-medium shadow-md"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Applied Filters */}
        {(searchParams.name || searchParams.district || searchParams.rentPriceFrom || searchParams.rentPriceTo) && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Applied Filters:</h3>
            <div className="flex flex-wrap gap-2">
              {searchParams.name && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Name: {searchParams.name}
                </span>
              )}
              {searchParams.district && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  District: {searchParams.district}
                </span>
              )}
              {searchParams.rentPriceFrom && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Min Price: ${searchParams.rentPriceFrom}
                </span>
              )}
              {searchParams.rentPriceTo && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Max Price: ${searchParams.rentPriceTo}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {buildings.length} {buildings.length === 1 ? 'Property' : 'Properties'} Found
            </h2>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900 mb-4 animate-spin"></div>
              <p className="text-gray-600">Loading properties...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-6 rounded-md shadow-sm border border-red-200">
            <h3 className="font-bold text-lg mb-2">Error</h3>
            <p>{error}</p>
            <button 
              onClick={fetchBuildings} 
              className="mt-4 bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-800 transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        ) : buildings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all properties</p>
            <button 
              onClick={handleClearFilters} 
              className="bg-blue-900 text-white py-2 px-6 rounded-md hover:bg-blue-800 transition-colors duration-300"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {buildings.map((building) => (
              <div key={building.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="h-56 bg-gray-300 relative">
                  <Image
                    src={`/images/buildings/building${building.id % 3 + 1}.svg`}
                    alt={building.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute top-0 left-0 w-full p-3 bg-gradient-to-b from-black/50 to-transparent">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Commercial
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="font-bold text-xl text-white">{building.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{building.address}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                      {building.floorArea} m²
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                      ${building.rentPrice}/month
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full">
                      Service: ${building.serviceFee}
                    </span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Manager: {building.managerName}</p>
                        <p className="text-sm text-gray-500">Phone: {building.managerPhone}</p>
                      </div>
                      <Link 
                        href={`/properties/${building.id}`}
                        className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors duration-300 text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 