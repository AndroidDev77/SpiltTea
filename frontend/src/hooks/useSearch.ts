import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../api';
import type { SearchFilters, PersonSearchFilters } from '../types';

export const useSearch = (filters: SearchFilters) => {
  return useQuery({
    queryKey: ['search', filters],
    queryFn: () => searchApi.search(filters),
    enabled: !!filters.query || !!filters.category || (filters.tags && filters.tags.length > 0),
  });
};

export const useSearchPersons = (filters: PersonSearchFilters) => {
  return useQuery({
    queryKey: ['searchPersons', filters],
    queryFn: () => searchApi.searchPersons(filters),
    enabled: !!(
      filters.query ||
      filters.name ||
      filters.phoneNumber ||
      filters.city ||
      filters.state ||
      filters.twitterHandle ||
      filters.igHandle ||
      filters.tiktokHandle
    ),
  });
};

export const useTrendingPosts = (limit: number = 10) => {
  return useQuery({
    queryKey: ['trending', limit],
    queryFn: () => searchApi.getTrendingPosts(limit),
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => searchApi.getCategories(),
  });
};

export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => searchApi.getTags(),
  });
};
