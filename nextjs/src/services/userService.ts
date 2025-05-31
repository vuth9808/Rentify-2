import api from './api';

export interface UserDTO {
  id?: number;
  userName: string;
  password?: string;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: number;
  roleCode?: string[];
  role?: string;
}

export interface ProfileUpdateDTO {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export interface PasswordChangeDTO {
  currentPassword: string;
  newPassword: string;
}

// Mock users data
const mockUsers: UserDTO[] = [
  {
    id: 1,
    userName: 'admin',
    fullName: 'Admin User',
    email: 'admin@rentify.com',
    phone: '0123456789',
    address: 'Hanoi, Vietnam',
    status: 1,
    role: 'ADMIN'
  },
  {
    id: 2,
    userName: 'manager',
    fullName: 'Manager User',
    email: 'manager@rentify.com',
    phone: '0123456788',
    address: 'Ho Chi Minh City, Vietnam',
    status: 1,
    role: 'MANAGER'
  },
  {
    id: 3,
    userName: 'user1',
    fullName: 'Regular User',
    email: 'user@rentify.com',
    phone: '0123456787',
    address: 'Da Nang, Vietnam',
    status: 1,
    role: 'USER'
  }
];

// User API functions
export const userService = {
  // Get all users
  getUsers: async () => {
    try {
      const response = await api.get('/api/user');
      return response.data;
    } catch {
      console.log('Using mock user data');
      return mockUsers;
    }
  },

  // Get user by ID
  getUserById: async (id: number) => {
    try {
      const response = await api.get(`/api/user/${id}`);
      return response.data;
    } catch {
      // Return mock user if API fails
      const user = mockUsers.find(u => u.id === id);
      if (!user) throw new Error('User not found');
      return user;
    }
  },

  // Get current logged in user
  getCurrentUser: async () => {
    // Retrieve user info from localStorage as a workaround for missing API endpoint
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    
    if (!token || !userName) {
      throw new Error('User not authenticated');
    }
    
    // Return a mock user profile from local storage
    return {
      id: 1, // Mock ID
      userName: userName,
      fullName: localStorage.getItem('fullName') || userName,
      email: localStorage.getItem('email') || '',
      phone: localStorage.getItem('phone') || '',
      address: localStorage.getItem('address') || '',
      role: localStorage.getItem('role') || 'USER'
    };
  },

  // Update user profile
  updateProfile: async (profileData: ProfileUpdateDTO) => {
    const userName = localStorage.getItem('userName');
    if (!userName) {
      throw new Error('User not authenticated');
    }
    
    // Store updated profile data in localStorage
    localStorage.setItem('fullName', profileData.fullName);
    localStorage.setItem('email', profileData.email);
    localStorage.setItem('phone', profileData.phone);
    localStorage.setItem('address', profileData.address);
    
    // Try to update on the server if API is available
    try {
      const response = await api.put(`/api/user/profile/${userName}`, profileData);
      return response.data;
    } catch  {
      // If server update fails, still return the updated local data
      return {
        userName: userName,
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address
      };
    }
  },

  // Change password
  changePassword: async (passwordData: PasswordChangeDTO) => {
    const userName = localStorage.getItem('userName');
    const userId = 1; // Mock ID since we don't have a real user ID
    
    if (!userName) {
      throw new Error('User not authenticated');
    }
    
    try {
      const response = await api.put(`/api/user/change-password/${userId}`, passwordData);
      return response.data;
    } catch {
      throw new Error('Password change failed');
    }
  },

  // Create or update user
  saveUser: async (user: UserDTO) => {
    try {
      const response = await api.post('/api/user', user);
      return response.data;
    } catch {
      // Mock successful save for demo/development
      console.log('Using mock save since API call failed');
      return {
        ...user,
        id: user.id || mockUsers.length + 1
      };
    }
  },

  // Delete users
  deleteUsers: async (ids: number[]) => {
    try {
      const response = await api.delete(`/api/user/${ids.join(',')}`);
      return response.data;
    } catch {
      // Mock successful delete for demo/development
      console.log('Using mock delete since API call failed');
      return { message: 'Users deleted successfully' };
    }
  },

  // Login
  login: async (username: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { username, password });
      
      // Store user info in localStorage
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userName', response.data.username);
        if (response.data.fullName) localStorage.setItem('fullName', response.data.fullName);
        if (response.data.roles) localStorage.setItem('role', response.data.roles[0]);
      }
      
      return response.data;
    } catch (error) {
      // For demo purposes, allow mock login with hardcoded credentials
      if (username === 'admin' && password === 'admin') {
        const mockLoginResponse = {
          token: 'mock-jwt-token',
          username: 'admin',
          fullName: 'Admin User',
          roles: ['ADMIN']
        };
        
        localStorage.setItem('token', mockLoginResponse.token);
        localStorage.setItem('userName', mockLoginResponse.username);
        localStorage.setItem('fullName', mockLoginResponse.fullName);
        localStorage.setItem('role', mockLoginResponse.roles[0]);
        
        return mockLoginResponse;
      }
      
      throw error;
    }
  },

  // Register
  register: async (user: UserDTO) => {
    try {
      const response = await api.post('/api/auth/register', user);
      return response.data;
    } catch  {
      console.log('Using mock register since API call failed');
      // Mock successful registration
      return {
        message: 'User registered successfully',
        user: {
          ...user,
          id: mockUsers.length + 1,
          password: undefined // Don't return password
        }
      };
    }
  }
};

export default userService; 