import axios from "axios";
import { useDispatch } from "react-redux";

const baseURL = import.meta.env.VITE_BACKEND_URL;
const NO_RETRY_HEADER = 'x-no-retry';
const instance = axios.create({
    baseURL: baseURL,
    withCredentials: true
});


// sending bearer token with axios
instance.defaults.headers.common = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }

const handleRefreshToken = async () => {
    // Tạo một instance axios riêng không có Authorization header
    const refreshInstance = axios.create({
        baseURL: baseURL,
        withCredentials: true
    });
    const res = await refreshInstance.get(`/api/v1/auth/refresh`);
    if (res && res.data) {
        return res.data.access_token;
    }
    return null;
}
// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Luôn set Authorization header mới nhất từ localStorage
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Nếu là request login hoặc refresh thì xóa Authorization header
    if (config.url && (config.url.includes('/api/v1/auth/login'))) {
        if (config.headers && config.headers['Authorization']) {
            delete config.headers['Authorization'];
        }
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response;
}, async function (error) {
    // Không thực hiện refresh token nếu là request login hoặc refresh
    if (error.config && error.response
        && +error.response.status === 401
        && !error.config.headers[NO_RETRY_HEADER]
        && !(error.config.url && (error.config.url.includes('/api/v1/auth/login') || error.config.url.includes('/api/v1/auth/refresh')))
    ) {
        const access_token = await handleRefreshToken();
        error.config.headers[NO_RETRY_HEADER] = 'true'
        if (access_token) {
            error.config.headers['Authorization'] = `Bearer ${access_token}`;
            localStorage.setItem("access_token", access_token);
            return instance.request(error.config);
        }
    }
    // handle logic when refresh token and accesstoken expired
    if (error.config && error.response
        && +error.response.status === 400
        && error.config.url === '/api/v1/auth/refresh'
        && location.pathname.startsWith("/admin")) {
        window.location.href = '/login';
        //dispatch redux action
        const message = error?.response?.data?.error ?? "Có lỗi xảy ra, vui lòng login.";
        // useDispatch(setRefreshTokenAction({ status: true, message }));
    }
    // Do something with response error
    return error.response.data ?? Promise.reject(error);
});
export default instance