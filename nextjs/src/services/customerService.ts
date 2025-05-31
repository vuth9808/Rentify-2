import api from './api';
import { activityService, ActivityTypes, ItemTypes } from './activityService';

export interface CustomerDTO {
  id?: number;
  fullName: string;
  phone: string;
  email: string;
  company?: string;
  requirement?: string;
  demand?: string;
  note?: string;
  status?: string;
}

export interface CustomerSearchRequest {
  fullName?: string;
  phone?: string;
  email?: string;
  staffId?: number;
}

export interface CustomerSearchResponse {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  demand: string;
  requirement: string;
  status: string;
}

export interface TransactionTypeDTO {
  id?: number;
  code: string;
  value: string;
  note?: string;
  customerId?: number;
}

export interface ContactMessage {
  fullName: string;
  email: string;
  customerPhone?: string;
  note: string;
  subject?: string;
}

export interface CustomerStaffAssignmentDTO {
  customerId: number;
  staffIds: number[];
}

// Hàm lấy dữ liệu từ localStorage hoặc dùng dữ liệu mẫu nếu chưa có
const getStoredCustomers = (): CustomerSearchResponse[] => {
  const storedCustomers = localStorage.getItem('rentify_customers');
  
  if (storedCustomers) {
    return JSON.parse(storedCustomers);
  }
  
  // Mock customers data nếu không có dữ liệu trong localStorage
const mockCustomers: CustomerSearchResponse[] = [
  {
    id: 1,
    fullName: 'Nguyen Van A',
    phone: '0987654321',
    email: 'nguyenvana@example.com',
    demand: 'Office space',
    requirement: 'Minimum 100m², central district',
    status: 'ACTIVE'
  },
  {
    id: 2,
    fullName: 'Tran Thi B',
    phone: '0987654322',
    email: 'tranthib@example.com',
    demand: 'Commercial space',
    requirement: 'Shop front, high foot traffic area',
    status: 'LEAD'
  },
  {
    id: 3,
    fullName: 'Le Van C',
    phone: '0987654323',
    email: 'levanc@example.com',
    demand: 'Warehouse',
    requirement: 'Large storage area, easy truck access',
    status: 'POTENTIAL'
  }
];
  
  // Lưu dữ liệu vào localStorage
  localStorage.setItem('rentify_customers', JSON.stringify(mockCustomers));
  
  return mockCustomers;
};

// Hàm lưu dữ liệu vào localStorage
const saveStoredCustomers = (customers: CustomerSearchResponse[]) => {
  localStorage.setItem('rentify_customers', JSON.stringify(customers));
};

// Hàm sinh ID mới
const generateNewId = (customers: CustomerSearchResponse[]): number => {
  if (customers.length === 0) return 1;
  const maxId = Math.max(...customers.map(c => c.id));
  return maxId + 1;
};

// Customer API functions
export const customerService = {
  // Get all customers with optional search parameters
  getCustomers: async (searchParams?: CustomerSearchRequest) => {
    try {
      const response = await api.get('/api/customer', { params: searchParams });
      return response.data;
    } catch {
      console.log('Using local storage for customer data');
      
      // Lấy dữ liệu từ localStorage
      let customers = getStoredCustomers();
      
      // Simple filtering based on search params
      if (searchParams) {
        if (searchParams.fullName) {
          customers = customers.filter(c => 
            c.fullName.toLowerCase().includes(searchParams.fullName!.toLowerCase())
          );
        }
        if (searchParams.phone) {
          customers = customers.filter(c => 
            c.phone.includes(searchParams.phone!)
          );
        }
        if (searchParams.email) {
          customers = customers.filter(c => 
            c.email.toLowerCase().includes(searchParams.email!.toLowerCase())
          );
        }
      }
      
      return customers;
    }
  },

  // Get a customer by ID
  getCustomerById: async (id: number) => {
    try {
      const response = await api.get(`/api/customer/${id}`);
      return response.data;
    } catch {
      console.log('Using local storage for customer details');
      
      const customers = getStoredCustomers();
      const customer = customers.find(c => c.id === id);
      
      if (!customer) throw new Error('Customer not found');
      
      return {
        id: customer.id,
        fullName: customer.fullName,
        phone: customer.phone,
        email: customer.email,
        demand: customer.demand,
        requirement: customer.requirement,
        status: customer.status,
        company: 'Sample Company',
        note: 'Sample note about the customer'
      };
    }
  },

  // Create or update a customer
  saveCustomer: async (customer: CustomerDTO) => {
    try {
      const response = await api.post('/api/customer', customer);
      return response.data;
    } catch {
      console.log('Using local storage for customer save operation');
      
      const customers = getStoredCustomers();
      const userName = localStorage.getItem('userName') || 'Admin';
      const userId = Number(localStorage.getItem('userId') || '1');
      
      // Nếu là cập nhật
      if (customer.id) {
        const index = customers.findIndex(c => c.id === customer.id);
        
        if (index !== -1) {
          // Cập nhật khách hàng hiện có
          customers[index] = {
            ...customers[index],
            fullName: customer.fullName,
            phone: customer.phone,
            email: customer.email,
            demand: customer.demand || customers[index].demand,
            requirement: customer.requirement || customers[index].requirement,
            status: customer.status || customers[index].status
          };
          
          // Lưu lại vào localStorage
          saveStoredCustomers(customers);
          
          // Ghi lại hoạt động
          activityService.addActivity({
            action: ActivityTypes.UPDATED,
            itemType: ItemTypes.CUSTOMER,
            itemName: customer.fullName,
            userId: userId,
            userName: userName
          });
          
          return customers[index];
        } else {
          throw new Error('Customer not found');
        }
      } else {
        // Tạo mới khách hàng
        const newId = generateNewId(customers);
        
        const newCustomer: CustomerSearchResponse = {
          id: newId,
          fullName: customer.fullName,
          phone: customer.phone,
          email: customer.email,
          demand: customer.demand || '',
          requirement: customer.requirement || '',
          status: customer.status || 'LEAD'
        };
        
        // Thêm vào danh sách và lưu lại
        customers.push(newCustomer);
        saveStoredCustomers(customers);
        
        // Ghi lại hoạt động
        activityService.addActivity({
          action: ActivityTypes.CREATED,
          itemType: ItemTypes.CUSTOMER,
          itemName: customer.fullName,
          userId: userId,
          userName: userName
        });
        
        return newCustomer;
      }
    }
  },

  // Delete customers
  deleteCustomers: async (ids: number[]) => {
    try {
      const response = await api.delete(`/api/customer/${ids.join(',')}`);
      return response.data;
    } catch {
      console.log('Using local storage for customer delete operation');
      
      const customers = getStoredCustomers();
      const userName = localStorage.getItem('userName') || 'Admin';
      const userId = Number(localStorage.getItem('userId') || '1');
      
      // Lọc ra các khách hàng sẽ bị xóa để lưu tên cho hoạt động
      const customersToDelete = customers.filter(c => ids.includes(c.id));
      
      // Lọc ra các khách hàng không bị xóa
      const remainingCustomers = customers.filter(c => !ids.includes(c.id));
      
      // Lưu lại danh sách đã lọc
      saveStoredCustomers(remainingCustomers);
      
      // Ghi lại hoạt động xóa cho mỗi khách hàng
      customersToDelete.forEach(customer => {
        activityService.addActivity({
          action: ActivityTypes.DELETED,
          itemType: ItemTypes.CUSTOMER,
          itemName: customer.fullName,
          userId: userId,
          userName: userName
        });
      });
      
      return { message: 'Customers deleted successfully' };
    }
  },

  // Get staff assigned to a customer
  getCustomerStaffs: async (id: number) => {
    try {
      const response = await api.get(`/api/customer/${id}/staffs`);
      return response.data;
    } catch {
      console.log('Using mock customer staff data since API call failed');
      return [];
    }
  },

  // Assign staff to a customer
  assignStaffToCustomer: async (assignmentDTO: CustomerStaffAssignmentDTO) => {
    try {
      const response = await api.put('/api/customer/customer-assignment', assignmentDTO);
      return response.data;
    } catch {
      console.log('Using mock assignment since API call failed');
      return { success: true };
    }
  },

  // Add transaction type
  addTransactionType: async (transactionType: TransactionTypeDTO) => {
    try {
      const response = await api.post('/api/customer/transaction-type', transactionType);
      return response.data;
    } catch {
      console.log('Using mock transaction type since API call failed');
      return {
        ...transactionType,
        id: Date.now()
      };
    }
  },

  // Get transaction details by ID
  getTransactionDetail: async (id: number) => {
    try {
      const response = await api.get(`/api/customer/${id}/transaction-detail`);
      return response.data;
    } catch {
      console.log('Using mock transaction detail since API call failed');
      return [];
    }
  },

  // Send contact message
  sendContactMessage: async (contactMessage: ContactMessage) => {
    try {
      const response = await api.post('/lien-he', contactMessage);
      return response.data;
    } catch {
      console.log('Using local storage for contact message');
      
      // Lưu tin nhắn vào localStorage để xem sau
      const contactMessages = JSON.parse(localStorage.getItem('rentify_contact_messages') || '[]');
      const newMessage = {
        id: contactMessages.length + 1,
        ...contactMessage,
        createdAt: new Date().toISOString()
      };
      
      contactMessages.push(newMessage);
      localStorage.setItem('rentify_contact_messages', JSON.stringify(contactMessages));
      
      // Ghi lại hoạt động
      const userName = localStorage.getItem('userName') || 'Guest';
      const userId = Number(localStorage.getItem('userId') || '0');
      
      activityService.addActivity({
        action: ActivityTypes.CONTACTED,
        itemType: ItemTypes.MESSAGE,
        itemName: contactMessage.subject || 'Contact Message',
        userId: userId,
        userName: userName
      });
      
      return newMessage;
    }
  }
};

export default customerService; 