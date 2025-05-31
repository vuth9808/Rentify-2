import api from './api';
import { ActivityTypes, ItemTypes } from '../types/activity';
import { activityService } from './activityService';
import { PropertySearchRequest, PropertySearchResponse, PropertyDTO, PropertyStaffAssignmentDTO } from '../types/property';

// Helper functions for local storage
const getStoredProperties = () => {
  return JSON.parse(localStorage.getItem('rentify_properties') || '[]');
};

const saveStoredProperties = (properties: PropertySearchResponse[]) => {
  localStorage.setItem('rentify_properties', JSON.stringify(properties));
};

const generateNewId = (items: { id: number }[]) => {
  return Math.max(0, ...items.map(item => item.id)) + 1;
};

export const propertyService = {
  getProperties: async (searchParams?: PropertySearchRequest) => {
    try {
      const response = await api.get('/api/property', { params: searchParams });
      return response.data;
    } catch {
      console.log('Using local storage for property data');
      
      // Lấy dữ liệu từ localStorage
      let properties = getStoredProperties();
      
      // Simple filtering based on search params
      if (searchParams) {
        if (searchParams.title) {
          properties = properties.filter((p: PropertySearchResponse) => 
            p.title.toLowerCase().includes(searchParams.title!.toLowerCase())
          );
        }
        if (searchParams.type) {
          properties = properties.filter((p: PropertySearchResponse) => 
            p.type === searchParams.type
          );
        }
        if (searchParams.status) {
          properties = properties.filter((p: PropertySearchResponse) => 
            p.status === searchParams.status
          );
        }
        if (searchParams.minPrice) {
          properties = properties.filter((p: PropertySearchResponse) => 
            p.price >= searchParams.minPrice!
          );
        }
        if (searchParams.maxPrice) {
          properties = properties.filter((p: PropertySearchResponse) => 
            p.price <= searchParams.maxPrice!
          );
        }
      }
      
      return properties;
    }
  },

  // Get a property by ID
  getPropertyById: async (id: number) => {
    try {
      const response = await api.get(`/api/property/${id}`);
      return response.data;
    } catch {
      console.log('Using local storage for property details');
      
      const properties = getStoredProperties();
      const property = properties.find((p: PropertySearchResponse) => p.id === id);
      
      if (!property) throw new Error('Property not found');
      
      return {
        ...property,
        description: 'Sample property description',
        features: ['Feature 1', 'Feature 2', 'Feature 3'],
        images: ['/images/property1.jpg', '/images/property2.jpg']
      };
    }
  },

  // Create or update a property
  saveProperty: async (property: PropertyDTO) => {
    try {
      const response = await api.post('/api/property', property);
      return response.data;
    } catch {
      console.log('Using local storage for property save operation');
      
      const properties = getStoredProperties();
      const userName = localStorage.getItem('userName') || 'Admin';
      const userId = Number(localStorage.getItem('userId') || '1');
      
      // Nếu là cập nhật
      if (property.id) {
        const index = properties.findIndex((p: PropertySearchResponse) => p.id === property.id);
        
        if (index !== -1) {
          // Cập nhật property hiện có
          properties[index] = {
            ...properties[index],
            title: property.title,
            type: property.type,
            price: property.price,
            area: property.area,
            address: property.address,
            status: property.status || properties[index].status
          };
          
          // Lưu lại vào localStorage
          saveStoredProperties(properties);
          
          // Ghi lại hoạt động
          activityService.addActivity({
            action: ActivityTypes.UPDATED,
            itemType: ItemTypes.PROPERTY,
            itemName: property.title,
            userId: userId,
            userName: userName
          });
          
          return properties[index];
        } else {
          throw new Error('Property not found');
        }
      } else {
        // Tạo mới property
        const newId = generateNewId(properties);
        
        const newProperty: PropertySearchResponse = {
          id: newId,
          title: property.title,
          type: property.type,
          price: property.price,
          area: property.area,
          address: property.address,
          status: property.status || 'AVAILABLE'
        };
        
        // Thêm vào danh sách và lưu lại
        properties.push(newProperty);
        saveStoredProperties(properties);
        
        // Ghi lại hoạt động
        activityService.addActivity({
          action: ActivityTypes.CREATED,
          itemType: ItemTypes.PROPERTY,
          itemName: property.title,
          userId: userId,
          userName: userName
        });
        
        return newProperty;
      }
    }
  },

  // Delete properties
  deleteProperties: async (ids: number[]) => {
    try {
      const response = await api.delete(`/api/property/${ids.join(',')}`);
      return response.data;
    } catch {
      console.log('Using local storage for property delete operation');
      
      const properties = getStoredProperties();
      const userName = localStorage.getItem('userName') || 'Admin';
      const userId = Number(localStorage.getItem('userId') || '1');
      
      // Lọc ra các property sẽ bị xóa để lưu tên cho hoạt động
      const propertiesToDelete = properties.filter((p: PropertySearchResponse) => ids.includes(p.id));
      
      // Lọc ra các property không bị xóa
      const remainingProperties = properties.filter((p: PropertySearchResponse) => !ids.includes(p.id));
      
      // Lưu lại danh sách đã lọc
      saveStoredProperties(remainingProperties);
      
      // Ghi lại hoạt động xóa cho mỗi property
      propertiesToDelete.forEach((property: PropertySearchResponse) => {
        activityService.addActivity({
          action: ActivityTypes.DELETED,
          itemType: ItemTypes.PROPERTY,
          itemName: property.title,
          userId: userId,
          userName: userName
        });
      });
      
      return { message: 'Properties deleted successfully' };
    }
  },

  // Get staff assigned to a property
  getPropertyStaffs: async (id: number) => {
    try {
      const response = await api.get(`/api/property/${id}/staffs`);
      return response.data;
    } catch {
      console.log('Using mock property staff data since API call failed');
      return [];
    }
  },

  // Assign staff to a property
  assignStaffToProperty: async (assignmentDTO: PropertyStaffAssignmentDTO) => {
    try {
      const response = await api.put('/api/property/property-assignment', assignmentDTO);
      return response.data;
    } catch {
      console.log('Using mock assignment since API call failed');
      return { success: true };
    }
  }
}; 