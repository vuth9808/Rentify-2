import api from './api';
import { activityService, ActivityTypes, ItemTypes } from './activityService';

// Types based on Spring Boot API
export interface BuildingDTO {
  id?: number;
  name: string;
  street: string;
  ward: string;
  district: string;
  structure?: string;
  numberOfBasement?: number;
  floorArea?: number;
  direction?: string;
  level?: string;
  rentPrice?: number;
  rentPriceDescription?: string;
  serviceFee?: string;
  brokerageFee?: string;
  typeCode?: string[] | string;
  managerName?: string;
  managerPhone?: string;
  image?: string;
  rentAreas?: string[];
}

export interface BuildingSearchRequest {
  name?: string;
  street?: string;
  ward?: string;
  district?: string;
  floorArea?: number;
  rentPriceFrom?: number;
  rentPriceTo?: number;
  managerName?: string;
  managerPhone?: string;
  staffId?: number;
  typeCode?: string[];
}

export interface BuildingSearchResponse {
  id: number;
  name: string;
  address: string;
  managerName: string;
  managerPhone: string;
  floorArea: number;
  rentPrice: number;
  serviceFee: number;
  brokerageFee: number;
}

export interface BuildingStaffAssignmentDTO {
  buildingId: number;
  staffIds: number[];
}

// Hàm lấy dữ liệu từ localStorage hoặc dùng dữ liệu mẫu nếu chưa có
const getStoredBuildings = (): BuildingSearchResponse[] => {
  const storedBuildings = localStorage.getItem('rentify_buildings');
  
  if (storedBuildings) {
    return JSON.parse(storedBuildings);
  }
  
  // Mock buildings data nếu không có dữ liệu trong localStorage
const mockBuildings: BuildingSearchResponse[] = [
  {
    id: 1,
    name: 'Vinhomes Central Park',
    address: '208 Nguyen Huu Canh, Ward 22, Binh Thanh District, Ho Chi Minh City',
    managerName: 'Nguyen Van Manager',
    managerPhone: '0909123456',
    floorArea: 120,
    rentPrice: 1500,
    serviceFee: 100,
    brokerageFee: 75
  },
  {
    id: 2,
    name: 'Landmark 81',
    address: '720A Dien Bien Phu, Ward 22, Binh Thanh District, Ho Chi Minh City',
    managerName: 'Tran Thi Manager',
    managerPhone: '0909123457',
    floorArea: 200,
    rentPrice: 2500,
    serviceFee: 150,
    brokerageFee: 125
  },
  {
    id: 3,
    name: 'Saigon Centre',
    address: '65 Le Loi, Ben Nghe Ward, District 1, Ho Chi Minh City',
    managerName: 'Le Van Manager',
    managerPhone: '0909123458',
    floorArea: 180,
    rentPrice: 2200,
    serviceFee: 130,
    brokerageFee: 110
  }
];
  
  // Lưu dữ liệu vào localStorage
  localStorage.setItem('rentify_buildings', JSON.stringify(mockBuildings));
  
  return mockBuildings;
};

// Hàm lưu dữ liệu vào localStorage
const saveStoredBuildings = (buildings: BuildingSearchResponse[]) => {
  localStorage.setItem('rentify_buildings', JSON.stringify(buildings));
};

// Hàm sinh ID mới
const generateNewId = (buildings: BuildingSearchResponse[]): number => {
  if (buildings.length === 0) return 1;
  const maxId = Math.max(...buildings.map(b => b.id));
  return maxId + 1;
};

// Building API functions
export const buildingService = {
  // Get all buildings with optional search parameters
  getBuildings: async (searchParams?: BuildingSearchRequest) => {
    try {
      const response = await api.get('/api/building', { params: searchParams });
      return response.data;
    } catch {
      console.log('Using local storage data for buildings');
      
      // Lấy dữ liệu từ localStorage
      let buildings = getStoredBuildings();
      
      // Simple filtering based on search params
      if (searchParams) {
        if (searchParams.name) {
          buildings = buildings.filter(b => 
            b.name.toLowerCase().includes(searchParams.name!.toLowerCase())
          );
        }
        
        if (searchParams.district) {
          buildings = buildings.filter(b => 
            b.address.toLowerCase().includes(searchParams.district!.toLowerCase())
          );
        }
        
        // Lọc theo giá thuê từ
        if (searchParams.rentPriceFrom) {
          buildings = buildings.filter(b => 
            b.rentPrice >= searchParams.rentPriceFrom!
          );
        }
        
        // Lọc theo giá thuê đến
        if (searchParams.rentPriceTo) {
          buildings = buildings.filter(b => 
            b.rentPrice <= searchParams.rentPriceTo!
          );
        }

        // Lọc theo diện tích
        if (searchParams.floorArea) {
          buildings = buildings.filter(b => 
            b.floorArea >= searchParams.floorArea!
          );
        }

        // Lọc theo tên người quản lý
        if (searchParams.managerName) {
          buildings = buildings.filter(b => 
            b.managerName.toLowerCase().includes(searchParams.managerName!.toLowerCase())
          );
        }

        // Lọc theo số điện thoại người quản lý
        if (searchParams.managerPhone) {
          buildings = buildings.filter(b => 
            b.managerPhone.includes(searchParams.managerPhone!)
          );
        }
      }
      
      return buildings;
    }
  },

  // Get a building by ID
  getBuildingById: async (id: number) => {
    try {
      const response = await api.get(`/api/building/${id}`);
      return response.data;
    } catch {
      console.log('Using local storage data for building details');
      
      const buildings = getStoredBuildings();
      const building = buildings.find(b => b.id === id);
      
      if (!building) throw new Error('Building not found');
      
      // Convert to more detailed DTO for edit form
      return {
        id: building.id,
        name: building.name,
        street: building.address.split(',')[0],
        ward: building.address.split(',')[1]?.trim() || '',
        district: building.address.split(',')[2]?.trim() || '',
        floorArea: building.floorArea,
        rentPrice: building.rentPrice,
        serviceFee: building.serviceFee.toString(),
        brokerageFee: building.brokerageFee.toString(),
        managerName: building.managerName,
        managerPhone: building.managerPhone,
        structure: 'Reinforced concrete',
        direction: 'South',
        level: 'A',
        typeCode: ['TANG_TRET', 'NGUYEN_CAN'],
        rentAreas: ['50', '100', '150', '200']
      };
    }
  },

  // Create or update a building
  saveBuilding: async (building: BuildingDTO) => {
    try {
      // Convert numeric values to match backend expectations
      const transformedBuilding = {
        ...building,
        floorArea: building.floorArea ? Number(building.floorArea) : null,
        rentPrice: building.rentPrice ? Number(building.rentPrice) : null,
        numberOfBasement: building.numberOfBasement ? Number(building.numberOfBasement) : null,
        // Ensure typeCode is an array if it's a string
        typeCode: typeof building.typeCode === 'string' ? [building.typeCode] : building.typeCode
      };
      
      const response = await api.post('/api/building', transformedBuilding);
      return response.data;
    } catch {
      console.log('Using local storage for building save operation');
      
      const buildings = getStoredBuildings();
      const userName = localStorage.getItem('userName') || 'Admin';
      const userId = Number(localStorage.getItem('userId') || '1');
      
      // Đảm bảo các trường bắt buộc có giá trị hợp lệ
      const serviceFee = parseFloat(building.serviceFee || '0');
      const brokerageFee = parseFloat(building.brokerageFee || '0');
      const floorArea = building.floorArea || 0;
      const rentPrice = building.rentPrice || 0;
      
      // Nếu là cập nhật
      if (building.id) {
        const index = buildings.findIndex(b => b.id === building.id);
        
        if (index !== -1) {
          // Cập nhật tòa nhà hiện có
          buildings[index] = {
            ...buildings[index],
            name: building.name,
            address: `${building.street}, ${building.ward}, ${building.district}`,
            managerName: building.managerName || '',
            managerPhone: building.managerPhone || '',
            floorArea: floorArea,
            rentPrice: rentPrice,
            serviceFee: serviceFee,
            brokerageFee: brokerageFee
          };
          
          // Lưu lại vào localStorage
          saveStoredBuildings(buildings);
          
          // Ghi lại hoạt động
          activityService.addActivity({
            action: ActivityTypes.UPDATED,
            itemType: ItemTypes.BUILDING,
            itemName: building.name,
            userId: userId,
            userName: userName
          });
          
          return buildings[index];
        } else {
          throw new Error('Building not found');
        }
      } else {
        // Tạo mới tòa nhà
        const newId = generateNewId(buildings);
        
        const newBuilding: BuildingSearchResponse = {
          id: newId,
          name: building.name,
          address: `${building.street}, ${building.ward}, ${building.district}`,
          managerName: building.managerName || '',
          managerPhone: building.managerPhone || '',
          floorArea: floorArea,
          rentPrice: rentPrice,
          serviceFee: serviceFee,
          brokerageFee: brokerageFee
        };
        
        // Thêm vào danh sách và lưu lại
        buildings.push(newBuilding);
        saveStoredBuildings(buildings);
        
        // Ghi lại hoạt động
        activityService.addActivity({
          action: ActivityTypes.CREATED,
          itemType: ItemTypes.BUILDING,
          itemName: building.name,
          userId: userId,
          userName: userName
        });
        
        return newBuilding;
      }
    }
  },

  // Delete buildings
  deleteBuildings: async (ids: number[]) => {
    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      // Convert number[] to Long[] format expected by backend
      const idString = ids.join(',');
      const response = await api.delete(`/api/building/${idString}`);
      return response.data;
    } catch (err: unknown) {
      // Check if the error is due to redirection to login (authentication issue)
      if (err instanceof Error && err.message.includes('Session expired')) {
        // Token might be invalid or expired
        localStorage.removeItem('token');
        throw new Error('Session expired. Please log in again.');
      }
      
      console.log('Using local storage for building delete operation');
      
      const buildings = getStoredBuildings();
      const userName = localStorage.getItem('userName') || 'Admin';
      const userId = Number(localStorage.getItem('userId') || '1');
      
      // Lọc ra các tòa nhà sẽ bị xóa để lưu tên cho hoạt động
      const buildingsToDelete = buildings.filter(b => ids.includes(b.id));
      
      // Lọc ra các tòa nhà không bị xóa
      const remainingBuildings = buildings.filter(b => !ids.includes(b.id));
      
      // Lưu lại danh sách đã lọc
      saveStoredBuildings(remainingBuildings);
      
      // Ghi lại hoạt động xóa cho mỗi tòa nhà
      buildingsToDelete.forEach(building => {
        activityService.addActivity({
          action: ActivityTypes.DELETED,
          itemType: ItemTypes.BUILDING,
          itemName: building.name,
          userId: userId,
          userName: userName
        });
      });
      
      return { message: 'Buildings deleted successfully' };
    }
  },

  // Get staff assigned to a building
  getBuildingStaffs: async (id: number) => {
    try {
      const response = await api.get(`/api/building/${id}/staffs`);
      return response.data;
    } catch {
      console.log('Using mock building staff data');
      return [
        { id: 1, fullName: 'Staff One', checked: true },
        { id: 2, fullName: 'Staff Two', checked: false },
        { id: 3, fullName: 'Staff Three', checked: true }
      ];
    }
  },

  // Assign staff to a building
  assignStaffToBuilding: async (assignmentDTO: BuildingStaffAssignmentDTO) => {
    try {
      const response = await api.post('/api/building/assigment', assignmentDTO);
      return response.data;
    } catch {
      console.log('Using mock assignment since API call failed');
      return { success: true };
    }
  }
};

export default buildingService; 