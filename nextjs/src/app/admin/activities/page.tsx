'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { activityService, Activity } from '@/services/activityService';

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all'); // Bộ lọc theo loại hoạt động

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await activityService.getRecentActivities();
      setActivities(data);
      setError(null);
    } catch (err: unknown) {
      console.error('Failed to fetch activities:', err);
      const error = err as Error;
      setError('Failed to load activities. ' + (error.message || 'Please try again later.'));
    } finally {
      setLoading(false);
    }
  };

  // Lọc hoạt động theo loại
  const filteredActivities = typeFilter === 'all' 
    ? activities 
    : activities.filter(activity => activity.itemType === typeFilter);

  // Nhóm các hoạt động theo ngày
  const groupActivitiesByDate = (acts: Activity[]) => {
    const grouped: Record<string, Activity[]> = {};
    
    acts.forEach(activity => {
      const date = new Date(activity.timestamp).toLocaleDateString('vi-VN');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(activity);
    });
    
    return grouped;
  };

  const groupedActivities = groupActivitiesByDate(filteredActivities);
  const sortedDates = Object.keys(groupedActivities).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">System Activities</h1>
        <Link
          href="/admin"
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
            <select
              id="type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Activities</option>
              <option value="Building">Buildings</option>
              <option value="Customer">Customers</option>
              <option value="User">Users</option>
              <option value="Message">Messages</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchActivities}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 h-10"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-medium mb-2">No activities found</h3>
          <p className="text-gray-600 mb-4">There are no recent activities matching your filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map(date => (
            <div key={date} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b">
                <h2 className="text-lg font-semibold text-gray-800">{date}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {groupedActivities[date].map((activity) => (
                      <tr key={activity.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`
                            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${activity.action === 'Created' ? 'bg-green-100 text-green-800' : 
                              activity.action === 'Updated' ? 'bg-blue-100 text-blue-800' : 
                              activity.action === 'Deleted' ? 'bg-red-100 text-red-800' : 
                              activity.action === 'Viewed' ? 'bg-purple-100 text-purple-800' :
                              'bg-yellow-100 text-yellow-800'}
                          `}>
                            {activity.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500 mr-1">{activity.itemType}:</span>
                            <span className="text-sm font-medium">{activity.itemName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{activity.userName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 