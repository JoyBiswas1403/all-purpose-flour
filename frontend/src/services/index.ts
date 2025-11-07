import api from './api';
import type { AuthResponse, LoginDto, RegisterDto, Event, SwapRequest, CreateEventDto } from '../types';

// Helpers to bridge backend <-> frontend type mismatches
const mapStatusToFrontend = (status: string): Event['status'] => {
  switch (status) {
    case 'BUSY':
      return 'scheduled';
    case 'SWAPPABLE':
      return 'swappable';
    case 'SWAP_PENDING':
      return 'swapped';
    default:
      return 'scheduled';
  }
};

const mapStatusToBackend = (status: 'scheduled' | 'swappable'): 'BUSY' | 'SWAPPABLE' => {
  return status === 'swappable' ? 'SWAPPABLE' : 'BUSY';
};

const toFrontendEvent = (e: any): Event => ({
  id: e.id,
  userId: e.userId,
  title: e.title,
  description: undefined,
  startTime: new Date(e.startTime).toISOString(),
  endTime: new Date(e.endTime).toISOString(),
  status: mapStatusToFrontend(e.status),
  createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : new Date().toISOString(),
  updatedAt: e.updatedAt ? new Date(e.updatedAt).toISOString() : new Date().toISOString(),
});

export const auth = {
  login: (data: LoginDto) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),
  register: (data: RegisterDto) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),
  me: () => api.get<AuthResponse>('/auth/me').then((r) => r.data),
};

export const events = {
  list: () =>
    api.get('/events').then((r) => (r.data.events as any[]).map(toFrontendEvent)),
  create: (data: CreateEventDto) =>
    api
      .post('/events', {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        // Backend ignores description; status defaults to BUSY
      })
      .then((r) => toFrontendEvent(r.data.event)),
  updateStatus: (id: string, status: 'scheduled' | 'swappable') =>
    api
      .patch(`/events/${id}/status`, { status: mapStatusToBackend(status) })
      .then((r) => toFrontendEvent(r.data.event)),
  remove: (id: string) => api.delete(`/events/${id}`).then((r) => r.data),
};

export const swaps = {
  swappable: () =>
    api.get('/swaps/swappable-slots').then((r) => (r.data.slots as any[]).map(toFrontendEvent)),
  request: (data: { mySlotId: string; theirSlotId: string }) =>
    api.post('/swaps/swap-request', data).then((r) => r.data),
  respond: (id: string, accept: boolean) =>
    api.post(`/swaps/swap-response/${id}`, { accept }).then((r) => r.data),
  incoming: () => api.get('/swaps/incoming-requests').then((r) => r.data.requests),
  outgoing: () => api.get('/swaps/outgoing-requests').then((r) => r.data.requests),
};