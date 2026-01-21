import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api';
import type { CreatePostRequest, UpdatePostRequest, CreateCommentRequest, VoteRequest } from '../types';

export const usePosts = (params?: { page?: number; pageSize?: number; category?: string; tags?: string[] }) => {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => postsApi.getPosts(params),
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => postsApi.getPost(id),
    enabled: !!id,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePostRequest) => postsApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostRequest }) => 
      postsApi.updatePost(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => postsApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useComments = (postId: string, params?: { page?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: ['comments', postId, params],
    queryFn: () => postsApi.getComments(postId, params),
    enabled: !!postId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCommentRequest) => postsApi.createComment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
    },
  });
};

export const useVote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: VoteRequest) => postsApi.vote(data),
    onSuccess: (_, variables) => {
      if (variables.targetType === 'post') {
        queryClient.invalidateQueries({ queryKey: ['post', variables.targetId] });
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['comments'] });
      }
    },
  });
};
