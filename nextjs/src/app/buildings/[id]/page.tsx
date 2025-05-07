'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { buildingService, BuildingDTO, BuildingSearchResponse } from '@/services/buildingService';

export default function BuildingDetailPage() {
  const params = useParams();
  const buildingId = Number(params.id);
  
  const [building, setBuilding] = useState<BuildingDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        setLoading(true);
        // This is a mock implementation since the API might not have a get by ID endpoint
        // In a real implementation, you would use buildingService.getBuildingById(buildingId)
        const buildings = await buildingService.getBuildings();
        const foundBuilding = buildings.find((b: BuildingSearchResponse) => b.id === buildingId);
        
        if (foundBuilding) {
          // Convert the search response to a full DTO for display
          setBuilding({
            id: foundBuilding.id,
            name: foundBuilding.name,
            street: '',
            ward: '',
            district: '',
            floorArea: foundBuilding.floorArea,
            rentPrice: foundBuilding.rentPrice,
            serviceFee: foundBuilding.serviceFee,
            brokerageFee: foundBuilding.brokerageFee,
            managerName: foundBuilding.managerName,
            managerPhone: foundBuilding.managerPhone,
          });
        } else {
          setError('Building not found');
        }
      } catch (err) {
        console.error('Failed to fetch building details:', err);
        setError('Failed to load building details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (buildingId) {
      fetchBuilding();
    }
  }, [buildingId]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
        </div>
      </div>
    );
  }

  if (error || !building) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error || 'Failed to load building details'}
        </div>
        <Link href="/buildings" className="mt-4 inline-block text-blue-600 hover:underline">
          &larr; Back to all properties
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <Link href="/buildings" className="inline-block mb-6 text-blue-600 hover:underline">
        &larr; Back to all properties
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="relative h-80 w-full">
          <Image
            src={`/building-${(building.id || 1) % 3 + 1}.jpg`}
            alt={building.name}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{building.name}</h1>
              <p className="text-xl">{building.district}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Property Details</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Area</p>
                <p className="font-bold">{building.floorArea} m²</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Rent Price</p>
                <p className="font-bold">${building.rentPrice}/month</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Service Fee</p>
                <p className="font-bold">${building.serviceFee}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Brokerage Fee</p>
                <p className="font-bold">${building.brokerageFee}</p>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3">Description</h3>
            <p className="text-gray-700 mb-6">
              This premium property offers excellent amenities in a prime location. 
              The building features modern architecture, security systems, and facilities 
              designed to meet the needs of businesses and residents alike.
            </p>

            <h3 className="text-xl font-bold mb-3">Features</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li>Modern architecture</li>
              <li>24/7 security</li>
              <li>High-speed internet</li>
              <li>Maintenance services</li>
              <li>Parking spaces</li>
              <li>Central air conditioning</li>
            </ul>

            <h3 className="text-xl font-bold mb-3">Location</h3>
            <p className="text-gray-700">
              {building.street}, {building.ward}, {building.district}
            </p>
          </div>

          {/* Sidebar - Contact */}
          <div className="md:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              <div className="mb-4">
                <p className="text-gray-500">Manager</p>
                <p className="font-bold">{building.managerName}</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-500">Phone</p>
                <p className="font-bold">{building.managerPhone}</p>
              </div>
              <div className="mb-6">
                <p className="text-gray-500">Email</p>
                <p className="font-bold">manager@rentify.com</p>
              </div>

              <button 
                className="w-full bg-blue-900 text-white py-3 px-4 rounded-md hover:bg-blue-800 transition duration-300 mb-3"
              >
                Request a Viewing
              </button>
              <button 
                className="w-full border border-blue-900 text-blue-900 py-3 px-4 rounded-md hover:bg-blue-50 transition duration-300"
              >
                Contact Owner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 