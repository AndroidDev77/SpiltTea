import { axiosInstance } from '../client';
import type {
  VettingRequest,
  CreateVettingRequest,
  ClaimVettingRequest,
  CompleteVettingRequest,
  PaginatedResponse,
  PaginationParams,
} from '../../types';

export const vettingApi = {
  getVettingRequests: async (params?: PaginationParams & { status?: string }): Promise<PaginatedResponse<VettingRequest>> => {
    const response = await axiosInstance.get<PaginatedResponse<VettingRequest>>('/vetting', { params });
    return response.data;
  },

  getVettingRequest: async (id: string): Promise<VettingRequest> => {
    const response = await axiosInstance.get<VettingRequest>(`/vetting/${id}`);
    return response.data;
  },

  createVettingRequest: async (data: CreateVettingRequest): Promise<VettingRequest> => {
    const response = await axiosInstance.post<VettingRequest>('/vetting', data);
    return response.data;
  },

  claimVettingRequest: async (data: ClaimVettingRequest): Promise<VettingRequest> => {
    const response = await axiosInstance.post<VettingRequest>('/vetting/claim', data);
    return response.data;
  },

  completeVettingRequest: async (data: CompleteVettingRequest): Promise<VettingRequest> => {
    const response = await axiosInstance.post<VettingRequest>('/vetting/complete', data);
    return response.data;
  },

  cancelVettingRequest: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/vetting/${id}`);
  },
};
