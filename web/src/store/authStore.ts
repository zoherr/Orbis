import { create } from 'zustand';
import { AxiosError } from 'axios';
import API from '@/lib/api';

interface User {
    fullName: string;
    email: string;
    username: string;
    profileImage?: string;
}

interface ApiErrorResponse {
    success: false;
    message: string;
}

interface RegisterPayload {
    fullName: string;
    email: string;
    username: string;
    password: string;
    otp: number;
}

interface ForgotPasswordPayload {
    email: string;
    newPassword: string;
    otp: number;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    activationToken: string | null;
    usernameAvailable: boolean
}

interface AuthActions {
    initiateAuth: (email: string) => Promise<{ isExistingUser: boolean }>;
    register: (payload: RegisterPayload) => Promise<User>;
    login: (email: string, password: string) => Promise<User>;
    getMe: () => Promise<User>;
    logout: () => Promise<void>;
    changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
    sendForgotPasswordOTP: (email: string) => Promise<void>;
    forgotPassword: (payload: ForgotPasswordPayload) => Promise<void>;
    checkUsername: (username: string) => Promise<void>;
    reSendOTP: (email: string) => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

const getErrorMessage = (error: unknown): string => {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    return axiosError?.response?.data?.message ?? 'Something went wrong. Please try again.';
};

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    activationToken: null,
    usernameAvailable: false
};

const authStore = create<AuthState & AuthActions>((set, get) => ({
    ...initialState,

    initiateAuth: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await API.post('/auth/init', { email });

            set({
                isLoading: false,
                activationToken: data.activationToken ?? null,
            });

            return { isExistingUser: data.isExistingUser };
        } catch (error) {
            const message = getErrorMessage(error);
            set({ isLoading: false, error: message });
            throw new Error(message);
        }
    },

    register: async (payload) => {
        const activationToken = get().activationToken;

        if (!activationToken) {
            const message = 'Activation token missing. Please request a new OTP.';
            set({ error: message });
            throw new Error(message);
        }

        set({ isLoading: true, error: null });
        try {
            const { data } = await API.post('/auth/register', {
                ...payload,
                activationToken,
            });

            set({
                user: data.user,
                isAuthenticated: true,
                isLoading: false,
                activationToken: null,
            });

            return data.user;
        } catch (error) {
            const message = getErrorMessage(error);
            set({ isLoading: false, error: message });
            throw new Error(message);
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await API.post('/auth/login', { email, password });

            set({
                user: data.user,
                isAuthenticated: true,
                isLoading: false,
            });

            return data.user;
        } catch (error) {
            const message = getErrorMessage(error);
            set({ isLoading: false, error: message, isAuthenticated: false });
            throw new Error(message);
        }
    },

    getMe: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await API.get('/auth/me');

            set({
                user: data.user,
                isAuthenticated: true,
                isLoading: false,
            });

            return data.user;
        } catch (error) {
            const message = getErrorMessage(error);
            set({ isLoading: false,  user: null, isAuthenticated: false });
            throw new Error(message);
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await API.post('/auth/logout');
            set({ ...initialState });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ isLoading: false, error: message });
            throw new Error(message);
        }
    },

    changePassword: async (oldPassword, newPassword) => {
        set({ isLoading: true, error: null });
        try {
            await API.post('/auth/change-password', { oldPassword, newPassword });
            set({ isLoading: false });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ isLoading: false, error: message });
            throw new Error(message);
        }
    },

    sendForgotPasswordOTP: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await API.post('/auth/forgot-password-otp', { email });
            set({ isLoading: false, activationToken: data.activationToken ?? null });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ isLoading: false, error: message });
            throw new Error(message);
        }
    },

    forgotPassword: async (payload) => {
        const activationToken = get().activationToken;

        if (!activationToken) {
            const message = 'Activation token missing. Please request a new OTP.';
            set({ error: message });
            throw new Error(message);
        }

        set({ isLoading: true, error: null });
        try {
            await API.post('/auth/forgot-password', {
                ...payload,
                activationToken,
            });

            set({ isLoading: false, activationToken: null });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ isLoading: false, error: message });
            throw new Error(message);
        }
    },
    checkUsername: async (username) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await API.get(`/auth/check-username?username=${username}`);
            set({ isLoading: false, usernameAvailable: data.available ?? false });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ isLoading: false, error: message });
            throw new Error(message);
        }
    },
    reSendOTP: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await API.post('/auth/resend-otp', { email });
            set({ isLoading: false, activationToken: data.activationToken ?? null });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ isLoading: false, error: message });
            throw new Error(message);
        }
    },

    clearError: () => set({ error: null }),

    reset: () => set({ ...initialState }),
}));

export default authStore;