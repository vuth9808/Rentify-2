export interface PropertySearchRequest {
  title?: string;
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface PropertySearchResponse {
  id: number;
  title: string;
  type: string;
  price: number;
  area: number;
  address: string;
  status: string;
}

export interface PropertyDTO {
  id?: number;
  title: string;
  type: string;
  price: number;
  area: number;
  address: string;
  status?: string;
}

export interface PropertyStaffAssignmentDTO {
  propertyId: number;
  staffId: number;
} 