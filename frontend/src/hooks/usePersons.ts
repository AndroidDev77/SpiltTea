import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { personsApi } from '../api';
import type { CreatePersonRequest, UpdatePersonRequest } from '../types';

export const useSearchPersons = (query: string, params?: { page?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: ['persons', 'search', query, params],
    queryFn: () => personsApi.search(query, params),
    enabled: query.length > 0,
  });
};

export const usePerson = (id: string) => {
  return useQuery({
    queryKey: ['person', id],
    queryFn: () => personsApi.getPerson(id),
    enabled: !!id,
  });
};

export const usePersonPosts = (id: string, params?: { page?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: ['person', id, 'posts', params],
    queryFn: () => personsApi.getPersonPosts(id, params),
    enabled: !!id,
  });
};

export const useCreatePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePersonRequest) => personsApi.createPerson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persons'] });
    },
  });
};

export const useUpdatePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePersonRequest }) =>
      personsApi.updatePerson(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['person', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['persons'] });
    },
  });
};

export const useDeletePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => personsApi.deletePerson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persons'] });
    },
  });
};
