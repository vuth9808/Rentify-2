import api from './api';

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

// Mock customers data
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

// Customer API functions
export const customerService = {
  // Get all customers with optional search parameters
  getCustomers: async (searchParams?: CustomerSearchRequest) => {
    try {
      const response = await api.get('/api/customer', { params: searchParams });
      return response.data;
    } catch (error) {
      console.log('Using mock customer data');
      
      // Simple filtering based on search params
      let filteredCustomers = [...mockCustomers];
      
      if (searchParams) {
        if (searchParams.fullName) {
          filteredCustomers = filteredCustomers.filter(c => 
            c.fullName.toLowerCase().includes(searchParams.fullName!.toLowerCase())
          );
        }
        if (searchParams.phone) {
          filteredCustomers = filteredCustomers.filter(c => 
            c.phone.includes(searchParams.phone!)
          );
        }
        if (searchParams.email) {
          filteredCustomers = filteredCustomers.filter(c => 
            c.email.toLowerCase().includes(searchParams.email!.toLowerCase())
          );
        }
      }
      
      return filteredCustomers;
    }
  },

  // Create or update a customer
  saveCustomer: async (customer: CustomerDTO) => {
    try {
      const response = await api.post('/api/customer', customer);
      return response.data;
    } catch (error) {
      console.log('Using mock save since API call failed');
      return {
        ...customer,
        id: customer.id || mockCustomers.length + 1,
        status: customer.status || 'LEAD'
      };
    }
  },

  // Delete customers
  deleteCustomers: async (ids: number[]) => {
    try {
      const response = await api.delete(`/api/customer/${ids.join(',')}`);
      return response.data;
    } catch (error) {
      console.log('Using mock delete since API call failed');
      return { message: 'Customers deleted successfully' };
    }
  },

  // Get staff assigned to a customer
  getCustomerStaffs: async (id: number) => {
    try {
      const response = await api.get(`/api/customer/${id}/staffs`);
      return response.data;
    } catch (error) {
      console.log('Using mock customer staff data since API call failed');
      return [];
    }
  },

  // Assign staff to a customer
  assignStaffToCustomer: async (assignmentDTO: any) => {
    try {
      const response = await api.put('/api/customer/customer-assignment', assignmentDTO);
      return response.data;
    } catch (error) {
      console.log('Using mock assignment since API call failed');
      return { success: true };
    }
  },

  // Add transaction type
  addTransactionType: async (transactionType: TransactionTypeDTO) => {
    try {
      const response = await api.post('/api/customer/transaction-type', transactionType);
      return response.data;
    } catch (error) {
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
    } catch (error) {
      console.log('Using mock transaction detail since API call failed');
      return [];
    }
  }
};

export default customerService; 