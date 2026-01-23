// User Types
export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  trust: number;
  bio?: string;
  profileImageUrl?: string;
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
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface VerifyEmailRequest {
  token: string;
}

// Person Types
export type Gender = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER' | 'PREFER_NOT_TO_SAY';

export interface Person {
  id: string;
  name: string;
  aliases: string[];
  approximateAge?: number;
  gender?: Gender;
  phoneNumber?: string;
  city?: string;
  state?: string;
  country?: string;
  profileImageUrl?: string;
  twitterHandle?: string;
  igHandle?: string;
  tiktokHandle?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
  };
}

export interface CreatePersonRequest {
  name: string;
  aliases?: string[];
  approximateAge?: number;
  gender?: Gender;
  phoneNumber?: string;
  city?: string;
  state?: string;
  country?: string;
  profileImageUrl?: string;
  twitterHandle?: string;
  igHandle?: string;
  tiktokHandle?: string;
}

export interface UpdatePersonRequest {
  name?: string;
  aliases?: string[];
  approximateAge?: number;
  gender?: Gender;
  phoneNumber?: string;
  city?: string;
  state?: string;
  country?: string;
  profileImageUrl?: string;
  twitterHandle?: string;
  igHandle?: string;
  tiktokHandle?: string;
  isVerified?: boolean;
}

export interface PersonWithPosts {
  person: Person;
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}

// Post Types
export type PostType = 'EXPERIENCE' | 'VETTING_REQUEST' | 'WARNING';

export interface Post {
  id: string;
  authorId: string;
  author?: User;
  type: PostType;
  title: string;
  content: string;
  personId?: string;
  person?: Person;
  category: string;
  tags: string[];
  viewCount: number;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  status: 'active' | 'archived' | 'flagged';
  createdAt: string;
  updatedAt: string;
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface CreatePostRequest {
  type: PostType;
  title: string;
  content: string;
  personId?: string;
  isAnonymous?: boolean;
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

export interface PersonSearchFilters {
  query?: string;
  name?: string;
  phoneNumber?: string;
  city?: string;
  state?: string;
  twitterHandle?: string;
  igHandle?: string;
  tiktokHandle?: string;
  page?: number;
  limit?: number;
}

export interface PersonSearchResult {
  persons: Person[];
  total: number;
  page: number;
  totalPages: number;
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
