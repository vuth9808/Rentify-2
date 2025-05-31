'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { buildingService } from '../../services/buildingService';
import { customerService } from '../../services/customerService';
import { userService } from '../../services/userService';
import { activityService, Activity, ActivityTypes, ItemTypes } from '../../services/activityService';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    buildings: 0,
    customers: 0,
    users: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch data in parallel
        const [buildings, customers, users, recentActivities] = await Promise.all([
          buildingService.getBuildings(),
          customerService.getCustomers(),
          userService.getUsers(),
          activityService.getRecentActivities(30) // Lấy 30 hoạt động gần đây nhất để có đủ dữ liệu cho biểu đồ
        ]);
        
        setStats({
          buildings: buildings.length,
          customers: customers.length,
          users: users.length,
        });
        
        setActivities(recentActivities);
        
        setError(null);
      } catch (err: unknown) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare data for action type chart
  const prepareActionTypeChartData = () => {
    // Count activities by action type
    const actionCounts = {
      [ActivityTypes.CREATED]: 0,
      [ActivityTypes.UPDATED]: 0,
      [ActivityTypes.DELETED]: 0,
      [ActivityTypes.CONTACTED]: 0,
    };

    activities.forEach(activity => {
      if (actionCounts[activity.action] !== undefined) {
        actionCounts[activity.action]++;
      }
    });

    return {
      labels: Object.keys(actionCounts),
      datasets: [
        {
          label: 'Activities by Action',
          data: Object.values(actionCounts),
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',  // Created - Green
            'rgba(54, 162, 235, 0.6)',  // Updated - Blue
            'rgba(255, 99, 132, 0.6)',  // Deleted - Red
            'rgba(255, 206, 86, 0.6)',  // Contacted - Yellow
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare data for item type chart
  const prepareItemTypeChartData = () => {
    // Count activities by item type
    const typeCounts = {
      [ItemTypes.BUILDING]: 0,
      [ItemTypes.CUSTOMER]: 0,
      [ItemTypes.USER]: 0,
      [ItemTypes.MESSAGE]: 0,
    };

    activities.forEach(activity => {
      if (typeCounts[activity.itemType] !== undefined) {
        typeCounts[activity.itemType]++;
      }
    });

    return {
      labels: Object.keys(typeCounts),
      datasets: [
        {
          label: 'Activities by Type',
          data: Object.values(typeCounts),
          backgroundColor: [
            'rgba(153, 102, 255, 0.6)', // Building - Purple
            'rgba(255, 159, 64, 0.6)',  // Customer - Orange
            'rgba(54, 162, 235, 0.6)',  // User - Blue 
            'rgba(255, 206, 86, 0.6)',  // Message - Yellow
          ],
          borderColor: [
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare data for activity timeline chart
  const prepareTimelineChartData = () => {
    // Group activities by day
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }).reverse(); // Oldest to newest

    // Initialize data with 0 counts
    interface DailyDataItem {
      date: string;
      count: number;
    }
    
    const dailyData: Record<string, DailyDataItem> = last7Days.reduce((acc, date) => {
      acc[date] = { 
        date, 
        count: 0 
      };
      return acc;
    }, {} as Record<string, DailyDataItem>);

    // Count activities by day
    activities.forEach(activity => {
      const date = new Date(activity.timestamp).toISOString().split('T')[0];
      if (dailyData[date]) {
        dailyData[date].count++;
      }
    });

    const sortedDates = Object.values(dailyData).sort((a: DailyDataItem, b: DailyDataItem) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Format dates for display (DD/MM)
    const labels = sortedDates.map((item: DailyDataItem) => {
      const date = new Date(item.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Activities per Day',
          data: sortedDates.map((item: DailyDataItem) => item.count),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
          fill: true,
        },
      ],
    };
  };

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

          {/* Activity Charts */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Activity Analysis</h2>
              <Link 
                href="/admin/activities"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View all activities &rarr;
              </Link>
            </div>
            
            {activities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-center">Activities by Action Type</h3>
                  <div className="h-64">
                    <Pie 
                      data={prepareActionTypeChartData()} 
                      options={{ 
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          }
                        }
                      }} 
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-center">Activities by Item Type</h3>
                  <div className="h-64">
                    <Bar 
                      data={prepareItemTypeChartData()} 
                      options={{ 
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        }
                      }} 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No activity data available for analysis
              </div>
            )}
          </div>
          
          {/* Activity Timeline */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4">Activity Timeline (Last 7 Days)</h2>
            {activities.length > 0 ? (
              <div className="h-64">
                <Line 
                  data={prepareTimelineChartData()} 
                  options={{ 
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    }
                  }} 
                />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No activity data available for timeline
              </div>
            )}
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