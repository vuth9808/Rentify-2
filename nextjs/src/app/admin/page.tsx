'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { buildingService } from '@/services/buildingService';
import { customerService } from '@/services/customerService';
import { userService } from '@/services/userService';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    buildings: 0,
    customers: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch data in parallel
        const [buildings, customers, users] = await Promise.all([
          buildingService.getBuildings(),
          customerService.getCustomers(),
          userService.getUsers()
        ]);
        
        setStats({
          buildings: buildings.length,
          customers: customers.length,
          users: users.length,
        });
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-800 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Buildings</p>
                  <p className="text-2xl font-bold">{stats.buildings}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  href="/admin/buildings"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View all buildings &rarr;
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-800 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Customers</p>
                  <p className="text-2xl font-bold">{stats.customers}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  href="/admin/customers"
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  View all customers &rarr;
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-800 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Users</p>
                  <p className="text-2xl font-bold">{stats.users}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  href="/admin/users"
                  className="text-purple-600 hover:text-purple-800 text-sm"
                >
                  View all users &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Added</td>
                    <td className="px-6 py-4 whitespace-nowrap">New Building: Office Tower A</td>
                    <td className="px-6 py-4 whitespace-nowrap">Admin</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date().toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Updated</td>
                    <td className="px-6 py-4 whitespace-nowrap">Customer: John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap">Admin</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(Date.now() - 86400000).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Deleted</td>
                    <td className="px-6 py-4 whitespace-nowrap">Building: Old Store</td>
                    <td className="px-6 py-4 whitespace-nowrap">Admin</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(Date.now() - 172800000).toLocaleDateString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link 
                href="/admin/buildings/add"
                className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg flex items-center transition duration-300"
              >
                <div className="mr-3 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span>Add Building</span>
              </Link>
              
              <Link 
                href="/admin/customers/add"
                className="bg-green-50 hover:bg-green-100 p-4 rounded-lg flex items-center transition duration-300"
              >
                <div className="mr-3 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span>Add Customer</span>
              </Link>
              
              <Link 
                href="/admin/users/add"
                className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg flex items-center transition duration-300"
              >
                <div className="mr-3 text-purple-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span>Add User</span>
              </Link>
              
              <Link 
                href="/admin/settings"
                className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex items-center transition duration-300"
              >
                <div className="mr-3 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 