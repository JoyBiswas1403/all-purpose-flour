export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Event {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'swappable' | 'swapped';
  createdAt: string;
  updatedAt: string;
}

export interface SwapRequest {
  id: string;
  requesterId: string;
  targetId: string;
  requesterEventId: string;
  targetEventId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
  requester?: User;
  target?: User;
  requesterEvent?: Event;
  targetEvent?: Event;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface CreateEventDto {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
}

export interface UpdateEventStatusDto {
  status: 'scheduled' | 'swappable';
}