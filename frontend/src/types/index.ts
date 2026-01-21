// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  trust: number;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface VerifyEmailRequest {
  token: string;
}

// Post Types
export interface Post {
  id: string;
  authorId: string;
  author?: User;
  title: string;
  content: string;
  category: string;
  tags: string[];
  viewCount: number;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  status: 'active' | 'archived' | 'flagged';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
}

// Comment Types
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author?: User;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  postId: string;
  content: string;
}

// Vetting Request Types
export interface VettingRequest {
  id: string;
  postId: string;
  post?: Post;
  requesterId: string;
  requester?: User;
  description: string;
  reward: number;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  claimedBy?: string;
  claimer?: User;
  result?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVettingRequest {
  postId: string;
  description: string;
  reward: number;
}

export interface ClaimVettingRequest {
  vettingRequestId: string;
}

export interface CompleteVettingRequest {
  vettingRequestId: string;
  result: string;
}

// Vote Types
export type VoteType = 'upvote' | 'downvote';

export interface VoteRequest {
  targetId: string;
  targetType: 'post' | 'comment';
  voteType: VoteType;
}

// Search Types
export interface SearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  sortBy?: 'recent' | 'popular' | 'trending';
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchResult {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
}

// Storage Types
export interface FileUploadResponse {
  fileId: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}

// API Error Types
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
