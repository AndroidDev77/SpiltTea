import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api';

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getUser(id),
    enabled: !!id,
  });
};

export const useUserByUsername = (username: string) => {
  return useQuery({
    queryKey: ['user', 'username', username],
    queryFn: () => usersApi.getUserByUsername(username),
    enabled: !!username,
  });
};

export const useUserPosts = (userId: string, params?: { page?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: ['userPosts', userId, params],
    queryFn: () => usersApi.getUserPosts(userId, params),
    enabled: !!userId,
  });
};
