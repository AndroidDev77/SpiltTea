import { axiosInstance } from '../client';
import type {
  Person,
  CreatePersonRequest,
  UpdatePersonRequest,
  PersonWithPosts,
  PaginationParams,
} from '../../types';

interface PersonSearchResponse {
  persons: Person[];
  total: number;
  page: number;
  totalPages: number;
}

export const personsApi = {
  search: async (query: string, params?: PaginationParams): Promise<PersonSearchResponse> => {
    const response = await axiosInstance.get<PersonSearchResponse>('/persons/search', {
      params: {
        q: query,
        page: params?.page,
        limit: params?.pageSize,
      },
    });
    return response.data;
  },

  getPerson: async (id: string): Promise<Person> => {
    const response = await axiosInstance.get<Person>(`/persons/${id}`);
    return response.data;
  },

  getPersonPosts: async (id: string, params?: PaginationParams): Promise<PersonWithPosts> => {
    const response = await axiosInstance.get<PersonWithPosts>(`/persons/${id}/posts`, {
      params: {
        page: params?.page,
        limit: params?.pageSize,
      },
    });
    return response.data;
  },

  createPerson: async (data: CreatePersonRequest): Promise<Person> => {
    const response = await axiosInstance.post<Person>('/persons', data);
    return response.data;
  },

  updatePerson: async (id: string, data: UpdatePersonRequest): Promise<Person> => {
    const response = await axiosInstance.patch<Person>(`/persons/${id}`, data);
    return response.data;
  },

  deletePerson: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/persons/${id}`);
  },
};
