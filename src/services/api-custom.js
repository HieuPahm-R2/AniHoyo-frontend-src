// import axios from "axios";

// const baseURL = import.meta.env.VITE_BACKEND_URL;
// const NO_RETRY_HEADER = 'x-no-retry';
// const instance = axios.create({
//     baseURL: baseURL,
//     withCredentials: true
// });
// sending bearer token with axios
// instance.defaults.headers.common = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }

// const handleRefreshToken = async () => {
//     const res = await instance.get("/api/v1/auth/refresh");
//     if (res && res.data) {
//         return res.data.access_token;
//     }
//     return null;
// }
// Add a request interceptor
// instance.interceptors.request.use(function (config) {
//     // Do something before request is sent
//     return config;
// }, function (error) {
//     // Do something with request error
//     return Promise.reject(error);
// });

// Add a response interceptor
// instance.interceptors.response.use(function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response && response.data ? response.data : response;
// }, async function (error) {
//     if (error.config && error.response
//         && +error.response.status === 401
//         && !error.config.headers[NO_RETRY_HEADER]) {
//         const access_token = await handleRefreshToken();
//         error.config.headers[NO_RETRY_HEADER] = 'true' // string val only
//         if (access_token) {
//             error.config.headers['Authorization'] = `Bearer ${access_token}`;
//             localStorage.setItem("access_token", access_token);
//             return instance.request(error.config);
//         }
//     }
//     // handle logic when refresh token and accesstoken expired
//     if (error.config && error.response
//         && +error.response.status === 400
//         && error.config.url === '/api/v1/auth/refresh') {
//         window.location.href = '/login';
//     }
//     // Do something with response error
//     return error.response.data ?? Promise.reject(error);
// });
// export default instance