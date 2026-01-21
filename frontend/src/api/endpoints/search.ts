import { axiosInstance } from '../client';
import type { SearchFilters, SearchResult } from '../../types';

export const searchApi = {
  search: async (filters: SearchFilters): Promise<SearchResult> => {
    const response = await axiosInstance.get<SearchResult>('/search', { params: filters });
    return response.data;
  },

  getTrendingPosts: async (limit: number = 10) => {
    const response = await axiosInstance.get('/search/trending', { params: { limit } });
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await axiosInstance.get<string[]>('/search/categories');
    return response.data;
  },

  getTags: async (): Promise<string[]> => {
    const response = await axiosInstance.get<string[]>('/search/tags');
    return response.data;
  },
};
