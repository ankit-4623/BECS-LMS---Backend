import api from '../lib/api';
import type { ApiResponse } from '../lib/api';
import type { LoginInput, SignupInput, User } from '../lib/schemas';

// ============ AUTH SERVICES ============

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface AuthCheckResponse {
  user: User;
}

// Login
export const loginUser = async (data: LoginInput): Promise<ApiResponse<LoginResponse>> => {
  const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', data);
  return response.data;
};

// Register
export const registerUser = async (data: SignupInput): Promise<ApiResponse> => {
  const { confirmPassword, ...registerData } = data;
  const response = await api.post<ApiResponse>('/auth/register', registerData);
  return response.data;
};

// Logout
export const logoutUser = async (): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>('/auth/logout');
  return response.data;
};

// Check Auth
export const checkAuth = async (): Promise<ApiResponse<AuthCheckResponse>> => {
  const response = await api.get<ApiResponse<AuthCheckResponse>>('/auth/check-auth');
  return response.data;
};
