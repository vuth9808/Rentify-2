'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { buildingService, BuildingDTO as BaseBuildingDTO, BuildingSearchResponse } from '@/services/buildingService';
import ViewingRequestModal from '@/components/ViewingRequestModal';
import ContactOwnerModal from '@/components/ContactOwnerModal';
import { activityService, ActivityTypes, ItemTypes } from '@/services/activityService';

// Extend BuildingDTO to include address property for our use
interface BuildingDTO extends BaseBuildingDTO {
  address?: string;
}

export default function BuildingDetailPage() {
  const params = useParams();
  const buildingId = Number(params.id);
  
  const [building, setBuilding] = useState<BuildingDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State để kiểm soát việc hiển thị các modal
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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
            street: foundBuilding.address.split(',')[0],
            ward: foundBuilding.address.split(',')[1]?.trim() || '',
            district: foundBuilding.address.split(',')[2]?.trim() || '',
            floorArea: foundBuilding.floorArea,
            rentPrice: foundBuilding.rentPrice,
            serviceFee: foundBuilding.serviceFee,
            brokerageFee: foundBuilding.brokerageFee,
            managerName: foundBuilding.managerName,
            managerPhone: foundBuilding.managerPhone,
            address: foundBuilding.address
          });
          
          // Ghi lại hoạt động xem tòa nhà
          try {
            const userName = localStorage.getItem('userName') || 'Guest';
            const userId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : 0;
            
            // Ghi lại hoạt động
            await activityService.addActivity({
              action: 'Viewed',
              itemType: ItemTypes.BUILDING,
              itemName: foundBuilding.name,
              userId: userId,
              userName: userName
            });
          } catch (logErr) {
            console.error('Failed to log activity:', logErr);
            // Không hiển thị lỗi này cho người dùng
          }
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

  // Hàm xử lý khi click vào Request a Viewing
  const handleRequestViewing = () => {
    // Ghi lại hành động
    try {
      const userName = localStorage.getItem('userName') || 'Guest';
      const userId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : 0;
      
      if (building) {
        activityService.addActivity({
          action: ActivityTypes.CONTACTED,
          itemType: ItemTypes.BUILDING,
          itemName: building.name,
          userId: userId,
          userName: userName
        });
      }
    } catch (logErr) {
      console.error('Failed to log activity:', logErr);
    }
    
    // Mở modal
    setIsViewingModalOpen(true);
  };

  // Hàm xử lý khi click vào Contact Owner
  const handleContactOwner = () => {
    // Ghi lại hành động
    try {
      const userName = localStorage.getItem('userName') || 'Guest';
      const userId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : 0;
      
      if (building) {
        activityService.addActivity({
          action: ActivityTypes.CONTACTED,
          itemType: ItemTypes.BUILDING,
          itemName: building.name,
          userId: userId,
          userName: userName
        });
      }
    } catch (logErr) {
      console.error('Failed to log activity:', logErr);
    }
    
    // Mở modal
    setIsContactModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
            <p className="ml-4 text-gray-600">Đang tải thông tin tòa nhà...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !building) {
    return (
      <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12">
          <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Lỗi</h3>
            <p>{error || 'Không thể tải thông tin tòa nhà'}</p>
          </div>
          <Link href="/buildings" className="mt-6 inline-block px-6 py-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-all duration-300">
            &larr; Quay lại danh sách tòa nhà
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero header */}
      <div className="relative w-full h-[500px]">
          <Image
            src={`/building-${(building.id || 1) % 3 + 1}.jpg`}
            alt={building.name}
            fill
            style={{ objectFit: "cover" }}
            priority
          className="brightness-[0.85]"
          />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="container mx-auto px-6 h-full flex flex-col justify-end pb-10">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg inline-block max-w-2xl">
              <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full mb-3 inline-block">
                Tòa nhà thương mại
              </span>
              <h1 className="text-4xl font-bold text-white mb-2">{building.name}</h1>
              <p className="text-xl text-white/90 mb-4">{building.district}</p>
              <div className="flex flex-wrap gap-4 mb-2">
                <div className="bg-blue-900/70 text-white px-4 py-2 rounded-md backdrop-blur-sm">
                  <p className="text-sm opacity-80">Diện tích</p>
                  <p className="font-bold text-lg">{building.floorArea} m²</p>
                </div>
                <div className="bg-blue-900/70 text-white px-4 py-2 rounded-md backdrop-blur-sm">
                  <p className="text-sm opacity-80">Giá thuê</p>
                  <p className="font-bold text-lg">${building.rentPrice}/tháng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-10 relative z-10">
        <Link href="/buildings" className="inline-block mb-6 text-white bg-blue-900 px-4 py-2 rounded-md hover:bg-blue-800 transition-all duration-300 shadow-lg">
          &larr; Quay lại danh sách tòa nhà
        </Link>
        </div>

      <div className="container mx-auto px-6 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">Thông tin chi tiết</h2>
            
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <p className="text-sm text-gray-500">Diện tích</p>
                    <p className="font-bold text-xl">{building.floorArea} m²</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <p className="text-sm text-gray-500">Giá thuê</p>
                    <p className="font-bold text-xl">${building.rentPrice}/tháng</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <p className="text-sm text-gray-500">Phí dịch vụ</p>
                    <p className="font-bold text-xl">${building.serviceFee}</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <p className="text-sm text-gray-500">Phí môi giới</p>
                    <p className="font-bold text-xl">${building.brokerageFee}</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-4">Mô tả</h3>
                <p className="text-gray-700 mb-8 leading-relaxed">
                  Tòa nhà cao cấp này cung cấp tiện nghi tuyệt vời ở vị trí đắc địa. 
                  Tòa nhà có kiến trúc hiện đại, hệ thống an ninh và các tiện ích 
                  được thiết kế để đáp ứng nhu cầu của doanh nghiệp và cư dân.
                </p>

                <h3 className="text-xl font-bold text-gray-800 mb-4">Tiện ích</h3>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    <span className="text-gray-700">Kiến trúc hiện đại</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    <span className="text-gray-700">An ninh 24/7</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    <span className="text-gray-700">Internet tốc độ cao</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    <span className="text-gray-700">Dịch vụ bảo trì</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    <span className="text-gray-700">Bãi đậu xe</span>
              </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    <span className="text-gray-700">Điều hòa trung tâm</span>
              </div>
              </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Vị trí</h3>
            <p className="text-gray-700 mb-6">
                  {building.address || `${building.street}, ${building.ward}, ${building.district}`}
                </p>
                
                {/* Google Maps iframe */}
                <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
                  <iframe 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(building.address || `${building.name}, ${building.district}, Ho Chi Minh City`)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map location of ${building.name}`}
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-6">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Thông tin liên hệ</h3>
                <div className="mb-5">
                  <p className="text-gray-500 mb-1">Người quản lý</p>
                  <p className="font-bold text-gray-900">{building.managerName}</p>
              </div>
                <div className="mb-5">
                  <p className="text-gray-500 mb-1">Số điện thoại</p>
                  <p className="font-bold text-gray-900">{building.managerPhone}</p>
              </div>
                <div className="mb-8">
                  <p className="text-gray-500 mb-1">Email</p>
                  <p className="font-bold text-gray-900">manager@rentify.com</p>
              </div>

                <div className="space-y-4">
              <button 
                    className="w-full bg-blue-900 text-white py-3 px-4 rounded-md hover:bg-blue-800 transition-all duration-300 font-medium flex items-center justify-center"
                    onClick={handleRequestViewing}
              >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Đặt lịch xem nhà
              </button>
              <button 
                    className="w-full border-2 border-blue-900 text-blue-900 py-3 px-4 rounded-md hover:bg-blue-50 transition-all duration-300 font-medium flex items-center justify-center"
                    onClick={handleContactOwner}
              >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Liên hệ chủ nhà
              </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ViewingRequestModal 
        isOpen={isViewingModalOpen}
        onClose={() => setIsViewingModalOpen(false)}
        propertyId={building.id || 0}
        propertyName={building.name}
      />

      <ContactOwnerModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        propertyId={building.id || 0}
        propertyName={building.name}
        ownerName={building.managerName || 'Owner'}
      />
    </div>
  );
} 