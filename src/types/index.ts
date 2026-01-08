export interface User {
  id: string;
  name: string;
  email: string;
  role: 'parent' | 'sitter' | 'both';
  avatar?: string;
  bio?: string;
  location: string;
  verified: boolean;
  premium: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface Listing {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'offering' | 'seeking';
  petTypes: string[];
  location: string;
  distance?: number;
  price?: number;
  images?: string[];
  availability?: string[];
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Booking {
  id: string;
  parentId: string;
  sitterId: string;
  petName: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
