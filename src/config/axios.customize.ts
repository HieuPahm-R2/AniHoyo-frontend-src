
import { setRefreshTokenAction } from "@/context/slice/accountSlice";
import { IBackendRes } from "@/types/backend";
import { notification } from "antd";
import axios from "axios";

interface AccessTokenResponse {
    access_token: string;
}
const NO_RETRY_HEADER = 'x-no-retry';

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL as string,
    withCredentials: true
});

// Deduplicate concurrent refresh calls — all 401 handlers share one in-flight promise
let refreshTokenPromise: Promise<string | null> | null = null;

const handleRefreshToken = async (): Promise<string | null> => {
    if (refreshTokenPromise) return refreshTokenPromise;

    refreshTokenPromise = (async () => {
        try {
            const res = await instance.get('/api/v1/auth/refresh') as unknown as IBackendRes<AccessTokenResponse>;
            if (res && res.data) return res.data.access_token;
            return null;
        } catch (error) {
            return null;
        } finally {
            refreshTokenPromise = null;
        }
    })();

    return refreshTokenPromise;
};

// Request interceptor — attach access token
instance.interceptors.request.use(function (config) {
    if (typeof window !== "undefined" && window && window.localStorage && window.localStorage.getItem('access_token')) {
        config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
    }
    if (!config.headers.Accept) {
        config.headers.Accept = "application/json";
    }
    if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json; charset=utf-8";
    }
    return config;
});

// Response interceptor — handle token refresh on 401
instance.interceptors.response.use(
    (res) => res.data,
    async (error) => {
        // Guard: no response means network error — reject immediately
        if (!error.response) {
            return Promise.reject(error);
        }

        const status = +error.response.status;

        // 401 on a normal API call (not login/refresh, not already retried) → try refresh
        if (
            status === 401
            && error.config
            && error.config.url !== '/api/v1/auth/login'
            && error.config.url !== '/api/v1/auth/refresh'
            && !error.config.headers[NO_RETRY_HEADER]
        ) {
            const access_token = await handleRefreshToken();
            error.config.headers[NO_RETRY_HEADER] = 'true';
            if (access_token) {
                error.config.headers['Authorization'] = `Bearer ${access_token}`;
                localStorage.setItem('access_token', access_token);
                return instance.request(error.config);
            }
            // Refresh returned null — token could not be refreshed
            // Let LayoutApp handle the redirect via Redux
            const message = error?.response?.data?.error ?? "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.";
            dispatch(setRefreshTokenAction({ status: true, message }));
            return Promise.reject(error);
        }

        // 401 on the refresh endpoint itself — refresh token is expired
        if (
            status === 401
            && error.config
            && error.config.url === '/api/v1/auth/refresh'
        ) {
            const message = error?.response?.data?.error ?? "Có lỗi xảy ra, vui lòng login.";
            dispatch(setRefreshTokenAction({ status: true, message }));
        }

        if (status === 403) {
            notification.error({
                message: error?.response?.data?.message ?? "",
                description: error?.response?.data?.error ?? ""
            });
        }

        return error?.response?.data ?? Promise.reject(error);
    }
);

export default instance;

let dispatch: any;

export const injectStore = (_dispatch: any) => {
    dispatch = _dispatch;
};
