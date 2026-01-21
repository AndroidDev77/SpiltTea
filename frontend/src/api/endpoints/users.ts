import { axiosInstance } from '../client';
import type { User, Post, PaginatedResponse, PaginationParams } from '../../types';

export const usersApi = {
  getUser: async (id: string): Promise<User> => {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  },

  getUserByUsername: async (username: string): Promise<User> => {
    const response = await axiosInstance.get<User>(`/users/username/${username}`);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await axiosInstance.put<User>(`/users/${id}`, data);
    return response.data;
  },

  getUserPosts: async (userId: string, params?: PaginationParams): Promise<PaginatedResponse<Post>> => {
    const response = await axiosInstance.get<PaginatedResponse<Post>>(`/users/${userId}/posts`, { params });
    return response.data;
  },
};
