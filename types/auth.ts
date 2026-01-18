export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    emailVerified: boolean;
    isActive: boolean;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface LoginData {
    email: string;
    password: string;
}
