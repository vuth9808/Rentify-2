'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/userService';

// Định nghĩa interface cho thông tin người dùng
interface UserProfile {
  id: number;
  username?: string;
  userName?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  role?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Lấy thông tin người dùng
    fetchUserProfile();
  }, [router]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await userService.getCurrentUser();
      
      // Map the userData to match our UserProfile interface
      const userProfile: UserProfile = {
        id: userData.id,
        username: userData.userName,
        userName: userData.userName,
        email: userData.email,
        fullName: userData.fullName,
        phone: userData.phone,
        address: userData.address,
        role: userData.role
      };
      
      setProfile(userProfile);
      setFormData({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError('Không thể tải thông tin người dùng. Bạn có thể cần đăng nhập lại.');
      // Redirect to login if authentication error
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Cập nhật thông tin người dùng
      const updatedProfile = await userService.updateProfile({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      });

      // Update the form data and profile with the returned values
      if (profile) {
        setProfile({
          ...profile,
          fullName: updatedProfile.fullName,
          email: updatedProfile.email,
          phone: updatedProfile.phone,
          address: updatedProfile.address
        });
      }

      setSuccess('Thông tin cá nhân đã được cập nhật thành công!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Kiểm tra mật khẩu mới và xác nhận mật khẩu
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
        setSaving(false);
        return;
      }

      // Đổi mật khẩu
      await userService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setSuccess('Mật khẩu đã được thay đổi thành công!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      console.error('Failed to change password:', err);
      setError('Không thể thay đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.');
    } finally {
      setSaving(false);
    }
  };

  // Nếu đang tải
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow overflow-hidden">
          <div className="md:flex">
            {/* Sidebar */}
            <div className="bg-blue-900 text-white md:w-64 p-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 text-3xl font-bold mx-auto mb-3">
                  {profile?.fullName?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                </div>
                <h3 className="text-xl font-bold">{profile?.fullName || profile?.username}</h3>
                <p className="text-blue-200 text-sm">{profile?.role}</p>
              </div>
              
              <nav>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left py-2 px-4 rounded mb-2 flex items-center ${activeTab === 'profile' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Thông tin cá nhân
                </button>
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left py-2 px-4 rounded mb-2 flex items-center ${activeTab === 'security' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Bảo mật
                </button>
                <button 
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full text-left py-2 px-4 rounded mb-2 flex items-center ${activeTab === 'favorites' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Danh sách yêu thích
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`w-full text-left py-2 px-4 rounded mb-2 flex items-center ${activeTab === 'history' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Lịch sử xem
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {success}
                </div>
              )}
              
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Họ và tên</label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        {saving ? 'Đang lưu...' : 'Cập nhật thông tin'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Thay đổi mật khẩu</h2>
                  <form onSubmit={handlePasswordChange}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        {saving ? 'Đang lưu...' : 'Đổi mật khẩu'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {activeTab === 'favorites' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Danh sách yêu thích</h2>
                  <div className="bg-gray-100 text-gray-600 rounded-lg p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <p className="mb-4">Bạn chưa có bất động sản nào trong danh sách yêu thích.</p>
                    <a href="/properties" className="text-blue-900 hover:underline">Khám phá bất động sản</a>
                  </div>
                </div>
              )}
              
              {activeTab === 'history' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Lịch sử xem</h2>
                  <div className="bg-gray-100 text-gray-600 rounded-lg p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mb-4">Bạn chưa xem bất động sản nào gần đây.</p>
                    <a href="/properties" className="text-blue-900 hover:underline">Khám phá bất động sản</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 