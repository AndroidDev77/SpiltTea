import { axiosInstance } from '../client';
import type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  Comment,
  CreateCommentRequest,
  VoteRequest,
  PaginatedResponse,
  PaginationParams,
} from '../../types';

export const postsApi = {
  // Posts
  getPosts: async (params?: PaginationParams & { category?: string; tags?: string[] }): Promise<PaginatedResponse<Post>> => {
    const response = await axiosInstance.get<{ posts: Post[]; total: number; page: number; totalPages: number }>('/posts', {
      params: {
        page: params?.page,
        limit: params?.pageSize,
        type: params?.category,
      },
    });
    // Transform backend response to match frontend PaginatedResponse type
    return {
      data: response.data.posts,
      total: response.data.total,
      page: response.data.page,
      pageSize: params?.pageSize || 20,
      totalPages: response.data.totalPages,
    };
  },

  getPost: async (id: string): Promise<Post> => {
    const response = await axiosInstance.get<Post>(`/posts/${id}`);
    return response.data;
  },

  createPost: async (data: CreatePostRequest): Promise<Post> => {
    const response = await axiosInstance.post<Post>('/posts', data);
    return response.data;
  },

  updatePost: async (id: string, data: UpdatePostRequest): Promise<Post> => {
    const response = await axiosInstance.put<Post>(`/posts/${id}`, data);
    return response.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/posts/${id}`);
  },

  // Comments
  getComments: async (postId: string, params?: PaginationParams): Promise<PaginatedResponse<Comment>> => {
    const response = await axiosInstance.get<PaginatedResponse<Comment>>(`/posts/${postId}/comments`, { params });
    return response.data;
  },

  createComment: async (data: CreateCommentRequest): Promise<Comment> => {
    const response = await axiosInstance.post<Comment>('/comments', data);
    return response.data;
  },

  deleteComment: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/comments/${id}`);
  },

  // Votes
  vote: async (data: VoteRequest): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/votes', data);
    return response.data;
  },

  removeVote: async (targetId: string, targetType: 'post' | 'comment'): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`/votes/${targetId}`, { params: { targetType } });
    return response.data;
  },
};
