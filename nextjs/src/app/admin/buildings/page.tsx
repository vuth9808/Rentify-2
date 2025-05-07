'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { buildingService, BuildingSearchResponse } from '@/services/buildingService';

export default function AdminBuildingsPage() {
  const [buildings, setBuildings] = useState<BuildingSearchResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBuildings, setSelectedBuildings] = useState<number[]>([]);
  const [searchParams, setSearchParams] = useState({
    name: '',
    district: '',
  });

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const data = await buildingService.getBuildings(searchParams);
      setBuildings(data);
      setError(null);
      setSelectedBuildings([]);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedBuildings(buildings.map(building => building.id));
    } else {
      setSelectedBuildings([]);
    }
  };

  const handleSelectBuilding = (buildingId: number) => {
    setSelectedBuildings(prev => {
      if (prev.includes(buildingId)) {
        return prev.filter(id => id !== buildingId);
      } else {
        return [...prev, buildingId];
      }
    });
  };

  const handleDelete = async () => {
    if (selectedBuildings.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedBuildings.length} buildings?`)) {
      try {
        await buildingService.deleteBuildings(selectedBuildings);
        alert('Buildings deleted successfully');
        fetchBuildings();
      } catch (err: any) {
        console.error('Failed to delete buildings:', err);
        
        // Handle authentication errors
        if (err.message && err.message.includes('Session expired')) {
          alert('Your session has expired. You will be redirected to the login page.');
          // Redirect to login page
          window.location.href = '/login';
          return;
        }
        
        alert('Failed to delete buildings. Please try again later.');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Buildings Management</h1>
        <Link
          href="/admin/buildings/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Add New Building
        </Link>
      </div>

      {/* Search Form */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Building Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={searchParams.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by name"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <input
              type="text"
              id="district"
              name="district"
              value={searchParams.district}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by district"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 h-10"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Bulk Actions */}
      {selectedBuildings.length > 0 && (
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-medium">{selectedBuildings.length} selected</span>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition duration-300 text-sm"
          >
            Delete Selected
          </button>
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
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-medium mb-2">No buildings found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or add a new building.</p>
          <Link
            href="/admin/buildings/add"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Add New Building
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedBuildings.length === buildings.length && buildings.length > 0}
                      onChange={handleSelectAll}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area (m²)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {buildings.map((building) => (
                  <tr key={building.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedBuildings.includes(building.id)}
                        onChange={() => handleSelectBuilding(building.id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{building.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{building.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>{building.managerName}</div>
                      <div className="text-sm text-gray-500">{building.managerPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{building.floorArea}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${building.rentPrice}/month</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/buildings/${building.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/buildings/${building.id}/edit`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this building?')) {
                              buildingService.deleteBuildings([building.id])
                                .then(() => {
                                  alert('Building deleted successfully');
                                  fetchBuildings();
                                })
                                .catch((err: any) => {
                                  console.error('Failed to delete building:', err);
                                  
                                  // Handle authentication errors
                                  if (err.message && err.message.includes('Session expired')) {
                                    alert('Your session has expired. You will be redirected to the login page.');
                                    // Redirect to login page
                                    window.location.href = '/login';
                                    return;
                                  }
                                  
                                  alert('Failed to delete building');
                                });
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 