'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { buildingService, BuildingSearchResponse } from '@/services/buildingService';

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState<BuildingSearchResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState({
    name: '',
    district: '',
    rentPriceFrom: '',
    rentPriceTo: '',
  });

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const params = {
        name: searchParams.name || undefined,
        district: searchParams.district || undefined,
        rentPriceFrom: searchParams.rentPriceFrom ? parseInt(searchParams.rentPriceFrom) : undefined,
        rentPriceTo: searchParams.rentPriceTo ? parseInt(searchParams.rentPriceTo) : undefined,
      };
      
      const data = await buildingService.getBuildings(params);
      setBuildings(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch buildings:', err);
      setError('Failed to load buildings. Please try again later.');
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
      rentPriceTo: '',
    });
    // Gọi fetchBuildings để tải lại tất cả dữ liệu
    setTimeout(fetchBuildings, 0);
  };

  // Kiểm tra xem có bộ lọc nào được áp dụng không
  const hasActiveFilters = searchParams.name || searchParams.district || searchParams.rentPriceFrom || searchParams.rentPriceTo;

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Available Properties</h1>
      
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Search Properties</h2>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={searchParams.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Building name"
            />
          </div>
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <input
              type="text"
              id="district"
              name="district"
              value={searchParams.district}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="District"
            />
          </div>
          <div>
            <label htmlFor="rentPriceFrom" className="block text-sm font-medium text-gray-700 mb-1">Price From</label>
            <input
              type="number"
              id="rentPriceFrom"
              name="rentPriceFrom"
              value={searchParams.rentPriceFrom}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Min price"
            />
          </div>
          <div>
            <label htmlFor="rentPriceTo" className="block text-sm font-medium text-gray-700 mb-1">Price To</label>
            <input
              type="number"
              id="rentPriceTo"
              name="rentPriceTo"
              value={searchParams.rentPriceTo}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Max price"
            />
          </div>
          <div className="md:col-span-4 flex gap-3">
            <button
              type="submit"
              className="bg-blue-900 text-white py-2 px-6 rounded-md hover:bg-blue-800 transition duration-300"
            >
              Search
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 transition duration-300"
              >
                Clear Filters
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Applied Filters */}
      {hasActiveFilters && (
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
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {buildings.length} {buildings.length === 1 ? 'Property' : 'Properties'} Found
          </h2>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : buildings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <h3 className="text-xl font-medium text-gray-800 mb-2">No properties found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all properties</p>
          {hasActiveFilters && (
            <button 
              onClick={handleClearFilters} 
              className="bg-blue-900 text-white py-2 px-6 rounded-md hover:bg-blue-800 transition-colors duration-300"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {buildings.map((building) => (
            <div key={building.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
              <div className="h-48 bg-gray-300 relative">
                <Image
                  src={building.id % 3 === 0 ? '/building-1.jpg' : building.id % 3 === 1 ? '/building-2.jpg' : '/building-3.jpg'}
                  alt={building.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{building.name}</h3>
                <p className="text-gray-600 mb-2">{building.address}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {building.floorArea} m²
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    ${building.rentPrice}/month
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Manager: {building.managerName}</p>
                    <p className="text-sm text-gray-500">Phone: {building.managerPhone}</p>
                  </div>
                  <Link 
                    href={`/buildings/${building.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 