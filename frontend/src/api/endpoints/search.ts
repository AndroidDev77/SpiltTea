import { axiosInstance } from '../client';
import type { SearchFilters, SearchResult, PersonSearchFilters, PersonSearchResult, Post } from '../../types';

export const searchApi = {
  search: async (filters: SearchFilters): Promise<SearchResult> => {
    const response = await axiosInstance.get<SearchResult>('/search', { params: filters });
    return response.data;
  },

  searchPersons: async (filters: PersonSearchFilters): Promise<PersonSearchResult> => {
    const params: Record<string, string | number | undefined> = {};
    if (filters.query) params.q = filters.query;
    if (filters.name) params.name = filters.name;
    if (filters.phoneNumber) params.phoneNumber = filters.phoneNumber;
    if (filters.city) params.city = filters.city;
    if (filters.state) params.state = filters.state;
    if (filters.twitterHandle) params.twitterHandle = filters.twitterHandle;
    if (filters.igHandle) params.igHandle = filters.igHandle;
    if (filters.tiktokHandle) params.tiktokHandle = filters.tiktokHandle;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    const response = await axiosInstance.get<PersonSearchResult>('/search/persons', { params });
    return response.data;
  },

  getTrendingPosts: async (limit: number = 10): Promise<Post[]> => {
    const response = await axiosInstance.get<Post[]>('/search/trending', { params: { limit } });
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
