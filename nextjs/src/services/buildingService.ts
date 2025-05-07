import api from './api';

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

// Mock buildings data
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

// Building API functions
export const buildingService = {
  // Get all buildings with optional search parameters
  getBuildings: async (searchParams?: BuildingSearchRequest) => {
    try {
      const response = await api.get('/api/building', { params: searchParams });
      return response.data;
    } catch (error) {
      console.log('Using mock building data');
      
      // Simple filtering based on search params
      let filteredBuildings = [...mockBuildings];
      
      if (searchParams) {
        if (searchParams.name) {
          filteredBuildings = filteredBuildings.filter(b => 
            b.name.toLowerCase().includes(searchParams.name!.toLowerCase())
          );
        }
        if (searchParams.district) {
          filteredBuildings = filteredBuildings.filter(b => 
            b.address.toLowerCase().includes(searchParams.district!.toLowerCase())
          );
        }
      }
      
      return filteredBuildings;
    }
  },

  // Get a building by ID
  getBuildingById: async (id: number) => {
    try {
      const response = await api.get(`/api/building/${id}`);
      return response.data;
    } catch (error) {
      console.log('Using mock building detail data');
      const building = mockBuildings.find(b => b.id === id);
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
        serviceFee: building.serviceFee,
        brokerageFee: building.brokerageFee,
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
    } catch (error) {
      console.log('Using mock save since API call failed');
      return {
        ...building,
        id: building.id || mockBuildings.length + 1
      };
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
    } catch (error: any) {
      // Check if the error is due to redirection to login (authentication issue)
      if (error.response && error.response.status === 405 && error.config.url.includes('/login')) {
        // Token might be invalid or expired
        localStorage.removeItem('token');
        throw new Error('Session expired. Please log in again.');
      }
      
      console.log('Using mock delete since API call failed');
      return { message: 'Buildings deleted successfully' };
    }
  },

  // Get staff assigned to a building
  getBuildingStaffs: async (id: number) => {
    try {
      const response = await api.get(`/api/building/${id}/staffs`);
      return response.data;
    } catch (error) {
      console.log('Using mock building staff data');
      return [
        { id: 1, fullName: 'Staff One', checked: true },
        { id: 2, fullName: 'Staff Two', checked: false },
        { id: 3, fullName: 'Staff Three', checked: true }
      ];
    }
  },

  // Assign staff to a building
  assignStaffToBuilding: async (assignmentDTO: any) => {
    try {
      const response = await api.post('/api/building/assigment', assignmentDTO);
      return response.data;
    } catch (error) {
      console.log('Using mock assignment since API call failed');
      return { success: true };
    }
  }
};

export default buildingService; 