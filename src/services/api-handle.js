import instance from "./api-custom";

export const callUploadImage = (file, folder) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('folder',folder);
    return instance({
        method: 'post',
        url: '/api/v1/files',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}
export const fetchFilmCategory = () => {
    return instance.get("/api/v1/get-all-category");
}
export const fetchFilmTags = () => {
    return instance.get("/api/v1/get-all-tags");
}
export const callCreateFilmAPI = (thumbnail, slider, name, studio, description, releaseYear, tag, category) => {
    return instance.post('/api/v1/add-film', { thumbnail, slider, name, studio, description, releaseYear, tag, category })
}
export const fetchDataFilmsAPI = () => {
    return instance.get("/api/v1/get-all-films");
}