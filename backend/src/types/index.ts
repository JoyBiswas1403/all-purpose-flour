export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  status: EventStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SwapRequest {
  id: string;
  requesterId: string;
  requesterSlotId: string;
  targetUserId: string;
  targetSlotId: string;
  status: SwapStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum EventStatus {
  BUSY = 'BUSY',
  SWAPPABLE = 'SWAPPABLE',
  SWAP_PENDING = 'SWAP_PENDING'
}

export enum SwapStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: User;
}

export interface CreateEventDto {
  title: string;
  startTime: string;
  endTime: string;
  status?: EventStatus;
}

export interface UpdateEventDto {
  title?: string;
  startTime?: string;
  endTime?: string;
  status?: EventStatus;
}

export interface CreateSwapRequestDto {
  mySlotId: string;
  theirSlotId: string;
}

export interface SwapResponseDto {
  accept: boolean;
}