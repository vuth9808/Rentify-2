export enum ActivityTypes {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  CONTACTED = 'CONTACTED'
}

export enum ItemTypes {
  PROPERTY = 'PROPERTY',
  CUSTOMER = 'CUSTOMER',
  MESSAGE = 'MESSAGE'
}

export interface Activity {
  id: number;
  action: ActivityTypes;
  itemType: ItemTypes;
  itemName: string;
  userId: number;
  userName: string;
  createdAt: string;
} 