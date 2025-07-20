import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL;
const NO_RETRY_HEADER = 'x-no-retry';
const instance = axios.create({
    baseURL: baseURL,
    withCredentials: true
});
//sending bearer token with axios
instance.defaults.headers.common['Authorization'] = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJ1c2VyIGFjY291bnQiOnsicHJpbmNpcGFsIjp7InBhc3N3b3JkIjpudWxsLCJ1c2VybmFtZSI6ImFkbWluQGdtYWlsLmNvbSIsImF1dGhvcml0aWVzIjpbeyJyb2xlIjoiUk9MRS1VU0VSIn1dLCJhY2NvdW50Tm9uRXhwaXJlZCI6dHJ1ZSwiYWNjb3VudE5vbkxvY2tlZCI6dHJ1ZSwiY3JlZGVudGlhbHNOb25FeHBpcmVkIjp0cnVlLCJlbmFibGVkIjp0cnVlfSwiY3JlZGVudGlhbHMiOm51bGwsImF1dGhvcml0aWVzIjpbeyJyb2xlIjoiUk9MRS1VU0VSIn1dLCJkZXRhaWxzIjpudWxsLCJhdXRoZW50aWNhdGVkIjp0cnVlfSwiZXhwIjoxNzUzNDU5MjMwLCJpYXQiOjE3NTI1OTUyMzB9.pxwGs9XUURPpbzSfT-JwWcB_hVPp7Z29Z21_v6n6Jwyneb80E5b-dOvVskhNbGZOFCVXztqFfclIgfaOVbMHdA`

// const handleRefreshToken = async () => {
//     const res = await instance.get("/api/v1/auth/refresh");
//     if (res && res.data) {
//         return res.data.access_token;
//     }
//     return null;
// }
// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
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
    if (error.config && error.response
        && +error.response.status === 401) {
        return null;
    }
    // handle logic when refresh token and accesstoken expired
    // if (error.config && error.response
    //     && +error.response.status === 400
    //     && error.config.url === '/api/v1/auth/refresh') {
    //     window.location.href = '/login';
    // }
    // Do something with response error
    return error.response.data ?? Promise.reject(error);
});
export default instance