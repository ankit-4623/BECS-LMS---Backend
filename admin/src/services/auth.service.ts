import api from './api';

export interface LoginData {
  userEmail: string;
  password: string;
}

export interface User {
  _id: string;
  userName: string;
  userEmail: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  checkAuth: async (): Promise<{ success: boolean; data: { user: User } }> => {
    const response = await api.get('/auth/check-auth');
    return response.data;
  },
};

export default authService;
