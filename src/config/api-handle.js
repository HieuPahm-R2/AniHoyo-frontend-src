import instance from "./api-custom";

export const callUploadImage = (file, folder) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('folder', folder);
    return instance({
        method: 'post',
        url: '/api/v1/files',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}
export const uploadVideoAPI = (file, folder) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('folder', folder);
    return instance({
        method: 'post',
        url: '/api/v1/upload/video',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}
// Episode
export const createEpisodeAPI = (title, filePath, contentType, seasonId) => {
    return instance.post("/api/v1/add-episode", {
        title, filePath,
        contentType,
        season: {
            "id": seasonId
        }
    })
}
export const fetchAllEpisodeBySeason = (seasonId) => {
    return instance.get(`/api/v1/episodes/by-season/${seasonId}`)
}
// Film
export const fetchFilmCategory = () => {
    return instance.get("/api/v1/categories");
}
export const fetchFilmTags = () => {
    return instance.get("/api/v1/tags");
}
export const callCreateFilmAPI = (thumbnail, slider, name, studio, description, releaseYear, tag, category) => {
    return instance.post('/api/v1/add-film', { thumbnail, slider, name, studio, description, releaseYear, tag, category })
}
export const callUpdateFilmAPI = (id, thumbnail, slider, name, studio, description, releaseYear, tag, category) => {
    return instance.put(`/api/v1/update-film`, { id, thumbnail, slider, name, studio, description, releaseYear, tag, category })
}
export const fetchDataFilmsAPI = (query) => {
    return instance.get(`/api/v1/films?${query}`);
}
// authentication
export const registerAPI = (fullName, email, password) => {
    return instance.post(`/api/v1/auth/register`, { fullName, email, password })
}
export const loginAPI = (username, password) => {
    return instance.post(`/api/v1/auth/login`, { username, password })
}
export const callFetchAccountAPI = () => {
    return instance.get(`/api/v1/auth/account`)
}
export const LogoutAPI = () => {
    return instance.post('/api/v1/auth/logout')
}
// season of film
export const fetchSeasonsOfFilmAPI = (id, query) => {
    return instance.get(`/api/v1/seasons/by-film/${id}?${query}`)
}
export const AddSeasonAPI = (thumb, seasonName, description, type, releaseYear, status, filmId) => {
    return instance.post(`/api/v1/add-season`, { thumb, seasonName, description, type, releaseYear, status, film: { "id": filmId } })
}