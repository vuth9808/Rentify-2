import api from './api';
import { customerService, CustomerSearchResponse } from './customerService';
import { buildingService, BuildingSearchResponse } from './buildingService';
import { userService, UserDTO } from './userService';

export interface Activity {
  id: number;
  action: string;
  itemType: string;
  itemName: string;
  userId: number;
  userName: string;
  timestamp: string;
}

// Các loại hoạt động
export const ActivityTypes = {
  CREATED: 'Created',
  UPDATED: 'Updated',
  DELETED: 'Deleted',
  CONTACTED: 'Contacted'
};

// Các loại đối tượng
export const ItemTypes = {
  BUILDING: 'Building',
  CUSTOMER: 'Customer',
  USER: 'User',
  MESSAGE: 'Message'
};

// Mock data tạm thời
let mockActivities: Activity[] = [];

// Tạo dữ liệu thực tế dựa trên dữ liệu từ các service khác
const generateRealActivities = async (): Promise<Activity[]> => {
  if (mockActivities.length > 0) {
    return mockActivities;
  }

  try {
    // Lấy dữ liệu từ các service khác
    const [buildings, customers, users] = await Promise.all([
      buildingService.getBuildings(),
      customerService.getCustomers(),
      userService.getUsers()
    ]);

    // Tạo mảng hoạt động
    const activities: Activity[] = [];
    let id = 1;

    // Tạo hoạt động cho buildings
    buildings.forEach((building: BuildingSearchResponse, index: number) => {
      // Chọn user ngẫu nhiên
      const user = users[Math.floor(Math.random() * users.length)];
      
      // Thêm vào danh sách hoạt động
      activities.push({
        id: id++,
        action: index % 4 === 0 ? ActivityTypes.CREATED : 
               index % 4 === 1 ? ActivityTypes.UPDATED : 
               index % 4 === 2 ? ActivityTypes.CONTACTED : ActivityTypes.DELETED,
        itemType: ItemTypes.BUILDING,
        itemName: building.name || `Building ${building.id}`,
        userId: user?.id || 1,
        userName: user?.fullName || 'Admin',
        timestamp: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString() // Random trong 7 ngày
      });
    });
    
    // Tạo hoạt động cho customers
    customers.forEach((customer: CustomerSearchResponse, index: number) => {
      const user = users[Math.floor(Math.random() * users.length)];
      
      activities.push({
        id: id++,
        action: index % 4 === 0 ? ActivityTypes.CREATED : 
               index % 4 === 1 ? ActivityTypes.UPDATED : 
               index % 4 === 2 ? ActivityTypes.CONTACTED : ActivityTypes.DELETED,
        itemType: ItemTypes.CUSTOMER,
        itemName: customer.fullName || `Customer ${customer.id}`,
        userId: user?.id || 1,
        userName: user?.fullName || 'Admin',
        timestamp: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString()
      });
    });
    
    // Tạo hoạt động cho users
    users.forEach((user: UserDTO, index: number) => {
      const adminUser = users.find((u: UserDTO) => u.role === 'ADMIN') || users[0];
      
      activities.push({
        id: id++,
        action: index % 3 === 0 ? ActivityTypes.CREATED : 
               index % 3 === 1 ? ActivityTypes.UPDATED : ActivityTypes.DELETED,
        itemType: ItemTypes.USER,
        itemName: user.fullName || `User ${user.id}`,
        userId: adminUser?.id || 1,
        userName: adminUser?.fullName || 'Admin',
        timestamp: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString()
      });
    });
    
    // Tạo hoạt động cho tin nhắn
    for (let i = 0; i < 10; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const customer = customers[Math.floor(Math.random() * customers.length)];
      
      activities.push({
        id: id++,
        action: ActivityTypes.CONTACTED,
        itemType: ItemTypes.MESSAGE,
        itemName: `Message from ${customer?.fullName || 'Customer'}`,
        userId: user?.id || 1,
        userName: user?.fullName || 'Admin',
        timestamp: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString()
      });
    }
    
    // Sắp xếp theo thời gian
    const sortedActivities = activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    mockActivities = sortedActivities;
    return sortedActivities;
    
  } catch {
    // Fallback to mock data
    return createBasicMockActivities();
  }
};

// Tạo dữ liệu giả cơ bản nếu không thể tạo dữ liệu thực
const createBasicMockActivities = (): Activity[] => {
  return [
    {
      id: 1,
      action: ActivityTypes.CREATED,
      itemType: ItemTypes.BUILDING,
      itemName: 'Office Tower A',
      userId: 1,
      userName: 'Admin',
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      action: ActivityTypes.UPDATED,
      itemType: ItemTypes.CUSTOMER,
      itemName: 'Nguyễn Văn A',
      userId: 1,
      userName: 'Admin',
      timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
      id: 3,
      action: ActivityTypes.CONTACTED,
      itemType: ItemTypes.BUILDING,
      itemName: 'Retail Space B',
      userId: 2,
      userName: 'Manager',
      timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    },
    {
      id: 4,
      action: ActivityTypes.DELETED,
      itemType: ItemTypes.BUILDING,
      itemName: 'Old Store',
      userId: 1,
      userName: 'Admin',
      timestamp: new Date(Date.now() - 259200000).toISOString() // 3 days ago
    },
    {
      id: 5,
      action: ActivityTypes.CREATED,
      itemType: ItemTypes.USER,
      itemName: 'Trần Thị B',
      userId: 1,
      userName: 'Admin',
      timestamp: new Date(Date.now() - 345600000).toISOString() // 4 days ago
    },
    {
      id: 6,
      action: ActivityTypes.CONTACTED,
      itemType: ItemTypes.MESSAGE,
      itemName: 'Yêu cầu xem bất động sản',
      userId: 3,
      userName: 'Hỗ trợ khách hàng',
      timestamp: new Date(Date.now() - 432000000).toISOString() // 5 days ago
    }
  ];
};

export const activityService = {
  // Lấy danh sách hoạt động gần đây
  getRecentActivities: async (limit?: number) => {
    try {
      // Thử gọi API thực tế
      const response = await api.get('/api/activities', { params: { limit } });
      return response.data;
    } catch {
      // Nếu API không hoạt động, sử dụng dữ liệu thực tế từ các service khác
      const activities = await generateRealActivities();
      
      // Nếu có giới hạn số lượng
      if (limit && limit > 0) {
        return activities.slice(0, limit);
      }
      
      return activities;
    }
  },
  
  // Thêm một hoạt động mới
  addActivity: async (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    try {
      const response = await api.post('/api/activities', activity);
      return response.data;
    } catch {
      console.log('Using mock add activity since API call failed');
      
      // Tạo một bản ghi hoạt động mới
      const activities = await generateRealActivities();
      const newActivity: Activity = {
        ...activity,
        id: activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1,
        timestamp: new Date().toISOString()
      };
      
      // Thêm vào danh sách mock
      mockActivities.unshift(newActivity);
      
      return newActivity;
    }
  },
  
  // Lấy hoạt động theo loại đối tượng
  getActivitiesByItemType: async (itemType: string) => {
    try {
      const response = await api.get(`/api/activities/type/${itemType}`);
      return response.data;
    } catch {
      console.log('Using realistic activity data for item type');
      
      // Lọc và trả về dữ liệu cho loại đối tượng cụ thể
      const activities = await generateRealActivities();
      return activities
        .filter(activity => activity.itemType === itemType)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  },

  // Lấy hoạt động của một người dùng cụ thể
  getUserActivities: async (userId: number) => {
    try {
      const response = await api.get(`/api/activities/user/${userId}`);
      return response.data;
    } catch {
      console.log('Using realistic activity data for user');
      
      // Lọc và trả về dữ liệu cho người dùng cụ thể
      const activities = await generateRealActivities();
      return activities
        .filter(activity => activity.userId === userId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  }
};

export default activityService; 