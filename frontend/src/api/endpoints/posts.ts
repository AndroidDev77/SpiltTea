import { axiosInstance } from '../client';
import type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  Comment,
  CreateCommentRequest,
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

  // Voting
  vote: async (postId: string, voteType: 'UPVOTE' | 'DOWNVOTE'): Promise<{ voteType: string | null; message: string }> => {
    const response = await axiosInstance.post<{ voteType: string | null; message: string }>(`/posts/${postId}/vote`, { voteType });
    return response.data;
  },

  getUserVote: async (postId: string): Promise<{ voteType: string | null }> => {
    const response = await axiosInstance.get<{ voteType: string | null }>(`/posts/${postId}/vote`);
    return response.data;
  },
};
