import { create } from 'zustand';
import { AxiosError } from 'axios';
import API from '@/lib/api';

export interface Orbit {
    _id: string;
    title: string;
    code: string;
    date?: string;
    time?: string;
    type?: "instant" | "scheduled";
    joinTime?: string;
}

export interface OrbitGroup {
    date: string;
    orbits: Orbit[];
}

interface ApiErrorResponse {
    success: false;
    message: string;
}

interface CreateOrbitPayload {
    title: string;
    orbitDate?: string;
    orbitTime?: string;
    type: "instant" | "scheduled";
}

interface UpdateOrbitPayload {
    _id: string;
    title: string;
    orbitDate?: string;
    orbitTime?: string;
    type?: "instant" | "scheduled";
}

interface JoinOrbitPayload {
    id: string;
}

interface OrbitState {
    orbits: OrbitGroup[];
    recentJoinedOrbits: OrbitGroup[];
    currentOrbit: Orbit | null;
    isLoading: boolean;
    error: string | null;
}

interface OrbitActions {
    createOrbit: (payload: CreateOrbitPayload) => Promise<Orbit>;
    getMyOrbits: () => Promise<OrbitGroup[]>;
    getRecentJoinedOrbits: () => Promise<OrbitGroup[]>;
    updateOrbit: (payload: UpdateOrbitPayload) => Promise<Orbit>;
    joinOrbit: (payload: JoinOrbitPayload) => Promise<Orbit>;
    verifyOrbitCode: (code: string) => Promise<Orbit>;
    clearError: () => void;
    reset: () => void;
}

const getErrorMessage = (error: unknown): string => {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    return axiosError?.response?.data?.message ?? 'Something went wrong. Please try again.';
};

const initialState: OrbitState = {
    orbits: [],
    recentJoinedOrbits: [],
    currentOrbit: null,
    isLoading: false,
    error: null,
};

const orbitStore = create<OrbitState & OrbitActions>((set, get) => ({
    ...initialState,

    createOrbit: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await API.post('/orbit/create', payload);
            set({ isLoading: false });
            return data.data;
        } catch (error) {
            const message = getErrorMessage(error);
            set({ isLoading: false, error: message });
            throw new Error(message);
        }
    },

    getMyOrbits: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await API.get('/orbit/my-orbits');
            set({
                orbits: data.data,
                isLoading: false,
            });
            return data.data;
        } catch (error) {
            const message = getErrorMessage(error);
            set({ isLoading: false, error: message });
            throw new Error(message);
        }
    },

    getRecentJoinedOrbits: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await API.get('/orbit/recent-joined');
            set({
                recentJoinedOrbits: data.data,
                isLoading: false,
            });
            return data.data;
        } catch (error) {
            const message = getErrorMessage(error);
            set({ isLoading: false, error: message });
            throw new Error(message);
        }
    },

    updateOrbit: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await API.put('/orbit/update', payload);
            set({ isLoading: false });
            return data.data;
        } catch (error) {
            const message = getErrorMessage(error);
            set({ isLoading: false, error: message });
            throw new Error(message);
        }
    },

    joinOrbit: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await API.post('/orbit/join', payload);
            set({ isLoading: false, currentOrbit: data.data });
            return data.data;
        } catch (error) {
            const message = getErrorMessage(error);
            set({ isLoading: false, error: message });
            throw new Error(message);
        }
    },
    verifyOrbitCode: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await API.get(`/orbit/verify/${code}`);
            set({ isLoading: false, currentOrbit: data.data });
            return data.data;
        } catch (error) {
            const message = getErrorMessage(error);
            set({ isLoading: false, error: message });
            throw new Error(message);
        }
    },

    clearError: () => set({ error: null }),

    reset: () => set({ ...initialState }),
}));

export default orbitStore;