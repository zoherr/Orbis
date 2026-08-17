import axios from "axios";
import env from "@/config/env.config";


const API = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;

let refreshPromise: Promise<void> | null = null;

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            originalRequest._retry ||
            originalRequest.url?.includes("/auth/refresh")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (!isRefreshing) {
            isRefreshing = true;

            refreshPromise = API.post("/auth/refresh")
                .then(() => {
                    isRefreshing = false;
                })
                .catch((refreshError) => {
                    isRefreshing = false;
                    throw refreshError;
                })
                .finally(() => {
                    refreshPromise = null;
                });
        }

        try {
            await refreshPromise;
            return API(originalRequest);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
);

export default API;