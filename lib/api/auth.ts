import apiClient from './client';
import { AuthResponse, RegisterData, LoginData, User } from '@/types/auth';

export const authApi = {
    /**
     * Register a new user
     */
    register: async (data: RegisterData): Promise<AuthResponse> => {
        console.log('📡 [API] Calling /auth/register with:', data);
        console.log('📡 [API] Base URL:', apiClient.defaults.baseURL);

        const response = await apiClient.post<AuthResponse>('/auth/register', data);

        console.log('✅ [API] Response received:', response.data);

        return response.data;
    },

    /**
     * Login with email and password
     */
    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    /**
     * Refresh access token
     */
    refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
        const response = await apiClient.post('/auth/refresh', { refreshToken });
        return response.data;
    },

    /**
     * Get current user profile
     */
    getProfile: async (): Promise<User> => {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
    },

    /**
     * Logout (client-side token removal)
     */
    logout: async (): Promise<void> => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            // Ignore errors, we'll remove tokens anyway
        }
    },
};
