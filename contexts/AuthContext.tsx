'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, AuthResponse, RegisterData, LoginData } from '@/types/auth';
import { authApi } from '@/lib/api/auth';
import { DEMO_USER } from '@/lib/mock-data';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user on mount
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            // Check for demo mode first
            if (localStorage.getItem('isDemoMode') === 'true') {
                setUser(DEMO_USER as User);
                setIsLoading(false);
                return;
            }

            const token = localStorage.getItem('accessToken');

            if (!token) {
                setIsLoading(false);
                return;
            }

            // Verify token/session with backend
            const userData = await authApi.getProfile();
            setUser(userData);
        } catch (error) {
            console.error('Failed to load user:', error);
            // Clear invalid tokens
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('isDemoMode');
        } finally {
            setIsLoading(false);
        }
    };

    const login = useCallback(async (data: LoginData) => {
        // Check for specific demo credentials
        if (data.email === 'demo@facturify.com' && data.password === 'demo123') {
            console.log('🌟 Entering Demo Mode');
            localStorage.setItem('isDemoMode', 'true');
            // Set dummy token so auth guards pass
            localStorage.setItem('accessToken', 'demo-token');
            setUser(DEMO_USER as User);
            return;
        }

        const response: AuthResponse = await authApi.login(data);

        // Clear demo mode if normal login happens
        localStorage.removeItem('isDemoMode');

        // Store tokens
        localStorage.setItem('accessToken', response.tokens.accessToken);
        localStorage.setItem('refreshToken', response.tokens.refreshToken);

        // Set user
        setUser(response.user);
    }, []);

    const register = useCallback(async (data: RegisterData) => {
        console.log('🔐 [AUTH CONTEXT] Starting registration...');

        const response: AuthResponse = await authApi.register(data);

        console.log('✅ [AUTH CONTEXT] Got response:', response);

        // Store tokens
        localStorage.setItem('accessToken', response.tokens.accessToken);
        localStorage.setItem('refreshToken', response.tokens.refreshToken);

        console.log('💾 [AUTH CONTEXT] Tokens stored');

        // Set user
        setUser(response.user);

        console.log('✅ [AUTH CONTEXT] Registration complete! User set:', response.user);
    }, []);

    const logout = useCallback(async () => {
        try {
            if (localStorage.getItem('isDemoMode') !== 'true') {
                await authApi.logout();
            }
        } finally {
            // Clear tokens and user
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('isDemoMode');
            setUser(null);
        }
    }, []);

    const refreshUser = useCallback(async () => {
        await loadUser();
    }, []);

    const value: AuthContextType = React.useMemo(() => ({
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
    }), [user, isLoading, login, register, logout, refreshUser]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
